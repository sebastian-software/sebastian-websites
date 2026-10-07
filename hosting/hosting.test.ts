import assert from "node:assert/strict"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { type BunnyApi, isJson, type Json } from "./bunny.ts"
import { loadBunnyImages } from "./images.ts"
import { originRequest, planPath, publicPath } from "./middleware-logic.ts"
import { cacheRules, provision, pullZoneSettings } from "./provision.ts"
import { checksum, loadAssets, publish } from "./publish.ts"
import { runSmoke, smokeChecks } from "./smoke.ts"
import {
  ASSET_TARGET,
  buildableTargets,
  IMAGE_EXTENSIONS,
  type Target,
  TARGETS,
} from "./targets.ts"
import { checksFor } from "./verify.ts"

const target: Target = {
  buildDirectory: "apps/software/build/software-en/client",
  corsExtensions: [],
  name: "sebastian-websites-software-en",
}

const MOVED_PERMANENTLY = 301
const NOT_FOUND = 404
const OK = 200

type Call = { readonly body?: unknown; readonly method: string; readonly path: string }

/**
 * A Bunny account with or without a fully configured target.
 *
 * @param options - Whether the target already exists.
 * @param options.provisioned - Whether resources already exist.
 * @param options.target - Optional target whose resources are modeled.
 * @returns A fake API, its call log, and the current middleware script.
 */
function account(options: { readonly provisioned: boolean; readonly target?: Target }) {
  const deployedTarget = options.target ?? target
  const calls: Call[] = []
  const middlewareName = `${deployedTarget.name}-middleware`
  let storage: Json | undefined = options.provisioned
    ? { Id: 1, Name: deployedTarget.name, Password: "secret", Region: "DE", Rewrite404To200: false }
    : undefined
  let pull: Json | undefined = options.provisioned
    ? {
        EdgeRules: cacheRules(deployedTarget).map((rule, index) => ({
          ...rule,
          Guid: `rule-${index}`,
        })),
        Hostnames: [],
        Id: 2,
        MiddlewareScriptId: 3,
        Name: deployedTarget.name,
        StorageZoneId: 1,
        ...pullZoneSettings(deployedTarget),
      }
    : undefined
  let script: Json | undefined = options.provisioned
    ? { Code: "", Id: 3, Name: middlewareName }
    : undefined
  const api: BunnyApi = async (method, path, body) => {
    calls.push({ body, method, path })
    if (method === "GET") {
      if (path.startsWith("/storagezone?")) return storage === undefined ? [] : [storage]
      if (path.startsWith("/pullzone?")) return pull === undefined ? [] : [pull]
      if (path.startsWith("/compute/script?"))
        return { Items: script === undefined ? [] : [script] }
      if (path === "/storagezone/1") return structuredClone(storage)
      if (path === "/pullzone/2") return structuredClone(pull)
      if (path === "/compute/script/3/code") return { Code: script?.Code }
    }
    if (method === "POST" && path === "/storagezone") {
      storage = { Id: 1, Password: "secret", Rewrite404To200: true, ...(isJson(body) ? body : {}) }
      return storage
    }
    if (method === "POST" && path === "/pullzone") {
      pull = {
        EdgeRules: [],
        Hostnames: [],
        Id: 2,
        MiddlewareScriptId: 0,
        ...(isJson(body) ? body : {}),
      }
      return pull
    }
    if (method === "POST" && path === "/compute/script") {
      script = { Id: 3, ...(isJson(body) ? body : {}) }
      return script
    }
    if (method === "POST" && path === "/storagezone/1" && storage !== undefined) {
      Object.assign(storage, body)
      return
    }
    if (method === "POST" && path === "/pullzone/2" && pull !== undefined) {
      Object.assign(pull, body)
      return
    }
    if (
      method === "POST" &&
      path === "/pullzone/2/edgerules/addOrUpdate" &&
      pull !== undefined &&
      isJson(body)
    ) {
      const rules = Array.isArray(pull.EdgeRules) ? pull.EdgeRules.filter(isJson) : []
      pull.EdgeRules = [
        ...rules.filter((rule) => rule.Guid !== body.Guid),
        { ...body, Guid: body.Guid ?? "new" },
      ]
      return
    }
    if (
      method === "POST" &&
      path === "/compute/script/3/code" &&
      script !== undefined &&
      isJson(body)
    ) {
      script.Code = body.Code
      return
    }
    if (
      method === "POST" &&
      (path === "/compute/script/3/publish" || path === "/pullzone/2/purgeCache")
    ) {
      return
    }
    throw new Error(`Unexpected call ${method} ${path}`)
  }
  return { api, calls, script: () => script }
}

const silent = (): void => undefined

const isPost = (call: Call, path: string): boolean => call.method === "POST" && call.path === path

const isDelete = (
  entry: { readonly method: string; readonly url: string },
  suffix: string
): boolean => entry.method === "DELETE" && entry.url.endsWith(suffix)

/**
 * A storage zone holding an old home page, an unchanged asset, and a stale file.
 *
 * @param unchanged - The bytes of the asset that must not be uploaded again.
 * @returns A fake fetch and the requests it received.
 */
function storageFixture(unchanged: Uint8Array): {
  readonly request: typeof fetch
  readonly requests: ReadonlyArray<{ readonly method: string; readonly url: string }>
} {
  const requests: Array<{ readonly method: string; readonly url: string }> = []
  const request: typeof fetch = async (input, init) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    requests.push({ method, url })
    if (method === "GET" && url.endsWith(`/${target.name}/`)) {
      return Response.json([
        { IsDirectory: true, ObjectName: "assets" },
        { Checksum: "OLD", IsDirectory: false, ObjectName: "index.html" },
        { Checksum: "X", IsDirectory: false, ObjectName: "stale.html" },
      ])
    }
    if (method === "GET" && url.endsWith("/assets/")) {
      return Response.json([
        { Checksum: checksum(unchanged), IsDirectory: false, ObjectName: "app.js" },
      ])
    }
    return new Response(null, { status: method === "GET" ? NOT_FOUND : OK })
  }
  return { request, requests }
}

test("a provisioned target needs no writes once its middleware code is current", async () => {
  const bunny = account({ provisioned: true })
  await provision(bunny.api, target, silent)
  const code = bunny.script()?.Code
  assert.equal(typeof code, "string")
  bunny.calls.length = 0
  await provision(bunny.api, target, silent)
  assert.ok(
    bunny.calls.every((call) => call.method === "GET"),
    "second run reads only"
  )
})

test("an empty account gets storage, pull zone, rules, and a linked middleware", async () => {
  const bunny = account({ provisioned: false })
  const log: string[] = []
  const ids = await provision(bunny.api, target, (message) => log.push(message))
  assert.deepEqual(ids, { pullZoneId: 2, storageId: 1 })
  const writes = bunny.calls.filter((call) => call.method === "POST").map((call) => call.path)
  assert.ok(writes.includes("/storagezone"))
  assert.ok(writes.includes("/pullzone"))
  assert.ok(writes.includes("/compute/script"))
  assert.ok(writes.includes("/compute/script/3/publish"))
  assert.equal(writes.filter((path) => path === "/pullzone/2/edgerules/addOrUpdate").length, 2)
  const link = bunny.calls.find((call) => isPost(call, "/pullzone/2"))
  assert.deepEqual(link?.body, { MiddlewareScriptId: 3 })
  assert.ok(log.some((line) => line.includes("Created storage zone")))
  assert.ok(
    String(bunny.script()?.Code).includes(target.name),
    "the bundle carries its storage zone"
  )
})

test("publishing uploads changed files, keeps unchanged ones, removes stale ones, and purges", async () => {
  const bunny = account({ provisioned: true })
  const unchanged = new TextEncoder().encode("same")
  const assets = [
    { bytes: new TextEncoder().encode("<html>"), path: "index.html" },
    { bytes: unchanged, path: "assets/app.js" },
    { bytes: new TextEncoder().encode("<html>"), path: "imprint/index.html" },
  ]
  const { request, requests } = storageFixture(unchanged)
  const result = await publish({
    api: bunny.api,
    assets,
    ids: { pullZoneId: 2, storageId: 1 },
    log: silent,
    request,
    target,
  })
  assert.deepEqual(result, { removed: 1, uploaded: 2 })
  const puts = requests
    .filter((entry) => entry.method === "PUT")
    .map((entry) => entry.url.split(`/${target.name}/`)[1])
  assert.deepEqual(
    puts,
    ["index.html", "imprint/index.html"],
    "documents go last, unchanged assets are skipped"
  )
  assert.ok(requests.some((entry) => isDelete(entry, "/stale.html")))
  assert.ok(bunny.calls.some((call) => call.path === "/pullzone/2/purgeCache"))
})

test("paths resolve to index files, trailing slashes redirect, files pass through", () => {
  assert.deepEqual(planPath("/"), { kind: "rewrite", pathname: "/index.html" })
  assert.deepEqual(planPath("/imprint"), { kind: "rewrite", pathname: "/imprint/index.html" })
  assert.deepEqual(planPath("/imprint/"), { kind: "redirect", pathname: "/imprint" })
  assert.deepEqual(planPath("/a/b//"), { kind: "redirect", pathname: "/a/b" })
  assert.deepEqual(planPath("/assets/app.js"), { kind: "rewrite", pathname: "/assets/app.js" })
  assert.deepEqual(planPath("/sitemap.xml"), { kind: "rewrite", pathname: "/sitemap.xml" })
  assert.equal(publicPath("/zone/imprint", "zone"), "/imprint")
  assert.equal(publicPath("/zone", "zone"), "/")
  assert.equal(publicPath("/imprint", "zone"), "/imprint")
})

test("the middleware rewrites origin requests and redirects visitors to canonical paths", () => {
  const rewritten = originRequest(
    new Request("https://origin.example/zone/imprint", {
      headers: { cookie: "a=b", referer: "x" },
    }),
    "zone"
  )
  assert.ok(rewritten instanceof Request)
  assert.equal(new URL(rewritten.url).pathname, "/zone/imprint/index.html")
  assert.equal(rewritten.headers.get("cookie"), null)
  const redirected = originRequest(
    new Request("https://origin.example/imprint/?q=1", {
      headers: { "cdn-host": "sebastian-software.com", "x-forwarded-proto": "https" },
    }),
    "zone"
  )
  assert.ok(redirected instanceof Response)
  assert.equal(redirected.status, MOVED_PERMANENTLY)
  // The cache key ignores query strings, so redirects must not carry them.
  assert.equal(redirected.headers.get("location"), "https://sebastian-software.com/imprint")
})

type LegacyCase = {
  readonly host: string
  readonly location: null | string
  readonly path: string
  readonly status: number
  readonly zone: string
}

const GONE = 410
const CONSULTING_DE = "sebastian-websites-consulting-de"
const CONSULTING_EN = "sebastian-websites-consulting-en"
const SOFTWARE_DE = "sebastian-websites-software-de"
const SOFTWARE_EN = "sebastian-websites-software-en"

// Every legacy rule of ADR-0010 with its expected answer, in both languages
// where the rule depends on the host's language.
const LEGACY_CASES: readonly LegacyCase[] = [
  // CON-LOC and CON-CROSS: the prefix decides the language, the host does not.
  ...[
    ["/de", "https://sebastian-consulting.de/"],
    ["/de/", "https://sebastian-consulting.de/"],
    ["/de/werner", "https://sebastian-consulting.de/werner"],
    ["/de/fastner/", "https://sebastian-consulting.de/fastner"],
    ["/de/fastner/projektprofil", "https://sebastian-consulting.de/fastner/project-profile"],
    ["/de/imprint", "https://sebastian-consulting.de/imprint"],
    ["/de/privacy", "https://sebastian-consulting.de/privacy"],
    ["/en", "https://sebastian-consulting.com/"],
    ["/en/werner/", "https://sebastian-consulting.com/werner"],
    ["/en/fastner/projektprofil", "https://sebastian-consulting.com/fastner/project-profile"],
  ].flatMap(([path, location]) =>
    [
      [CONSULTING_DE, "sebastian-consulting.de"],
      [CONSULTING_EN, "sebastian-consulting.com"],
    ].map(([zone, host]) => ({ host, location, path, status: MOVED_PERMANENTLY, zone }))
  ),
  {
    host: "sebastian-consulting.de",
    location: "https://sebastian-consulting.de/fastner/project-profile",
    path: "/fastner/projektprofil",
    status: MOVED_PERMANENTLY,
    zone: CONSULTING_DE,
  },
  {
    host: "sebastian-consulting.com",
    location: null,
    path: "/pdfs/offer-global-saas-ai-localization-en.pdf",
    status: GONE,
    zone: CONSULTING_EN,
  },
  // Software: moves to Consulting keep the host's language.
  ...[
    ["/fastner", "/fastner"],
    ["/werner/", "/werner"],
    ["/consulting", "/"],
    ["/team", "/team"],
  ].flatMap(([path, moved]) => [
    {
      host: "sebastian-software.de",
      location: `https://sebastian-consulting.de${moved}`,
      path,
      status: MOVED_PERMANENTLY,
      zone: SOFTWARE_DE,
    },
    {
      host: "sebastian-software.com",
      location: `https://sebastian-consulting.com${moved}`,
      path,
      status: MOVED_PERMANENTLY,
      zone: SOFTWARE_EN,
    },
  ]),
  // Moves within a site keep the visitor's host, including the origin host.
  {
    host: "sebastian-software.de",
    location: "https://sebastian-software.de/company",
    path: "/mission",
    status: MOVED_PERMANENTLY,
    zone: SOFTWARE_DE,
  },
  {
    host: `${SOFTWARE_EN}.b-cdn.net`,
    location: `https://${SOFTWARE_EN}.b-cdn.net/privacy`,
    path: "/privacy-policy",
    status: MOVED_PERMANENTLY,
    zone: SOFTWARE_EN,
  },
  {
    host: "sebastian-software.com",
    location: null,
    path: "/testimonials",
    status: GONE,
    zone: SOFTWARE_EN,
  },
  {
    host: "sebastian-software.de",
    location: null,
    path: "/testimonial/a-b",
    status: GONE,
    zone: SOFTWARE_DE,
  },
]

test("legacy paths redirect permanently or answer 410 as ADR-0010 states", () => {
  for (const legacy of LEGACY_CASES) {
    const response = originRequest(
      new Request(`https://origin.example/${legacy.zone}${legacy.path}?trk=a`, {
        headers: { "cdn-host": legacy.host, "x-forwarded-proto": "https" },
      }),
      legacy.zone
    )
    const label = `${legacy.zone} ${legacy.path}`
    assert.ok(response instanceof Response, label)
    assert.equal(response.status, legacy.status, label)
    assert.equal(response.headers.get("location"), legacy.location, label)
  }
})

test("current, unknown, and other sites' paths are not legacy redirects", () => {
  for (const [zone, path] of [
    [CONSULTING_DE, "/werner"],
    [CONSULTING_DE, "/de/unknown"],
    [CONSULTING_EN, "/team"],
    [SOFTWARE_DE, "/company"],
    [SOFTWARE_DE, "/testimonial"],
    ["sebastian-websites-opensource-en", "/team"],
    ["sebastian-websites-brand", "/de"],
  ] as const) {
    const response = originRequest(new Request(`https://origin.example/${zone}${path}`), zone)
    assert.ok(response instanceof Request, `${zone} ${path}`)
    assert.equal(new URL(response.url).pathname, `/${zone}${path}/index.html`)
  }
})

test("targets cover every variant, the brand site, and the build-free asset zone", () => {
  assert.equal(TARGETS.length, 10)
  assert.ok(TARGETS.every((entry) => entry.name.startsWith("sebastian-websites-")))
  assert.ok(
    TARGETS.filter((entry) => entry.assets !== true)
      .filter((entry) => entry.name !== "sebastian-websites-brand")
      .every((entry) => entry.hostname === undefined),
    "no variant is active yet"
  )
  const brand = TARGETS.find((entry) => entry.name === "sebastian-websites-brand")
  assert.deepEqual(brand?.corsExtensions, ["css", "svg", "png"])
  assert.equal(brand.hostname, "brand.sebastian-software.com")
})

test("only assets enable Optimizer, with distinct variants and open image and font CORS", () => {
  for (const entry of TARGETS) {
    assert.equal(pullZoneSettings(entry).OptimizerEnabled, entry.assets === true)
  }
  const settings = pullZoneSettings(ASSET_TARGET)
  for (const field of [
    "OptimizerEnableManipulationEngine",
    "OptimizerEnableWebP",
    "EnableAvifVary",
    "EnableWebpVary",
    "EnableAccessControlOriginHeader",
  ]) {
    assert.equal(settings[field], true)
  }
  for (const field of [
    "IgnoreQueryStrings",
    "OptimizerAutomaticOptimizationEnabled",
    "OptimizerEnableUpscaling",
    "OptimizerMinifyCSS",
    "OptimizerMinifyJavaScript",
    "OptimizerForceClasses",
  ]) {
    assert.equal(settings[field], false)
  }
  assert.deepEqual(settings.AccessControlOriginHeaderExtensions, ASSET_TARGET.corsExtensions)
  assert.ok(ASSET_TARGET.corsExtensions.includes("woff2"))
  assert.ok(ASSET_TARGET.corsExtensions.includes("css"))
  assert.equal(ASSET_TARGET.hostname, "assets.sebastian-software.com")
  assert.deepEqual(buildableTargets("/missing-build-root"), [ASSET_TARGET])
})

test("an asset zone is provisioned without HTML rules or middleware and converges", async () => {
  const assetTarget = { ...ASSET_TARGET, hostname: undefined }
  const bunny = account({ provisioned: false, target: assetTarget })
  await provision(bunny.api, assetTarget, silent)
  assert.ok(bunny.calls.every((call) => !call.path.startsWith("/compute/")))
  const rules = bunny.calls.filter((call) => call.path.endsWith("/edgerules/addOrUpdate"))
  assert.equal(rules.length, 3)
  const rule = rules[0].body
  assert.ok(isJson(rule))
  assert.equal(rule.Description, "websites: images are cached for a year")
  assert.ok(Array.isArray(rule.Triggers))
  const patterns = rule.Triggers.filter(isJson).flatMap((trigger) => {
    assert.ok(Array.isArray(trigger.PatternMatches))
    assert.ok(trigger.PatternMatches.length <= 5, "Bunny permits five patterns per trigger")
    return trigger.PatternMatches.filter(
      (pattern: unknown): pattern is string => typeof pattern === "string"
    )
  })
  assert.deepEqual(
    patterns,
    IMAGE_EXTENSIONS.map((extension) => `*.${extension}*`)
  )
  const fontRule = rules[1].body
  assert.ok(isJson(fontRule))
  assert.equal(fontRule.Description, "websites: font binaries are immutable")
  assert.ok(JSON.stringify(fontRule.ExtraActions).includes("public, max-age=31536000, immutable"))
  const cssRule = rules[2].body
  assert.ok(isJson(cssRule))
  assert.equal(cssRule.Description, "websites: font stylesheets are purged on publish")
  assert.ok(JSON.stringify(cssRule.ExtraActions).includes("public, max-age=300"))
  bunny.calls.length = 0
  await provision(bunny.api, assetTarget, silent)
  assert.ok(bunny.calls.every((call) => call.method === "GET"))
})

/**
 * Models storage persisting an original's checksum between publishes.
 *
 * @param bytes - The source content expected at upload time.
 * @returns A storage request function and the number of uploads.
 */
function originalStorage(bytes: Uint8Array) {
  let remoteChecksum: string | undefined
  let uploads = 0
  const request: typeof fetch = async (input, init) => {
    assert.notEqual(init?.method, "DELETE", "manually uploaded font files must survive")
    if (init?.method === "PUT") {
      assert.deepEqual(init.body, bytes, "publishing preserves the original bytes")
      remoteChecksum = checksum(bytes)
      uploads += 1
      return new Response(null, { status: OK })
    }
    return Response.json(
      String(input).endsWith("/shooting-2024/")
        ? [{ Checksum: remoteChecksum, IsDirectory: false, ObjectName: "shoot-3.jpg" }]
        : [
            { IsDirectory: true, ObjectName: "shooting-2024" },
            { Checksum: "FONT", IsDirectory: false, ObjectName: "manually-uploaded.woff2" },
          ]
    )
  }
  return { request, uploads: () => uploads }
}

test("publishing photos preserves manual fonts and skips unchanged bytes on the second run", async () => {
  const bunny = account({ provisioned: true, target: ASSET_TARGET })
  const bytes = new TextEncoder().encode("original JPEG bytes")
  const assets = [{ bytes, path: "shooting-2024/shoot-3.jpg" }]
  const storage = originalStorage(bytes)
  const options = {
    api: bunny.api,
    assets,
    ids: { pullZoneId: 2, storageId: 1 },
    log: silent,
    request: storage.request,
    target: ASSET_TARGET,
  }
  assert.deepEqual(await publish(options), { removed: 0, uploaded: 1 })
  assert.deepEqual(await publish(options), { removed: 0, uploaded: 0 })
  assert.equal(storage.uploads(), 1)
  assert.equal(
    bunny.calls.filter((call) => call.path.endsWith("/purgeCache")).length,
    1,
    "unchanged shared files must not flush image variants on the next deployment"
  )
})

test("immutable image uploads preserve older files and skip both unchanged bytes and cache purges", async () => {
  const bunny = account({ provisioned: true, target: ASSET_TARGET })
  const bytes = new TextEncoder().encode("original JPEG bytes")
  const storage = originalStorage(bytes)
  const options = {
    api: bunny.api,
    assets: [{ bytes, path: "shooting-2024/shoot-3.jpg" }],
    ids: { pullZoneId: 2, storageId: 1 },
    log: silent,
    purgeCache: false,
    request: storage.request,
    target: ASSET_TARGET,
  }
  assert.deepEqual(await publish(options), { removed: 0, uploaded: 1 })
  assert.deepEqual(await publish(options), { removed: 0, uploaded: 0 })
  assert.ok(bunny.calls.every((call) => !call.path.endsWith("/purgeCache")))
})

test("image manifests select hashed originals and reject traversal or changed bytes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bunny-images-"))
  try {
    assert.deepEqual(await loadBunnyImages(directory), [])
    await mkdir(join(directory, "_bunny"))
    await mkdir(join(directory, "images"))
    const bytes = new TextEncoder().encode("original")
    const path = `images/${checksum(bytes).toLowerCase()}.png`
    await writeFile(join(directory, path), bytes)
    const manifest = join(directory, "_bunny/images.json")
    await writeFile(manifest, JSON.stringify([path, path]))
    assert.deepEqual(await loadBunnyImages(directory), [{ bytes, path }])
    const buildAssets = await loadAssets(directory)
    assert.ok(buildAssets.every((asset) => !asset.path.startsWith("_bunny/")))
    await writeFile(join(directory, path), "changed")
    await assert.rejects(loadBunnyImages(directory), /checksum mismatch/v)
    await writeFile(manifest, JSON.stringify(["../private.png"]))
    await assert.rejects(loadBunnyImages(directory), /Invalid Bunny image manifest/v)
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})

test("asset sources need no index, exclude private metadata, and reject empty collections", async () => {
  const directory = await mkdtemp(join(tmpdir(), "website-assets-"))
  try {
    await assert.rejects(loadAssets(directory), /refusing an empty publish/v)
    await mkdir(join(directory, "shooting-2024"))
    await mkdir(join(directory, ".private"))
    await writeFile(join(directory, ".private", "permission.txt"), "private")
    await writeFile(join(directory, ".DS_Store"), "metadata")
    await writeFile(join(directory, "shooting-2024", "shoot-3.jpg"), "original")
    const assets = await loadAssets(directory)
    assert.deepEqual(
      assets.map((asset) => asset.path),
      ["shooting-2024/shoot-3.jpg"]
    )
    assert.equal(new TextDecoder().decode(assets[0].bytes), "original")
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})

test("verification checks the home page, one route both ways, a missing path, and CORS assets", () => {
  const assets = [
    { bytes: new Uint8Array(), path: "index.html" },
    { bytes: new Uint8Array(), path: "privacy/index.html" },
    { bytes: new Uint8Array(), path: "tokens/software.css" },
  ]
  const checks = checksFor({ ...target, corsExtensions: ["css"] }, assets)
  assert.deepEqual(
    checks.map((check) => [check.path, check.status]),
    [
      ["/", OK],
      ["/no-such-page-verification", NOT_FOUND],
      ["/privacy", OK],
      ["/privacy/", MOVED_PERMANENTLY],
      ["/tokens/software.css", OK],
    ]
  )
})

test("asset verification checks the font stylesheet without assuming a website", () => {
  const assets = [{ bytes: new Uint8Array(), path: "fonts/fonts.css" }]
  assert.deepEqual(checksFor(ASSET_TARGET, assets), [
    { cors: true, path: "/fonts/fonts.css", status: OK },
  ])
})

/**
 * A fetch that answers with the given statuses in order, then 404.
 *
 * @param statuses - The statuses of the successive responses.
 * @returns The fake fetch.
 */
function answering(statuses: readonly number[]): typeof fetch {
  const queue = [...statuses]
  return async () => {
    await Promise.resolve()
    return new Response(null, { status: queue.shift() ?? NOT_FOUND })
  }
}

test("the cutover smoke checks cover the home page, a missing path, and every legacy rule", async () => {
  const origin = "https://sebastian-consulting.de"
  const checks = smokeChecks("consulting-de", origin)
  assert.deepEqual(checks.slice(0, 2), [
    { path: "/", status: OK },
    { path: "/no-such-page-smoke", status: NOT_FOUND },
  ])
  assert.deepEqual(
    checks.filter((check) => check.path === "/en/fastner/projektprofil"),
    [
      {
        location: "https://sebastian-consulting.com/fastner/project-profile",
        path: "/en/fastner/projektprofil",
        status: MOVED_PERMANENTLY,
      },
    ]
  )
  assert.deepEqual(
    smokeChecks("software-en", "https://sebastian-software.com").filter(
      (check) => check.path === "/testimonial/example"
    ),
    [{ path: "/testimonial/example", status: GONE }]
  )
  assert.deepEqual(await runSmoke(origin, checks.slice(0, 2), answering([OK, OK])), [
    "/no-such-page-smoke: 200 , expected 404 ",
  ])
})
