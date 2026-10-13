import assert from "node:assert/strict"
import { test } from "node:test"

import type { Fetch } from "./bunny.ts"
import type { Asset } from "./publish.ts"

import { createRobots, createSeoLinks, createSitemap } from "../packages/web-core/src/seo.ts"
import { getSiteVariant, type Locale } from "../packages/web-core/src/sites.ts"
import { seoPlanFor, verifySeo } from "./seo.ts"
import { ASSET_TARGET, type Target, TARGETS } from "./targets.ts"
import { verify } from "./verify.ts"

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const paths = ["/", "/team"]
const german = getSiteVariant("consulting", "de")
const english = getSiteVariant("consulting", "en")
const target: Target = {
  corsExtensions: [],
  name: german.deploymentTarget,
  notFoundPage: "/404/index.html",
}

function asset(path: string, text: string): Asset {
  return { bytes: encoder.encode(text), path }
}

function html(locale: Locale, path: string): string {
  const links = createSeoLinks("consulting", locale, path)
    .map((link) => {
      const language = link.hrefLang === undefined ? "" : ` hreflang="${link.hrefLang}"`
      return `<link rel="${link.rel}" href="${link.href}"${language}>`
    })
    .join("")
  return `<html lang="${locale}"><head><title>Consulting</title>${links}</head><body><h1>Consulting</h1></body></html>`
}

function build(locale: Locale = "de"): readonly Asset[] {
  return [
    asset("index.html", html(locale, "/")),
    asset("team/index.html", html(locale, "/team")),
    asset("404/index.html", '<html><head><meta name="robots" content="noindex"></head></html>'),
    asset("pdfs/profile.pdf", "PDF download"),
    asset("sitemap.xml", createSitemap("consulting", locale, paths)),
    asset("robots.txt", createRobots("consulting", locale)),
  ]
}

function replaceAsset(
  assets: readonly Asset[],
  path: string,
  change: (text: string) => string
): readonly Asset[] {
  return assets.map((entry) =>
    entry.path === path ? asset(path, change(decoder.decode(entry.bytes))) : entry
  )
}

test("SEO preflight covers every build page and excludes the 404 and PDF downloads", () => {
  for (const locale of ["de", "en"] as const) {
    const variant = getSiteVariant("consulting", locale)
    const plan = seoPlanFor({ ...target, name: variant.deploymentTarget }, build(locale))
    assert.ok(plan)
    assert.deepEqual(plan.paths, paths)
    assert.equal(plan.variant, variant)
  }
  assert.equal(seoPlanFor(ASSET_TARGET, []), undefined)
  const brand = TARGETS.find((entry) => entry.name === "sebastian-websites-brand")
  assert.ok(brand)
  assert.equal(seoPlanFor(brand, []), undefined)
})

test("SEO preflight rejects missing crawl files and incomplete, duplicate, or foreign sitemap URLs", () => {
  for (const path of ["sitemap.xml", "robots.txt"]) {
    assert.throws(
      seoPlanFor.bind(
        null,
        target,
        build().filter((entry) => entry.path !== path)
      ),
      /build lacks/v
    )
  }
  const invalidSitemaps = [
    createSitemap("consulting", "de", ["/"]),
    createSitemap("consulting", "en", paths),
    createSitemap("consulting", "de", ["/", "/de/team"]),
    `${createSitemap("consulting", "de", ["/", "/team/"])}<extra/>`,
    createSitemap("consulting", "de", paths).replace(
      "</urlset>",
      "<url><loc>https://sebastian-consulting.de/team</loc></url></urlset>"
    ),
    '<urlset xmlns="https://example.com"><url><loc>/team</loc></url></urlset>',
  ]
  for (const sitemap of invalidSitemaps) {
    assert.throws(
      () =>
        seoPlanFor(
          target,
          replaceAsset(build(), "sitemap.xml", () => sitemap)
        ),
      /sitemap|XML/iv
    )
  }
})

test("SEO preflight rejects wrong or duplicate canonicals, missing alternates, and indexing blocks", () => {
  const invalid: ReadonlyArray<{
    readonly change: (text: string) => string
    readonly error: RegExp
  }> = [
    {
      change: (text) => text.replace('rel="canonical"', 'rel="stylesheet"'),
      error: /self-referencing canonical/v,
    },
    {
      change: (text) =>
        text.replace(
          'rel="canonical" href="https://sebastian-consulting.de/team"',
          'rel="canonical" href="https://sebastian-consulting.de/"'
        ),
      error: /self-referencing canonical/v,
    },
    {
      change: (text) =>
        text.replace(
          "</head>",
          '<link rel="canonical" href="https://sebastian-consulting.de/team"></head>'
        ),
      error: /self-referencing canonical/v,
    },
    {
      change: (text) => text.replace('hreflang="en"', 'hreflang="fr"'),
      error: /alternates/v,
    },
    {
      change: (text) =>
        text.replace(
          'href="https://sebastian-consulting.com/team"',
          'href="https://sebastian-consulting.com/"'
        ),
      error: /alternates/v,
    },
    {
      change: (text) => text.replace('lang="de"', 'lang="en"'),
      error: /document language/v,
    },
    {
      change: (text) =>
        text.replace("</head>", '<meta content="follow, NOINDEX" name="Robots"></head>'),
      error: /blocks indexing/v,
    },
    {
      change: (text) => text.replace("</head>", '<meta name="googlebot" content="none"></head>'),
      error: /blocks indexing/v,
    },
  ]
  for (const { change, error } of invalid) {
    assert.throws(() => seoPlanFor(target, replaceAsset(build(), "team/index.html", change)), error)
  }
})

test("SEO markup parsing ignores link-shaped strings in comments and scripts", () => {
  const hidden = '<link rel="canonical" href="https://sebastian-consulting.de/team">'
  const assets = replaceAsset(build(), "team/index.html", (text) =>
    text.replace(
      "</head>",
      `<!--${hidden}--><script type="application/json">${JSON.stringify(hidden)}</script></head>`
    )
  )
  assert.ok(seoPlanFor(target, assets))
  const missing = replaceAsset(assets, "team/index.html", (text) =>
    text.replace('rel="canonical"', 'rel="stylesheet"')
  )
  assert.throws(() => seoPlanFor(target, missing), /self-referencing canonical/v)
  const nofollow = replaceAsset(build(), "team/index.html", (text) =>
    text.replace("</head>", '<meta name="robots" content="nofollow"></head>')
  )
  assert.ok(seoPlanFor(target, nofollow), "nofollow does not block indexing")
})

test("SEO preflight rejects crawl blocks and another origin's robots sitemap", () => {
  const invalid = [
    createRobots("consulting", "de").replace("Allow: /", "Disallow: /"),
    createRobots("consulting", "en"),
  ]
  for (const robots of invalid) {
    assert.throws(
      () =>
        seoPlanFor(
          target,
          replaceAsset(build(), "robots.txt", () => robots)
        ),
      /robots.txt/v
    )
  }
  assert.ok(
    seoPlanFor(
      target,
      replaceAsset(build(), "robots.txt", (text) => `# Crawl policy\n${text}`)
    )
  )
})

type Answer = { readonly body: string; readonly headers?: HeadersInit; readonly status?: number }

function routePath(path: string): string {
  if (path === "index.html") return "/"
  if (path.endsWith("/index.html")) return `/${path.slice(0, -"/index.html".length)}`
  return `/${path}`
}

function responses(): Map<string, Answer> {
  const result = new Map<string, Answer>()
  for (const variant of [german, english]) {
    const origin = `https://${variant.deploymentTarget}.b-cdn.net`
    for (const entry of build(variant.locale)) {
      const path = routePath(entry.path)
      result.set(`${origin}${path}`, { body: decoder.decode(entry.bytes) })
    }
  }
  return result
}

function requestFor(pages: ReturnType<typeof responses>, visited: string[] = []): Fetch {
  return async (input, init) => {
    const url = String(input)
    visited.push(url)
    assert.equal(init?.redirect, "manual")
    assert.ok(init.signal instanceof AbortSignal)
    const answer = pages.get(url)
    return new Response(answer?.body ?? "Missing", {
      headers: answer?.headers,
      status: answer?.status ?? (answer === undefined ? 404 : 200),
    })
  }
}

test("published SEO verification checks both language documents and both crawl files", async () => {
  const plan = seoPlanFor(target, build())
  assert.ok(plan)
  const visited: string[] = []
  await verifySeo(plan, requestFor(responses(), visited))
  for (const variant of [german, english]) {
    for (const path of paths) {
      assert.ok(visited.includes(`https://${variant.deploymentTarget}.b-cdn.net${path}`))
    }
  }
  assert.ok(visited.includes(`https://${german.deploymentTarget}.b-cdn.net/sitemap.xml`))
  assert.ok(visited.includes(`https://${german.deploymentTarget}.b-cdn.net/robots.txt`))
})

test("published SEO verification rejects redirects, missing translations, noindex headers, and stale metadata", async () => {
  const plan = seoPlanFor(target, build())
  assert.ok(plan)
  const de = `https://${german.deploymentTarget}.b-cdn.net`
  const en = `https://${english.deploymentTarget}.b-cdn.net`
  const invalid: ReadonlyArray<{
    readonly answer: Answer
    readonly error: RegExp
    readonly url: string
  }> = [
    {
      answer: { body: "Moved", headers: { Location: `${de}/` }, status: 301 },
      error: /HTTP 301/v,
      url: `${de}/team`,
    },
    { answer: { body: "Missing", status: 404 }, error: /HTTP 404/v, url: `${en}/team` },
    {
      answer: { body: html("de", "/team"), headers: { "X-Robots-Tag": "noindex" } },
      error: /X-Robots-Tag/v,
      url: `${de}/team`,
    },
    { answer: { body: html("en", "/") }, error: /canonical/v, url: `${en}/team` },
    {
      answer: { body: html("en", "/team").replace('hreflang="de"', 'hreflang="fr"') },
      error: /alternates/v,
      url: `${en}/team`,
    },
    {
      answer: { body: createSitemap("consulting", "de", ["/"]) },
      error: /sitemap.xml/v,
      url: `${de}/sitemap.xml`,
    },
    {
      answer: { body: "User-agent: *\nDisallow: /" },
      error: /robots.txt/v,
      url: `${de}/robots.txt`,
    },
  ]
  for (const { answer, error, url } of invalid) {
    const pages = responses()
    pages.set(url, answer)
    await assert.rejects(verifySeo(plan, requestFor(pages)), error)
  }
})

test("deployment verification runs the SEO contract alongside the existing hosting checks", async () => {
  const origin = `https://${german.deploymentTarget}.b-cdn.net`
  const pages = responses()
  pages.set(`${origin}/no-such-page-verification`, { body: "data-not-found", status: 404 })
  pages.set(`${origin}/team/`, {
    body: "Moved",
    headers: { Location: `${origin}/team` },
    status: 301,
  })
  const visited: string[] = []
  const messages: string[] = []
  await verify({
    assets: build(),
    log(message) {
      messages.push(message)
    },
    request: requestFor(pages, visited),
    target,
  })
  assert.ok(visited.includes(`https://${english.deploymentTarget}.b-cdn.net/team`))
  assert.ok(messages.some((message) => message.includes("2 SEO pages")))
})
