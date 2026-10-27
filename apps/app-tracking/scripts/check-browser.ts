/* eslint-disable max-statements -- Browser scenarios keep ordered assertions together. */
/* eslint-disable unicorn/prefer-global-this -- Browser callbacks must use their Window, not Node globals. */
/* eslint-disable no-await-in-loop -- Navigation and server cleanup must finish before the next locale or viewport starts. */
import type { run as runAxe } from "axe-core"
import type { Browser, BrowserContext, Page, Route } from "playwright"

import assert from "node:assert/strict"
import { mkdir, readFile } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Window augmentation requires an interface.
  interface Window {
    axe: { run: typeof runAxe }
  }
}

type Locale = "de" | "en"
type Viewport = { readonly height: number; readonly name: string; readonly width: number }
const app = fileURLToPath(new URL("..", import.meta.url))
const evidence = resolve(app, "build/evidence")
const axe = await readFile(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8")
const compactWidth = 960
const http = { missing: 404, ok: 200, unexpected: 500 } as const
const allowedAssets = new Set(["assets.sebastian-software.com", "brand.sebastian-software.com"])
const types: Readonly<Record<string, string>> = {
  ".css": "text/css",
  ".data": "application/json",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
}
const viewports = [
  { height: 1000, name: "desktop", width: 1440 },
  { height: 1024, name: "tablet", width: 768 },
  { height: 844, name: "mobile", width: 390 },
  { height: 740, name: "narrow", width: 320 },
]

function serve(build: string) {
  return createServer((request, response) => {
    void (async () => {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname
      const path = extname(pathname) ? pathname : `${pathname.replace(/\/$/v, "")}/index.html`
      const file = resolve(build, `.${path}`)
      assert.ok(file.startsWith(`${build}/`), "Fixture paths stay inside the build")
      try {
        const bytes = await readFile(file)
        response
          .writeHead(http.ok, {
            "content-type": types[extname(file)] ?? "application/octet-stream",
          })
          .end(bytes)
      } catch {
        response
          .writeHead(http.missing, { "content-type": "text/html" })
          .end(await readFile(resolve(build, "404/index.html")))
      }
    })().catch(() => {
      response.writeHead(http.unexpected).end()
    })
  })
}

function assetRoute(build: string, origin: string, unexpected: string[]) {
  return async (route: Route): Promise<void> => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (!allowedAssets.has(url.hostname)) {
      unexpected.push(url.href)
      return route.abort()
    }
    // New image hashes do not exist on the CDN until this change is published.
    if (url.pathname.startsWith("/images/")) {
      const file = resolve(build, `.${url.pathname}`)
      assert.ok(file.startsWith(`${build}/images/`))
      return route.fulfill({ body: await readFile(file), contentType: types[extname(file)] })
    }
    return route.continue()
  }
}

async function checkNavigation(page: Page, locale: Locale, viewport: Viewport): Promise<void> {
  await page.keyboard.press("Tab")
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main")
  await page.keyboard.press("Enter")
  assert.equal(new URL(page.url()).hash, "#main")
  if (viewport.width < compactWidth) {
    await page.getByRole("button", { exact: true, name: locale === "en" ? "Menu" : "Menü" }).click()
    await page
      .getByRole("link", { exact: true, name: locale === "en" ? "Deutsch" : "English" })
      .waitFor()
    await page.keyboard.press("Escape")
  }
  const opposite = locale === "en" ? "de" : "com"
  assert.equal(
    await page.locator(`a[hreflang="${locale === "en" ? "de" : "en"}"]`).getAttribute("href"),
    `https://app-tracking.sebastian-software.${opposite}/`
  )
  await page
    .getByRole("link", {
      exact: true,
      name: locale === "en" ? "What a report contains" : "Was ein Bericht enthält",
    })
    .click()
  assert.equal(new URL(page.url()).hash, "#data")
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")?.slice(1) ?? "")
        .filter((id) => id !== "" && !document.getElementById(id))
    )
  assert.deepEqual(missing, [])
}

// eslint-disable-next-line max-params -- The scenario explicitly receives its isolated browser fixture.
async function checkViewport(
  page: Page,
  context: BrowserContext,
  locale: Locale,
  viewport: Viewport,
  origin: string
): Promise<void> {
  await page.setViewportSize(viewport)
  await page.goto(origin, { waitUntil: "networkidle" })
  await page.evaluate(async () => document.fonts.ready)
  assert.equal(await page.locator("html").getAttribute("lang"), locale)
  assert.equal(await page.locator("h1").count(), 1)
  const heading = await page.locator("h1").innerText()
  assert.ok(heading.includes(locale === "en" ? "usage reports" : "Nutzungsberichte"))
  assert.equal(await page.locator("form").count(), 0)
  assert.equal(
    await page.evaluate<number>("window.localStorage.length + window.sessionStorage.length"),
    0
  )
  assert.deepEqual(await context.cookies(), [])
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    `${locale}/${viewport.name}: overflow`
  )
  assert.ok(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
        )
      )
  )
  await checkNavigation(page, locale, viewport)
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })
  await page.screenshot({
    fullPage: true,
    path: resolve(evidence, `${locale}-${viewport.name}.png`),
  })
  await page.screenshot({ path: resolve(evidence, `${locale}-${viewport.name}-first-screen.png`) })
  await page.evaluate(axe)
  const violations = await page.evaluate(async () => {
    const audit = await window.axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    })
    return audit.violations
  })
  assert.deepEqual(violations, [], `${locale}/${viewport.name}: accessibility`)
}

async function checkLightMode(page: Page): Promise<void> {
  const colors = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    text: getComputedStyle(document.body).color,
  }))
  await page.emulateMedia({ colorScheme: "dark" })
  assert.deepEqual(
    await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      text: getComputedStyle(document.body).color,
    })),
    colors
  )
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
    "light only"
  )
}

async function checkLocale(browser: Browser, locale: Locale): Promise<void> {
  const build = resolve(app, `build/app-tracking-${locale}/client`)
  const server = serve(build)
  await new Promise<void>((done) => {
    server.listen(0, "127.0.0.1", done)
  })
  const address = server.address()
  assert.ok(address !== null && typeof address !== "string")
  const origin = `http://127.0.0.1:${address.port}`
  const context = await browser.newContext()
  const unexpected: string[] = []
  const route = assetRoute(build, origin, unexpected)
  await context.route("**/*", route)
  try {
    const page = await context.newPage()
    const errors: string[] = []
    page.on("pageerror", (error) => {
      errors.push(error.message)
    })
    for (const viewport of viewports) await checkViewport(page, context, locale, viewport, origin)
    await checkLightMode(page)
    await page.goto(`${origin}/privacy`, { waitUntil: "networkidle" })
    const title = await page.locator("h1").innerText()
    assert.ok(title.includes(locale === "en" ? "privacy" : "Datenschutz"))
    assert.deepEqual(errors, [])
    const noScript = await browser.newContext({ javaScriptEnabled: false })
    try {
      await noScript.route("**/*", route)
      const staticPage = await noScript.newPage()
      await staticPage.goto(origin)
      await staticPage
        .getByRole("link", {
          exact: true,
          name: locale === "en" ? "What a report contains" : "Was ein Bericht enthält",
        })
        .click()
      assert.equal(new URL(staticPage.url()).hash, "#data")
    } finally {
      await noScript.close()
    }
    assert.deepEqual(unexpected, [])
  } finally {
    await context.close()
    await new Promise<void>((done, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else done()
      })
    })
  }
}

await mkdir(evidence, { recursive: true })
const engine = await chromium.launch({ headless: true })
try {
  for (const locale of ["en", "de"] as const) await checkLocale(engine, locale)
} finally {
  await engine.close()
}
console.log(
  "Both languages passed four viewport sizes, shared navigation, no-script links, local images, light mode, storage/network limits, and axe checks."
)
