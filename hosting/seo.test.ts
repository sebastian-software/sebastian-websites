import assert from "node:assert/strict"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { test } from "node:test"

import type { Fetch } from "./bunny.ts"
import type { Asset } from "./publish.ts"

import { createRobots, createSeoLinks, createSitemap } from "../packages/web-core/src/seo.ts"
import { getSiteVariant, type Locale } from "../packages/web-core/src/sites.ts"
import { checkBuilds, readBuildTime } from "./check-builds.ts"
import { type SeoPlan, seoPlans, type SiteBuild, verifySeo } from "./seo.ts"
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

const englishTarget: Target = { ...target, name: english.deploymentTarget }

/**
 * Plans the German Consulting build against an unchanged English one.
 *
 * @param assets - The German build.
 * @returns The German plan.
 */
function planOf(assets: readonly Asset[]): SeoPlan | undefined {
  return seoPlans([
    { assets, target },
    { assets: build("en"), target: englishTarget },
  ]).get(target.name)
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
  const brand = TARGETS.find((entry) => entry.name === "sebastian-websites-brand")
  assert.ok(brand)
  const plans = seoPlans([
    { assets: build("de"), target },
    { assets: build("en"), target: englishTarget },
    { assets: [], target: ASSET_TARGET },
    { assets: [], target: brand },
  ])
  assert.deepEqual([...plans.keys()], [german.deploymentTarget, english.deploymentTarget])
  for (const variant of [german, english]) {
    const plan = plans.get(variant.deploymentTarget)
    assert.ok(plan)
    assert.deepEqual(plan.paths, paths)
    assert.deepEqual(plan.absent, [])
    assert.equal(plan.variant, variant)
    assert.deepEqual(plan.alternates.get("/team"), [
      { href: "https://sebastian-consulting.de/team", language: "de" },
      { href: "https://sebastian-consulting.com/team", language: "en" },
      { href: "https://sebastian-consulting.com/team", language: "x-default" },
    ])
  }
})

test("SEO preflight rejects missing crawl files and incomplete, duplicate, or foreign sitemap URLs", () => {
  for (const path of ["sitemap.xml", "robots.txt"]) {
    assert.throws(() => planOf(build().filter((entry) => entry.path !== path)), /build lacks/v)
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
      () => planOf(replaceAsset(build(), "sitemap.xml", () => sitemap)),
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
    assert.throws(() => planOf(replaceAsset(build(), "team/index.html", change)), error)
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
  assert.ok(planOf(assets))
  const missing = replaceAsset(assets, "team/index.html", (text) =>
    text.replace('rel="canonical"', 'rel="stylesheet"')
  )
  assert.throws(() => planOf(missing), /self-referencing canonical/v)
  const nofollow = replaceAsset(build(), "team/index.html", (text) =>
    text.replace("</head>", '<meta name="robots" content="nofollow"></head>')
  )
  assert.ok(planOf(nofollow), "nofollow does not block indexing")
})

test("SEO preflight rejects crawl blocks and another origin's robots sitemap", () => {
  const invalid = [
    createRobots("consulting", "de").replace("Allow: /", "Disallow: /"),
    createRobots("consulting", "en"),
  ]
  for (const robots of invalid) {
    assert.throws(() => planOf(replaceAsset(build(), "robots.txt", () => robots)), /robots.txt/v)
  }
  assert.ok(planOf(replaceAsset(build(), "robots.txt", (text) => `# Crawl policy\n${text}`)))
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

test("published SEO verification checks every document and both crawl files of its origin", async () => {
  const plan = planOf(build())
  assert.ok(plan)
  const visited: string[] = []
  await verifySeo(plan, requestFor(responses(), visited))
  const origin = `https://${german.deploymentTarget}.b-cdn.net`
  assert.deepEqual(visited, [
    `${origin}/sitemap.xml`,
    `${origin}/robots.txt`,
    ...paths.map((path) => `${origin}${path}`),
  ])
})

test("published SEO verification rejects redirects, missing pages, noindex headers, and stale metadata", async () => {
  const plans = seoPlans([
    { assets: build("de"), target },
    { assets: build("en"), target: englishTarget },
  ])
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
    const plan = plans.get(new URL(url).hostname.split(".")[0])
    assert.ok(plan)
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
    seo: planOf(build()),
    target,
  })
  assert.ok(visited.includes(`${origin}/team`))
  assert.ok(visited.includes(`${origin}/sitemap.xml`))
  assert.ok(messages.some((message) => message.includes("2 SEO pages")))
  messages.length = 0
  await verify({
    assets: build(),
    log: (message) => messages.push(message),
    request: requestFor(pages),
    target,
  })
  assert.ok(
    messages.some((message) => message.includes("0 SEO pages")),
    "no plan, no SEO checks"
  )
})

const softwareDe = getSiteVariant("software", "de")
const softwareEn = getSiteVariant("software", "en")
const softwareTargets: Readonly<Record<Locale, Target>> = {
  de: { ...target, name: softwareDe.deploymentTarget },
  en: { ...target, name: softwareEn.deploymentTarget },
}

type Page = {
  readonly article?: boolean
  readonly counterpart?: boolean
  readonly path: string
}

function softwareHtml(locale: Locale, page: Page): string {
  const links = createSeoLinks("software", locale, {
    counterpart: page.counterpart ?? true,
    path: page.path,
  })
    .map((link) => {
      const language = link.hrefLang === undefined ? "" : ` hreflang="${link.hrefLang}"`
      return `<link rel="${link.rel}" href="${link.href}"${language}>`
    })
    .join("")
  const canonical = createSeoLinks("software", locale, page.path)[0].href
  const type = `<meta property="og:type" content="${page.article === true ? "article" : "website"}">`
  const url = `<meta property="og:url" content="${canonical}">`
  return `<html lang="${locale}"><head><title>Software</title>${links}${type}${url}</head><body><h1>Software</h1></body></html>`
}

function softwareBuild(locale: Locale, pages: readonly Page[], buildTime?: string): SiteBuild {
  const all: readonly Page[] = [{ path: "/" }, { path: "/blog" }, ...pages]
  return {
    assets: [
      ...all.map((page) =>
        asset(
          page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`,
          softwareHtml(locale, page)
        )
      ),
      asset("404/index.html", '<html><head><meta name="robots" content="noindex"></head></html>'),
      asset(
        "sitemap.xml",
        createSitemap(
          "software",
          locale,
          all.map((page) => page.path)
        )
      ),
      asset("robots.txt", createRobots("software", locale)),
    ],
    ...(buildTime === undefined ? {} : { buildTime }),
    target: softwareTargets[locale],
  }
}

const englishPost: Page = { article: true, counterpart: false, path: "/blog/english-only" }
const englishArchive: Page = { counterpart: false, path: "/blog/tags/architecture" }
const pairedPost: Page = { article: true, path: "/blog/pair" }

function softwarePlans(de: readonly Page[], en: readonly Page[]): ReadonlyMap<string, SeoPlan> {
  return seoPlans([softwareBuild("de", de), softwareBuild("en", en)])
}

test("a single-language Software post and tag archive pass without alternates", () => {
  const plans = softwarePlans([pairedPost], [pairedPost, englishPost, englishArchive])
  const en = plans.get(softwareEn.deploymentTarget)
  const de = plans.get(softwareDe.deploymentTarget)
  assert.ok(en)
  assert.ok(de)
  assert.deepEqual(en.alternates.get("/blog/english-only"), [])
  assert.deepEqual(en.alternates.get("/blog/tags/architecture"), [])
  assert.equal(en.alternates.get("/blog/pair")?.length, 3)
  assert.equal(en.alternates.get("/blog")?.length, 3)
  assert.deepEqual(de.paths, ["/", "/blog", "/blog/pair"])
  assert.deepEqual(de.absent, ["/blog/english-only", "/blog/tags/architecture"])
  assert.deepEqual(en.absent, [])
})

test("an unpaired path outside the single-language classes fails", () => {
  const unpaired: ReadonlyArray<readonly Page[]> = [
    [{ counterpart: false, path: "/company-history" }],
    // A post must be marked as an Open Graph article.
    [{ counterpart: false, path: "/blog/english-only" }],
    [{ article: true, counterpart: false, path: "/blog/nested/post" }],
    [{ article: true, counterpart: false, path: "/blog/tags" }],
  ]
  for (const pages of unpaired) {
    assert.throws(() => softwarePlans([], pages), /no counterpart/v, pages[0].path)
  }
  // Other sites have no blog; even a blog-shaped path needs its counterpart.
  const consultingPost = asset(
    "blog/a-post/index.html",
    html("en", "/blog/a-post").replace(
      "</head>",
      '<meta property="og:type" content="article"></head>'
    )
  )
  assert.throws(
    () =>
      seoPlans([
        { assets: build("de"), target },
        { assets: [...build("en"), consultingPost], target: englishTarget },
      ]),
    /no counterpart/v
  )
})

test("a paired page without alternates and a single-language page with alternates fail", () => {
  assert.throws(
    () => softwarePlans([pairedPost], [{ ...pairedPost, counterpart: false }]),
    /reciprocal de, en, and x-default/v
  )
  assert.throws(
    () => softwarePlans([], [{ ...englishPost, counterpart: true }]),
    /must link no hreflang alternates/v
  )
})

test("a site with a build in one language only fails", () => {
  assert.throws(() => seoPlans([softwareBuild("en", [])]), /software has a build for en only/v)
  assert.throws(
    () => seoPlans([{ assets: build("de"), target }]),
    /consulting has a build for de only/v
  )
})

test("both builds of a site must record the same build time", () => {
  const time = "2026-11-17T12:00:00.000Z"
  assert.equal(seoPlans([softwareBuild("de", [], time), softwareBuild("en", [], time)]).size, 2)
  assert.equal(seoPlans([softwareBuild("de", []), softwareBuild("en", [])]).size, 2)
  // The same instant in another zone is the same build time.
  assert.equal(
    seoPlans([softwareBuild("de", [], "2026-11-17T13:00:00+01:00"), softwareBuild("en", [], time)])
      .size,
    2
  )
  for (const invalid of ["2026-11-17", "2026-11-17T12:00:00", "Tue, 17 Nov 2026 12:00:00 GMT"]) {
    assert.throws(
      () => seoPlans([softwareBuild("de", [], invalid), softwareBuild("en", [], invalid)]),
      /no timestamp with seconds and a time zone/v
    )
  }
  for (const [de, en] of [
    [time, "2026-11-17T12:00:01.000Z"],
    [time, undefined],
    [undefined, time],
  ] as const) {
    assert.throws(
      () => seoPlans([softwareBuild("de", [], de), softwareBuild("en", [], en)]),
      /different build times/v
    )
  }
})

function originOf(url: string): string {
  return new URL(url).origin
}

test("verifySeo checks each origin against its own plan", async () => {
  const builds = [softwareBuild("de", [pairedPost]), softwareBuild("en", [pairedPost, englishPost])]
  const plans = seoPlans(builds)
  const pages = new Map<string, Answer>()
  for (const entry of builds) {
    const origin = `https://${entry.target.name}.b-cdn.net`
    for (const file of entry.assets) {
      pages.set(`${origin}${routePath(file.path)}`, { body: decoder.decode(file.bytes) })
    }
  }
  const de = `https://${softwareDe.deploymentTarget}.b-cdn.net`
  const en = `https://${softwareEn.deploymentTarget}.b-cdn.net`
  const visited: Record<Locale, string[]> = { de: [], en: [] }
  for (const locale of ["de", "en"] as const) {
    const plan = plans.get(softwareTargets[locale].name)
    assert.ok(plan)
    await verifySeo(plan, requestFor(pages, visited[locale]))
  }
  assert.ok(visited.de.every((url) => originOf(url) === de))
  assert.ok(visited.en.every((url) => originOf(url) === en))
  assert.ok(visited.en.includes(`${en}/blog/english-only`))
  // The German origin only confirms that the English-only post is unknown there.
  assert.ok(visited.de.includes(`${de}/blog/english-only`))
  const dePlan = plans.get(softwareDe.deploymentTarget)
  assert.ok(dePlan)
  pages.set(`${de}/blog/english-only`, { body: softwareHtml("en", englishPost) })
  await assert.rejects(verifySeo(dePlan, requestFor(pages)), /HTTP 200, expected 404/v)
})

async function writeBuild(directory: string, assets: readonly Asset[]): Promise<void> {
  for (const entry of assets) {
    await mkdir(dirname(join(directory, entry.path)), { recursive: true })
    await writeFile(join(directory, entry.path), entry.bytes)
  }
}

test("the secretless build check plans every buildable target from the checkout", async () => {
  const root = await mkdtemp(join(tmpdir(), "seo-plan-"))
  try {
    await writeBuild(join(root, "assets"), [asset("fonts/fonts.css", "body{}")])
    for (const variant of [german, english]) {
      const client = join(root, `apps/consulting/build/consulting-${variant.locale}/client`)
      await writeBuild(client, build(variant.locale))
      await writeFile(join(client, "..", "build-time.txt"), "2026-11-17T13:00:00+01:00\n")
    }
    const checked = await checkBuilds(root)
    assert.deepEqual([...checked.plans.keys()], [german.deploymentTarget, english.deploymentTarget])
    assert.ok(checked.builds.has("sebastian-websites-assets"))
    assert.equal(
      await readBuildTime(join(root, "apps/consulting/build/consulting-de/client")),
      "2026-11-17T13:00:00+01:00"
    )
    await writeFile(join(root, "apps/consulting/build/consulting-en/build-time.txt"), "later")
    await assert.rejects(checkBuilds(root), /no timestamp with seconds and a time zone/v)
    await writeFile(
      join(root, "apps/consulting/build/consulting-en/build-time.txt"),
      "2026-11-17 12:00"
    )
    await assert.rejects(checkBuilds(root), /no timestamp with seconds and a time zone/v)
    await rm(join(root, "apps/consulting/build/consulting-en/build-time.txt"))
    await assert.rejects(checkBuilds(root), /different build times/v)
    await rm(join(root, "apps/consulting/build/consulting-de/build-time.txt"))
    assert.equal(
      await readBuildTime(join(root, "apps/consulting/build/consulting-de/client")),
      undefined
    )
    const withoutTimes = await checkBuilds(root)
    assert.equal(withoutTimes.plans.size, 2, "builds without a recorded time pass")
    await rm(join(root, "apps/consulting/build/consulting-en"), { recursive: true })
    await assert.rejects(checkBuilds(root), /consulting has a build for de only/v)
  } finally {
    await rm(root, { force: true, recursive: true })
  }
})

function withEnglishBlog(change: (html: string) => string): ReadonlyMap<string, SeoPlan> {
  const englishBuild = softwareBuild("en", [])
  return seoPlans([
    softwareBuild("de", []),
    { ...englishBuild, assets: replaceAsset(englishBuild.assets, "blog/index.html", change) },
  ])
}

test("Software documents carry exactly one og:type and one og:url equal to the canonical", () => {
  assert.equal(withEnglishBlog((text) => text).size, 2)
  const invalid: ReadonlyArray<{
    readonly change: (text: string) => string
    readonly error: RegExp
  }> = [
    { change: (text) => text.replace(/<meta property="og:type"[^>]*>/v, ""), error: /og:type/v },
    {
      change: (text) =>
        text.replace("</head>", '<meta property="og:type" content="article"></head>'),
      error: /og:type/v,
    },
    { change: (text) => text.replace(/<meta property="og:url"[^>]*>/v, ""), error: /og:url/v },
    {
      change: (text) =>
        text.replace(
          'content="https://sebastian-software.com/blog"',
          'content="https://sebastian-software.de/blog"'
        ),
      error: /og:url equal to the canonical/v,
    },
    {
      change: (text) =>
        text.replace(
          "</head>",
          '<meta property="og:url" content="https://sebastian-software.com/blog"></head>'
        ),
      error: /og:url/v,
    },
  ]
  for (const { change, error } of invalid) {
    assert.throws(() => withEnglishBlog(change), error)
  }
})

test("other sites may omit Open Graph but must not contradict the canonical", () => {
  const withOpenGraph = (url: string) =>
    replaceAsset(build(), "team/index.html", (text) =>
      text.replace(
        "</head>",
        `<meta property="og:type" content="profile"><meta property="og:url" content="${url}"></head>`
      )
    )
  assert.ok(planOf(build()))
  assert.ok(planOf(withOpenGraph("https://sebastian-consulting.de/team")))
  assert.throws(() => planOf(withOpenGraph("https://sebastian-consulting.de/")), /og:url/v)
})
