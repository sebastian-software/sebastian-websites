/* eslint-disable no-await-in-loop -- Inspect bylines in their document order. */
import type { Locator, Page } from "playwright"

import { type Locale, ORGANIZATION_ID, PEOPLE, personIdentity } from "@sebastian-websites/web-core"
import assert from "node:assert/strict"

function isEntity(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function entity(value: unknown): Record<string, unknown> {
  assert.ok(isEntity(value))
  return value
}

async function checkAuthor(
  byline: Locator,
  author: Record<string, unknown>,
  locale: Locale
): Promise<void> {
  const text = await byline.textContent()
  assert.ok(text?.includes(String(author.name)))
  const key = (["werner", "fastner"] as const).find((person) => PEOPLE[person].name === author.name)
  if (key === undefined) return
  const identity = personIdentity(key, locale)
  const link = byline.locator('a[rel="author"]')
  assert.equal(await link.getAttribute("href"), identity.url)
  assert.equal(author["@id"], identity["@id"])
  assert.equal(author.url, identity.url)
  await link.focus()
  assert.notEqual(await link.evaluate((element) => getComputedStyle(element).outlineStyle), "none")
  await link.blur()
}

async function checkFacts(
  page: Page,
  schema: Record<string, unknown>,
  locale: Locale
): Promise<void> {
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href")
  assert.equal(schema["@type"], "BlogPosting")
  assert.deepEqual(schema.mainEntityOfPage, { "@id": canonical, "@type": "WebPage" })
  assert.equal(schema.headline, await page.locator("article h1").textContent())
  assert.equal(schema.inLanguage, locale)
  assert.equal(
    schema.datePublished,
    await page.locator("article time").first().getAttribute("datetime")
  )
  assert.deepEqual(schema.publisher, { "@id": ORGANIZATION_ID })
}

/**
 * Compare article JSON-LD with rendered dates, authors, and its canonical page.
 * @param page - A loaded article, also used in JavaScript-disabled checks.
 * @param locale - The build language.
 * @returns Completion once visible and machine-readable facts agree.
 */
export async function checkArticleIdentity(page: Page, locale: Locale): Promise<void> {
  const scripts = await page.locator('main > script[type="application/ld+json"]').allTextContents()
  assert.equal(scripts.length, 1, "one article entity in initial HTML")
  const parsed: unknown = JSON.parse(scripts[0] ?? "")
  const schema = entity(parsed)
  await checkFacts(page, schema, locale)
  assert.ok(Array.isArray(schema.author))
  const authors: unknown[] = schema.author
  const bylines = page.locator("article ul[aria-label] li")
  assert.equal(authors.length, await bylines.count())
  for (const [index, author] of authors.entries()) {
    await checkAuthor(bylines.nth(index), entity(author), locale)
  }
}
