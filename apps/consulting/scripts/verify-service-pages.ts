/* eslint-disable no-await-in-loop -- One browser verifies the three documents sequentially. */
/* eslint-disable max-statements -- Keep each built-document contract together in one browser scenario. */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { chromium, type Page } from "playwright"

const SERVICES = [
  {
    de: "Softwarearchitektur-Reviews",
    en: "Software architecture reviews",
    path: "/services/architecture-review",
  },
  {
    de: "React- und TypeScript-Anwendungen modernisieren",
    en: "React and TypeScript modernization",
    path: "/services/react-typescript-modernization",
  },
  {
    de: "Bestehende SaaS-Produkte internationalisieren",
    en: "Internationalization for existing SaaS products",
    path: "/services/internationalization",
  },
] as const

const PROFILE_DESCRIPTIONS = {
  de: { fastner: "Fullstack-Entwicklung", werner: "Frontend-Architektur" },
  en: { fastner: "Full-stack development", werner: "Frontend architecture" },
} as const

async function assertProfileMetadata(
  page: Page,
  locale: "de" | "en",
  profile: "fastner" | "werner"
): Promise<void> {
  const description = await page.locator('meta[name="description"]').getAttribute("content")
  assert.ok(description?.startsWith(PROFILE_DESCRIPTIONS[locale][profile]))
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    assert.equal(await page.locator(selector).getAttribute("content"), description)
  }
}

async function assertMetadata(page: Page, path: string, locale: "de" | "en"): Promise<void> {
  const origin = `https://sebastian-consulting.${locale === "de" ? "de" : "com"}`
  assert.equal(await page.locator("html").getAttribute("lang"), locale)
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `${origin}${path}`)
  for (const language of ["de", "en", "x-default"]) {
    const tld = language === "de" ? "de" : "com"
    assert.equal(
      await page.locator(`link[hreflang="${language}"]`).getAttribute("href"),
      `https://sebastian-consulting.${tld}${path}`
    )
  }
  const description = await page.locator('meta[name="description"]').getAttribute("content")
  assert.ok(description !== null && description.trim() !== "", `${path}: meaningful description`)
  assert.equal(
    await page.locator('meta[property="og:description"]').getAttribute("content"),
    description
  )
  assert.equal(
    await page.locator('meta[property="og:url"]').getAttribute("content"),
    `${origin}${path}`
  )
  assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "website")
  assert.match(
    (await page.locator('meta[property="og:image"]').getAttribute("content")) ?? "",
    /^https:\/\//v
  )
  assert.equal(
    await page.locator('meta[name="twitter:card"]').getAttribute("content"),
    "summary_large_image"
  )
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(), 0)
}

/**
 * Verify static service copy, paired metadata, and incoming links without client JS.
 * @param output - The built variant's client directory.
 * @param locale - The language of the built variant.
 * @returns Completion after all service contracts pass.
 */
export async function verifyServicePages(output: string, locale: "de" | "en"): Promise<void> {
  const browser = await chromium.launch({ headless: true })
  try {
    const context = await browser.newContext({ javaScriptEnabled: false })
    await context.route("**/*", async (route) => route.abort())
    const page = await context.newPage()
    const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8")
    for (const service of SERVICES) {
      const html = await readFile(resolve(output, service.path.slice(1), "index.html"), "utf8")
      await page.setContent(html, { waitUntil: "domcontentloaded" })
      assert.equal(await page.locator("h1").count(), 1)
      assert.equal(await page.locator("h1").textContent(), service[locale])
      assert.equal(await page.title(), `${service[locale]} – Sebastian Consulting`)
      await assertMetadata(page, service.path, locale)
      assert.ok(
        sitemap.includes(
          `https://sebastian-consulting.${locale === "de" ? "de" : "com"}${service.path}</loc>`
        )
      )
      for (const section of [
        "situations",
        "approach",
        "deliverables",
        "evidence",
        "fit",
        "questions",
        "next",
      ]) {
        assert.equal(
          await page.locator(`#${section}-title`).count(),
          1,
          `${service.path}: ${section}`
        )
      }
      assert.equal(
        await page.locator('main a[href="https://calendly.com/swernerx/15min"]').count(),
        2
      )
      assert.equal(await page.locator('nav[aria-label] a[href^="/services/"]').count(), 2)
    }
    for (const route of ["services", "werner", "fastner", "fastner/project-profile"]) {
      const html = await readFile(resolve(output, route, "index.html"), "utf8")
      if (route === "fastner" || route === "werner") {
        await page.setContent(html, { waitUntil: "domcontentloaded" })
        await assertProfileMetadata(page, locale, route)
      }
      for (const service of SERVICES) {
        assert.ok(
          html.includes(`href="${service.path}"`),
          `${route}: incoming link to ${service.path}`
        )
      }
    }
  } finally {
    await browser.close()
  }
}
