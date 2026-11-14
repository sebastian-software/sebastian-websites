/* eslint-disable security/detect-non-literal-fs-filename -- Fixture paths are checked against the generated build root. */
/* eslint-disable no-await-in-loop -- Route assertions and fixture cleanup are ordered. */
/* eslint-disable max-statements -- Each browser scenario keeps its related assertions together. */
/**
 * Checks both built languages of the tech blog in Chromium: every page of the
 * sitemap with its SEO, social, and blog assertions, the home page's feeds,
 * the header and its language switch, the 404 page, the dark publication while
 * the blog navigation is off, static rendering, and catalog recovery.
 * Screenshots go to `build/evidence`. The site is new, so there is no
 * baseline comparison; the Software site's check keeps that.
 */
/* eslint-disable unicorn/prefer-global-this -- Evaluated callbacks run in the browser. */
import {
  BLOG_NAVIGATION,
  BLOG_PATH,
  getVariant,
  type Locale,
  otherLocale,
  singleLanguageClass,
} from "@sebastian-websites/web-core"
import assert from "node:assert/strict"
import { mkdir, readFile } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { type Browser, type BrowserContext, chromium, type Page } from "playwright"

import { type BlogCoverage, checkBlogPage, isBlogPath } from "./check-blog-pages.ts"

const app = fileURLToPath(new URL("..", import.meta.url))
/**
 * With `--fixtures`, the check covers the blog pages of the later fixture
 * build that `check:fixtures` leaves behind: posts in both languages, a
 * translated pair, a single-language post, tag archives, and both kinds of
 * next step. The production build has no post until the owners' first one.
 */
const fixtures = process.argv.includes("--fixtures")
const builds = fixtures
  ? path.join(app, "build/fixtures/after/apps/blog/build")
  : path.join(app, "build")
const evidence = path.join(app, fixtures ? "build/evidence-fixtures" : "build/evidence")
const remoteAssets = new Map<string, { body: Buffer; contentType: string; status: number }>()
const OK = 200
const NOT_FOUND = 404
const SERVER_ERROR = 500
/** The Blog item of the header: on the tech blog, the same-site link to its home. */
const BLOG_LINK = 'header nav a[href="/"]'
const IMPRINT_LINK = 'footer a[href="/imprint"]'
const VIEWPORTS = [
  { height: 1000, width: 1440 },
  { height: 844, width: 390 },
]
type Viewport = { height: number; width: number }
type Fixture = Awaited<ReturnType<typeof fixture>>

/**
 * The canonical origin of the tech blog in one language.
 * @param locale - The language.
 * @returns The HTTPS origin without a trailing slash.
 */
function origin(locale: Locale): string {
  return getVariant(`blog-${locale}`).canonicalOrigin
}
const media: Record<string, string> = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
}

async function fixture(directory: string) {
  const server = createServer((request, response) => {
    void (async () => {
      const url = new URL(request.url ?? "/", "http://localhost")
      const name = path.extname(url.pathname)
        ? url.pathname
        : `${url.pathname.replace(/\/$/v, "")}/index.html`
      const file = path.resolve(directory, `.${name}`)
      assert.ok(file.startsWith(`${directory}/`))
      try {
        const bytes = await readFile(file)
        response
          .writeHead(OK, {
            "content-type": media[path.extname(file)] ?? "application/octet-stream",
          })
          .end(bytes)
      } catch (error) {
        if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error
        response
          .writeHead(NOT_FOUND, { "content-type": "text/html" })
          .end(await readFile(path.join(directory, "404/index.html")))
      }
    })().catch(() => response.writeHead(SERVER_ERROR).end())
  })
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })
  const address = server.address()
  assert.ok(address != null && typeof address !== "string")
  return {
    close: async () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error)
          else resolve()
        })
      }),
    origin: `http://127.0.0.1:${address.port}`,
  }
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle")
  await page.evaluate(async () => document.fonts.ready)
}

async function settleImages(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const images = [...document.images]
    const loading = images.map((image) => image.loading)
    for (const image of images) image.loading = "eager"
    try {
      await Promise.all(images.map(async (image) => image.decode()))
    } finally {
      for (const [index, image] of images.entries()) image.loading = loading[index]
    }
  })
}

type RouteOptions = {
  /** The blog page kinds the run has checked, for the fixture run's coverage. */
  coverage: BlogCoverage
  current: Fixture
  errors: string[]
  locale: Locale
  /** Whether the other language's build has the same path, which then needs alternates. */
  paired: boolean
  pathname: string
  variant: string
  viewport: Viewport
}
const BUNNY_IMAGE = /^https:\/\/assets\.sebastian-software\.com\/[^?]+\?/v
/**
 * The content of a meta element that must occur exactly once, so a missing or
 * repeated tag fails with its selector instead of a null comparison.
 * @param page - The loaded page.
 * @param selector - The meta element's selector.
 * @param label - The route label for messages.
 * @returns The element's content.
 */
async function uniqueMeta(page: Page, selector: string, label: string): Promise<string> {
  const element = page.locator(selector)
  assert.equal(await element.count(), 1, `${label}: expected exactly one ${selector}`)
  return (await element.getAttribute("content")) ?? ""
}
async function checkAlternates(page: Page, options: RouteOptions): Promise<void> {
  const { paired, pathname, variant } = options
  if (!paired) {
    assert.equal(
      await page.locator('link[rel="alternate"][hreflang]').count(),
      0,
      `${variant}${pathname}: a page without a counterpart links no alternates`
    )
    // The hosting gate's rule: a post marked as an article, or a tag archive.
    const kind = singleLanguageClass(pathname)
    const ogType = await uniqueMeta(page, 'meta[property="og:type"]', `${variant}${pathname}`)
    assert.ok(
      kind === "tag-archive" || (kind === "post" && ogType === "article"),
      `${variant}${pathname}: only blog posts and tag archives may exist in one language`
    )
    return
  }
  const href = (suffix: string): string =>
    pathname === "/" ? `${suffix}/` : `${suffix}${pathname}`
  assert.equal(
    await page.locator('link[rel="alternate"][hreflang="de"]').getAttribute("href"),
    href(origin("de"))
  )
  assert.equal(
    await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href"),
    href(origin("en"))
  )
  assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 1)
}
async function checkSocialMeta(page: Page, canonical: string, label: string): Promise<void> {
  const meta = async (selector: string): Promise<string> => uniqueMeta(page, selector, label)
  assert.equal(await meta('meta[property="og:url"]'), canonical, `${label}: og:url`)
  assert.notEqual(await meta('meta[property="og:type"]'), "", `${label}: og:type`)
  assert.notEqual(await meta('meta[property="og:title"]'), "", `${label}: og:title`)
  assert.notEqual(await meta('meta[property="og:description"]'), "", `${label}: og:description`)
  const image = await meta('meta[property="og:image"]')
  // A post with a cover uses the cover's JPEG rendition from its own site.
  const cover =
    image.startsWith(`${new URL(canonical).origin}/assets/posts/`) && image.endsWith(".jpg")
  assert.ok(BUNNY_IMAGE.test(image) || cover, `${label}: og:image ${image}`)
  assert.equal(await meta('meta[name="twitter:card"]'), "summary_large_image", `${label}: card`)
}
async function checkRoute(page: Page, options: RouteOptions): Promise<void> {
  const { current, errors, locale, pathname, variant, viewport } = options
  const response = await page.goto(`${current.origin}${pathname}`)
  assert.equal(response?.status(), OK)
  await settle(page)
  await settleImages(page)
  assert.deepEqual(errors, [], `${variant}${pathname}: browser errors`)
  assert.equal(await page.locator("html").getAttribute("lang"), locale)
  assert.equal(await page.locator("h1").count(), 1)
  assert.equal(await page.locator("#ardo-app").count(), 1)
  const canonical = pathname === "/" ? `${origin(locale)}/` : `${origin(locale)}${pathname}`
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), canonical)
  await checkAlternates(page, options)
  await checkSocialMeta(page, canonical, `${variant}${pathname}`)
  await checkBlogPage(page, {
    coverage: options.coverage,
    label: `${variant}${pathname}`,
    locale,
    paired: options.paired,
    pathname,
  })
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    `${variant}${pathname}: overflow`
  )
  if (pathname === "/") await checkHomeFeeds(page, `${variant}${pathname}`)
  if (pathname === "/privacy") {
    const notice = page.locator("[data-legal-review-status]")
    assert.equal(await notice.getAttribute("data-legal-review-status"), "approved")
    assert.equal(await page.locator('[data-legal-section="analytics-rybbit"]').count(), 0)
    const hosting = page.locator('[data-legal-section="hosting-bunny"]')
    assert.equal(await hosting.count(), 1)
    assert.doesNotMatch(await hosting.innerText(), /sebastian-consulting\./v)
    assert.doesNotMatch(await page.locator("main").innerText(), /Rybbit|Hetzner/v)
  }
  await page.screenshot({
    fullPage: true,
    path: path.join(
      evidence,
      `${variant}-${viewport.width}-${pathname === "/" ? "home" : pathname.slice(1)}.png`
    ),
  })
}
/**
 * The home page advertises the publication's feeds like its pages do.
 * @param page - The loaded home page.
 * @param label - The route label for messages.
 */
async function checkHomeFeeds(page: Page, label: string): Promise<void> {
  for (const file of ["rss.xml", "atom.xml"]) {
    const link = page.locator(`head link[rel="alternate"][href$="${BLOG_PATH}/${file}"]`)
    assert.equal(await link.count(), 1, `${label}: one ${file} link in the head`)
    assert.equal(
      await page.locator(`main a[href="${BLOG_PATH}/${file}"]`).count(),
      1,
      `${label}: one visible ${file} subscribe link`
    )
  }
}
async function checkNavigation(page: Page, current: Fixture, locale: Locale): Promise<void> {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto(current.origin)
  await settle(page)
  await page.keyboard.press("Tab")
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main")
  await page.keyboard.press("Enter")
  assert.equal(new URL(page.url()).hash, "#main")
  await page.locator("header button[popovertarget]").click()
  const products = page.locator('header a[href$="/products"]')
  assert.ok(await products.isVisible())
  // Products is a Software page: the link leaves the blog for the same language.
  const software = getVariant(`software-${locale}`).canonicalOrigin
  assert.equal(await products.getAttribute("href"), `${software}/products`)
  if (BLOG_NAVIGATION !== "off") {
    assert.equal(await page.locator(`${BLOG_LINK}[aria-current="page"]`).count(), 1)
  }
  assert.equal(
    await page.locator(`header a[hreflang="${otherLocale(locale)}"]`).getAttribute("href"),
    `${origin(otherLocale(locale))}/`
  )
  await page.keyboard.press("Escape")
  assert.equal(
    await page.locator("header [popover]").evaluate((element) => element.matches(":popover-open")),
    false
  )
  await page.setViewportSize({ height: 1000, width: 1440 })
  await page.goto(current.origin)
  await settle(page)
  // Form feedback proves hydration; it must reset on an accepted full document navigation.
  await page.locator('input[type="email"]').fill("draft@example.com")
  await page.locator('form button[type="submit"]').click()
  await page
    .getByRole("status")
    .filter({ hasText: locale === "de" ? /bald|gestartet/iv : /opens soon/iv })
    .waitFor()
  await page.evaluate(() => {
    Reflect.set(window, "blogDocumentMarker", true)
  })
  await page.locator(IMPRINT_LINK).click()
  await settle(page)
  assert.equal(new URL(page.url()).pathname, "/imprint")
  assert.equal(await page.evaluate(() => Reflect.get(window, "blogDocumentMarker") === true), false)
}
async function checkNotFound(
  page: Page,
  options: { current: Fixture; variant: string }
): Promise<void> {
  const { current, variant } = options
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport)
    const missing = await page.goto(`${current.origin}/unknown-blog-page`)
    assert.equal(missing?.status(), NOT_FOUND)
    await settle(page)
    await settleImages(page)
    assert.equal(await page.locator("[data-not-found]").count(), 1)
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0)
    assert.equal(await page.locator('meta[property="og:url"]').count(), 0)
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex")
    await page.screenshot({
      fullPage: true,
      path: path.join(evidence, `${variant}-${viewport.width}-404.png`),
    })
  }
}
/**
 * While the blog navigation is off, the overview is built but dark: outside
 * the sitemap and marked `noindex`. `frame.test.ts` covers the missing
 * navigation item.
 * @param page - The browser page.
 * @param current - The build under test.
 * @param variant - The variant name, for messages.
 */
async function checkDarkBlog(page: Page, current: Fixture, variant: string): Promise<void> {
  const sitemap = await page.context().request.get(`${current.origin}/sitemap.xml`)
  assert.ok(
    sitemapPaths(await sitemap.text()).every((pathname) => !isBlogPath(pathname)),
    `${variant}: the sitemap lists blog pages while the blog navigation is off`
  )
  const response = await page.goto(`${current.origin}${BLOG_PATH}`)
  assert.equal(response?.status(), OK)
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex")
}
async function checkResources(context: BrowserContext, current: Fixture): Promise<void> {
  for (const resource of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    const response = await context.request.get(`${current.origin}${resource}`)
    assert.equal(response.status(), OK)
    assert.match(response.headers()["content-type"] ?? "", /xml|text\/plain|manifest\+json/v)
    const body = await response.text()
    assert.ok(body.length > 0)
  }
}
function sitemapPaths(body: string): string[] {
  const pages = [...body.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/gv)].map(
    ({ groups }) => new URL(groups?.loc ?? "").pathname
  )
  assert.ok(pages.length > 0, "sitemap.xml lists no pages")
  return pages
}
// The build sitemap is the single list of indexable pages; its URLs use the canonical origin.
async function sitemapPages(context: BrowserContext, server: string): Promise<string[]> {
  const response = await context.request.get(`${server}/sitemap.xml`)
  assert.equal(response.status(), OK)
  return sitemapPaths(await response.text())
}
async function checkStaticFallback(browser: Browser, current: Fixture): Promise<void> {
  // Ardo scrolls smoothly unless reduced motion is preferred; an animated scroll can leave the
  // link outside the viewport when Playwright clicks it on a slow runner.
  const noScript = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  try {
    const staticPage = await noScript.newPage()
    await staticPage.goto(current.origin)
    assert.equal(await staticPage.locator("h1").count(), 1)
    await staticPage.locator(IMPRINT_LINK).click()
    assert.ok(staticPage.url().endsWith("/imprint"))
  } finally {
    await noScript.close()
  }
}
async function checkRoutes(
  context: BrowserContext,
  page: Page,
  options: Omit<RouteOptions, "paired" | "pathname" | "viewport">
): Promise<void> {
  const { current, locale } = options
  const sitemap = await sitemapPages(context, current.origin)
  // The fixture run also covers the home page, which lists the newest posts.
  const pages = fixtures
    ? sitemap.filter((pathname) => pathname === "/" || isBlogPath(pathname))
    : sitemap
  // Both language builds are checked together; a path in both needs reciprocal alternates.
  const otherPages = new Set(
    sitemapPaths(
      await readFile(path.join(builds, `blog-${otherLocale(locale)}`, "client/sitemap.xml"), "utf8")
    )
  )
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport)
    for (const pathname of pages) {
      await checkRoute(page, {
        ...options,
        paired: otherPages.has(pathname),
        pathname,
        viewport,
      })
    }
  }
}
/**
 * Verify that missing catalog downloads retain the translated recovery view.
 * @param browser
 * @param current
 * @param locale
 */
async function checkCatalogRecovery(
  browser: Browser,
  current: Fixture,
  locale: Locale
): Promise<void> {
  const context = await browser.newContext()
  try {
    await context.route(/\/assets\/palamedes-m-.*\.js$/v, async (route) => route.abort())
    const page = await context.newPage()
    await page.goto(current.origin)
    const alert = page.locator("[data-palamedes-catalog-error]")
    await alert.waitFor({ state: "visible" })
    assert.equal(
      await alert.locator("h1").textContent(),
      locale === "de" ? "Diese Seite konnte nicht geladen werden." : "This page couldn't be loaded."
    )
    assert.equal(
      await alert.locator('a[href=""]').textContent(),
      locale === "de" ? "Seite neu laden" : "Reload page"
    )
    assert.equal(await alert.locator('a[href="/"]').count(), 1)
  } finally {
    await context.close()
  }
}

async function checkLocale(browser: Browser, locale: Locale): Promise<void> {
  const variant = `blog-${locale}`
  const build = path.join(builds, variant, "client")
  const current = await fixture(build)
  const context = await browser.newContext()
  // Serve new Bunny originals from the build, and fetch each other remote asset once.
  await context.route("https://**", async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === "assets.sebastian-software.com" && url.pathname.startsWith("/images/")) {
      try {
        await route.fulfill({
          body: await readFile(path.join(build, url.pathname.slice(1))),
          contentType: media[path.extname(url.pathname)],
        })
        return
      } catch (error) {
        if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error
      }
    }
    let cached = remoteAssets.get(url.href)
    if (!cached) {
      const response = await route.fetch()
      cached = {
        body: await response.body(),
        contentType: response.headers()["content-type"] ?? "application/octet-stream",
        status: response.status(),
      }
      remoteAssets.set(url.href, cached)
    }
    await route.fulfill(cached)
  })
  const page = await context.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|hydrating|react error|minified react/iv.test(message.text())
    )
      errors.push(message.text())
  })
  const coverage: BlogCoverage = new Set()
  try {
    await checkRoutes(context, page, { coverage, current, errors, locale, variant })
    if (fixtures) {
      // The rest of the fixture build is the production site, which the default run checks.
      for (const kind of [
        "overview",
        "post",
        "tag-archive",
        "next-step",
        "no-next-step",
      ] as const) {
        assert.ok(coverage.has(kind), `${variant}: the fixture build checked no ${kind} page`)
      }
      assert.deepEqual(errors, [], `${variant}: browser errors`)
      console.log(`${variant}: blog overview, posts, next steps, tag archives, and feeds passed`)
      return
    }
    if (BLOG_NAVIGATION === "off") await checkDarkBlog(page, current, variant)
    else assert.ok(coverage.has("overview"), `${variant}: the sitemap lists no ${BLOG_PATH}`)
    await checkNavigation(page, current, locale)
    await checkNotFound(page, { current, variant })
    await checkResources(context, current)
    assert.deepEqual(errors, [], `${variant}: browser errors`)
    await checkStaticFallback(browser, current)
    await checkCatalogRecovery(browser, current, locale)
    console.log(
      `${variant}: all routes, SEO, layout, hydration, native navigation, 404 and static fallback passed`
    )
  } catch (error) {
    console.error({
      errors,
      status: await page.getByRole("status").allTextContents(),
      url: page.url(),
      variant,
    })
    throw error
  } finally {
    await context.close()
    await current.close()
  }
}
await mkdir(evidence, { recursive: true })
const testBrowser = await chromium.launch()
try {
  for (const locale of ["de", "en"] as const) await checkLocale(testBrowser, locale)
} finally {
  await testBrowser.close()
}
