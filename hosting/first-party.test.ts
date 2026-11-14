import assert from "node:assert/strict"
import { test } from "node:test"

import { bundleMiddleware } from "./bundle.ts"
import {
  type CollectorForwarding,
  collectorPath,
  firstPartyOriginRequest,
  FORWARD_SECRET_NAME,
  forwardToCollector,
  originRequest,
  signForwarded,
  visitorOf,
} from "./middleware-logic.ts"
import { cacheRules, contentTypeRules } from "./provision.ts"
import { collectorOf, DEFAULT_COLLECTOR_PREFIX, type Target, TARGETS } from "./targets.ts"
import { checksFor } from "./verify.ts"

const SECRET = "a-forwarder-secret-of-32-characters!"
const NOW = new Date("2026-11-13T10:00:00Z")
const NOW_SECONDS = 1_794_564_000
const COLLECTOR: CollectorForwarding = { host: "collector.test", prefix: "/_s", site: "example" }
const ROUTE = { forwarding: COLLECTOR, path: "/e" }
const SITE = { forwarding: COLLECTOR, storageZone: "zone" }
const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
const BODY = '{"kind":"pageview","url":"https://example.com/a"}'
const OK = 200
const NO_CONTENT = 204
const METHOD_NOT_ALLOWED = 405
const PAYLOAD_TOO_LARGE = 413
const BAD_GATEWAY = 502
const SERVICE_UNAVAILABLE = 503
const LARGE_BODY_BYTES = 9000

type Sent = {
  readonly body: Uint8Array
  readonly headers: Headers
  readonly method: string
  readonly url: string
}

/**
 * A collector stand-in that records what reaches it.
 *
 * @param answer - The response it gives.
 * @returns The fake fetch and the requests it received.
 */
function collector(answer: () => Response): {
  readonly fetch: typeof fetch
  readonly sent: Sent[]
} {
  const sent: Sent[] = []
  const fake: typeof fetch = async (input, init) => {
    const body = init?.body
    sent.push({
      body: body instanceof Uint8Array ? body : new Uint8Array(),
      headers: new Headers(init?.headers),
      method: init?.method ?? "GET",
      url: String(input),
    })
    return answer()
  }
  return { fetch: fake, sent }
}

const dependencies = (fake: typeof fetch, secret: string | undefined = SECRET) => ({
  fetch: fake,
  now: () => NOW,
  secret,
})

/**
 * A beacon as the browser sends it, with every header a visitor could use to
 * smuggle an address or credentials to the collector.
 *
 * @param headers - Extra or replaced headers.
 * @returns The request as Bunny hands it to the middleware.
 */
function beacon(headers: Record<string, string> = {}): Request {
  return new Request("https://origin.example/zone/_s/e", {
    body: BODY,
    headers: {
      authorization: "Bearer visitor",
      "cdn-requestcountrycode": "fr",
      "content-type": "text/plain",
      cookie: "session=1",
      forwarded: "for=192.0.2.9",
      "sec-gpc": "1",
      "tereon-client-ip": "192.0.2.10",
      "tereon-signature": "0".repeat(64),
      "user-agent": CHROME,
      "x-forwarded-for": "198.51.100.23, 192.0.2.11",
      "x-real-ip": "198.51.100.23",
      ...headers,
    },
    method: "POST",
  })
}

test("only paths below the prefix map to the collector", () => {
  assert.equal(collectorPath("/_s/e", "/_s"), "/e")
  assert.equal(collectorPath("/_s/t.js", "/_s"), "/t.js")
  assert.equal(collectorPath("/_s", "/_s"), undefined)
  assert.equal(collectorPath("/_shop/e", "/_s"), undefined)
  assert.equal(collectorPath("/e", "/_s"), undefined)
})

test("the visitor's address and country are read like the collector reads them", () => {
  assert.deepEqual(
    visitorOf(new Headers({ "cdn-requestcountrycode": "de", "x-real-ip": " 2001:db8::1 " })),
    { country: "DE", ip: "2001:db8::1" }
  )
  assert.deepEqual(visitorOf(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })), {
    country: "",
    ip: "203.0.113.7",
  })
  assert.deepEqual(
    visitorOf(new Headers({ "cdn-requestcountrycode": "XYZ", "x-real-ip": "<script>" })),
    { country: "", ip: "" }
  )
})

test("signatures match the collector's published test vector", async () => {
  // The same vector is checked in Tereon's src/collector/forwarding.test.ts.
  const signature = await signForwarded("0123456789abcdef0123456789abcdef", {
    body: new TextEncoder().encode('{"kind":"pageview"}'),
    country: "DE",
    ip: "203.0.113.7",
    method: "POST",
    path: "/e",
    site: "example",
    time: 1_800_000_000,
    userAgent: "Mozilla/5.0",
  })
  assert.equal(signature, "bddaa98947d202822e7ed55a95eb26d968e5afbc0f500e55af0a938ff6b5a95a")
})

test("a beacon reaches the collector signed, without cookies, credentials, or visitor address headers", async () => {
  const upstream = collector(
    () =>
      new Response(null, {
        headers: { "cache-control": "public, max-age=60", "set-cookie": "x=1" },
        status: NO_CONTENT,
      })
  )
  const response = await forwardToCollector(beacon(), ROUTE, dependencies(upstream.fetch))
  assert.equal(response.status, NO_CONTENT)
  assert.equal(response.headers.get("cache-control"), "no-store")
  assert.equal(response.headers.get("set-cookie"), null)
  const sent = upstream.sent.at(0)
  assert.ok(sent !== undefined)
  assert.equal(sent.url, "https://collector.test/e")
  assert.equal(sent.method, "POST")
  assert.equal(new TextDecoder().decode(sent.body), BODY)
  assert.deepEqual([...sent.headers.keys()].sort(), [
    "content-type",
    "sec-gpc",
    "tereon-client-country",
    "tereon-client-ip",
    "tereon-forwarded-at",
    "tereon-forwarder",
    "tereon-signature",
    "user-agent",
  ])
  assert.equal(sent.headers.get("tereon-client-ip"), "198.51.100.23")
  assert.equal(sent.headers.get("tereon-client-country"), "FR")
  assert.equal(sent.headers.get("tereon-forwarder"), "example")
  assert.equal(sent.headers.get("tereon-forwarded-at"), String(NOW_SECONDS))
  const expected = await signForwarded(SECRET, {
    body: new TextEncoder().encode(BODY),
    country: "FR",
    ip: "198.51.100.23",
    method: "POST",
    path: "/e",
    site: "example",
    time: NOW_SECONDS,
    userAgent: CHROME,
  })
  assert.equal(sent.headers.get("tereon-signature"), expected)
})

test("the client script keeps the collector's caching and type", async () => {
  const upstream = collector(
    () =>
      new Response("/* tereon */", {
        headers: {
          "cache-control": "public, max-age=3600",
          "content-type": "text/javascript; charset=utf-8",
          "set-cookie": "x=1",
        },
      })
  )
  const request = new Request("https://origin.example/zone/_s/t.js", {
    headers: { cookie: "session=1", "user-agent": CHROME },
  })
  const route = { forwarding: COLLECTOR, path: "/t.js" }
  const response = await forwardToCollector(request, route, dependencies(upstream.fetch))
  assert.equal(response.status, OK)
  assert.equal(await response.text(), "/* tereon */")
  assert.equal(response.headers.get("cache-control"), "public, max-age=3600")
  assert.equal(response.headers.get("content-type"), "text/javascript; charset=utf-8")
  assert.equal(response.headers.get("set-cookie"), null)
  assert.equal(upstream.sent[0]?.url, "https://collector.test/t.js")
  assert.equal(upstream.sent[0]?.headers.get("cookie"), null)
})

test("without its secret the middleware forwards nothing and says so, uncached", async () => {
  for (const secret of [undefined, "", "too-short"]) {
    const upstream = collector(() => new Response(null, { status: NO_CONTENT }))
    const response = await forwardToCollector(beacon(), ROUTE, {
      fetch: upstream.fetch,
      now: () => NOW,
      secret,
    })
    assert.equal(response.status, SERVICE_UNAVAILABLE)
    assert.equal(response.headers.get("cache-control"), "no-store")
    assert.equal(upstream.sent.length, 0)
  }
})

test("other methods, large bodies, and an unreachable collector get uncached errors", async () => {
  const upstream = collector(() => new Response(null, { status: NO_CONTENT }))
  const put = new Request("https://origin.example/_s/e", { body: "x", method: "PUT" })
  const refused = await forwardToCollector(put, ROUTE, dependencies(upstream.fetch))
  assert.equal(refused.status, METHOD_NOT_ALLOWED)
  const large = beacon({ "content-length": String(LARGE_BODY_BYTES) })
  const tooLarge = await forwardToCollector(large, ROUTE, dependencies(upstream.fetch))
  assert.equal(tooLarge.status, PAYLOAD_TOO_LARGE)
  assert.equal(upstream.sent.length, 0)
  const unreachable = await forwardToCollector(beacon(), ROUTE, dependencies(failing))
  assert.equal(unreachable.status, BAD_GATEWAY)
  assert.equal(unreachable.headers.get("cache-control"), "no-store")
})

test("a site with a collector still serves every other path from storage", async () => {
  const upstream = collector(() => new Response(null, { status: NO_CONTENT }))
  const page = new Request("https://origin.example/zone/imprint", { headers: { cookie: "a=b" } })
  const rewritten = await firstPartyOriginRequest(page, SITE, dependencies(upstream.fetch))
  assert.ok(rewritten instanceof Request)
  const plain = originRequest(page, "zone")
  assert.ok(plain instanceof Request)
  assert.equal(rewritten.url, plain.url)
  assert.equal(upstream.sent.length, 0)
  const forwarded = await firstPartyOriginRequest(beacon(), SITE, dependencies(upstream.fetch))
  assert.ok(forwarded instanceof Response)
  assert.equal(upstream.sent[0]?.url, "https://collector.test/e")
})

const failing: typeof fetch = async () => {
  throw new TypeError("network down")
}

const site: Target = {
  collector: { host: "collector.test", site: "example" },
  corsExtensions: [],
  hostname: "example.com",
  name: "sebastian-websites-example",
}

test("collector settings default the prefix and refuse unusable values", () => {
  assert.deepEqual(collectorOf(site), { host: "collector.test", prefix: "/_s", site: "example" })
  assert.equal(DEFAULT_COLLECTOR_PREFIX, "/_s")
  const withCollector = (settings: NonNullable<Target["collector"]>): Target => ({
    ...site,
    collector: settings,
  })
  for (const prefix of ["", "/", "_s", "/a/b", "/assets", "/x y"]) {
    assert.throws(() =>
      collectorOf(withCollector({ host: "collector.test", prefix, site: "example" }))
    )
  }
  for (const host of ["example.com", "sebastian-websites-example.b-cdn.net", "https://c.test"]) {
    assert.throws(() => collectorOf(withCollector({ host, site: "example" })))
  }
  assert.throws(() => collectorOf(withCollector({ host: "collector.test", site: "Example Site" })))
})

test("no target has a collector yet, so every site keeps its middleware and rules", async () => {
  assert.ok(TARGETS.every((target) => target.collector === undefined))
  for (const target of TARGETS.filter((entry) => entry.assets !== true)) {
    assert.deepEqual(cacheRules(target), cacheRules())
  }
  const plain = await bundleMiddleware("zone")
  assert.ok(!plain.includes("tereon"))
  assert.ok(!plain.includes(FORWARD_SECRET_NAME))
})

test("a collector target bundles its host and the secret's name, never a secret", async () => {
  const code = await bundleMiddleware("zone", collectorOf(site))
  assert.ok(code.includes('"collector.test"'))
  assert.ok(code.includes(FORWARD_SECRET_NAME))
  assert.ok(code.includes("onOriginRequest"))
  assert.ok(!code.includes(SECRET))
})

test("the endpoint is never cached; the script is cached like a document", () => {
  const rules = cacheRules(site)
  const documents = rules.find(
    (rule) => rule.Description === "websites: documents are purged on publish"
  )
  assert.deepEqual(documents?.Triggers, [
    { PatternMatches: ["*/assets/*", "*/_s/e", "*/_s/e?*"], PatternMatchingType: 2, Type: 0 },
  ])
  const endpoint = rules.find(
    (rule) => rule.Description === "websites: the analytics endpoint is never cached"
  )
  assert.ok(endpoint)
  assert.equal(endpoint.ActionParameter1, "0")
  assert.deepEqual(endpoint.Triggers, [
    { PatternMatches: ["*/_s/e", "*/_s/e?*"], PatternMatchingType: 0, Type: 0 },
  ])
  assert.deepEqual(endpoint.ExtraActions, [
    { ActionParameter1: "0", ActionType: 16 },
    { ActionParameter1: "Cache-Control", ActionParameter2: "no-store", ActionType: 5 },
  ])
  // Later rules move up by one, so order indexes stay distinct.
  const indexes = [...rules, ...contentTypeRules(site)].map((rule) => rule.OrderIndex)
  assert.equal(new Set(indexes).size, indexes.length)
})

test("verification fetches the client script through the site where a collector is set", () => {
  assert.deepEqual(checksFor(site, []).at(-1), { path: "/_s/t.js", status: OK, text: "tereon" })
  const first = TARGETS.at(0)
  assert.ok(first !== undefined)
  assert.ok(checksFor(first, []).every((check) => !check.path.startsWith("/_s")))
})
