/* eslint-disable no-await-in-loop -- Locator assertions run in document order. */
/**
 * The blog part of `check-browser.ts`: what the overview, a post, and a tag
 * archive must show beyond the checks every page gets. The production build
 * has only the overview until the owners' first post; the `--fixtures` run
 * reaches posts and tag archives.
 */
import type { Locator, Page } from "playwright"

import {
  BLOG_PATH,
  BLOG_TAGS_PATH,
  getVariant,
  type Locale,
  otherLocale,
  singleLanguageClass,
} from "@sebastian-websites/web-core"
import assert from "node:assert/strict"

/** The blog page kinds a run has checked. */
export type BlogCoverage = Set<"next-step" | "no-next-step" | "overview" | "post" | "tag-archive">

const OK = 200
const FEEDS = [
  { file: "rss.xml", type: "application/rss+xml" },
  { file: "atom.xml", type: "application/atom+xml" },
] as const

/** What the blog checks know about the page beyond its content. */
type PageContext = {
  readonly label: string
  readonly locale: Locale
  /** Whether the other language's build has the same path. */
  readonly paired: boolean
  readonly pathname: string
}

/**
 * The canonical URL of a path in the other language.
 * @param locale - The page's language.
 * @param pathname - A path on the other domain.
 * @returns The absolute URL there.
 */
function otherLanguageUrl(locale: Locale, pathname: string): string {
  const variant = getVariant(`blog-${otherLocale(locale)}`)
  return `${variant.canonicalOrigin}${pathname}`
}

/**
 * Tells whether a path belongs to the blog: the overview, a post, or a tag archive.
 * @param pathname - A sitemap path.
 * @returns Whether the blog checks apply.
 */
export function isBlogPath(pathname: string): boolean {
  return pathname === BLOG_PATH || singleLanguageClass(pathname) !== undefined
}

async function text(locator: Locator): Promise<string> {
  return ((await locator.textContent()) ?? "").trim()
}

/**
 * A focused link must show the shared focus outline.
 * @param link - A link on the page.
 * @param label - The link's description for messages.
 */
async function checkFocus(link: Locator, label: string): Promise<void> {
  await link.focus()
  const outline = await link.evaluate((element) => getComputedStyle(element).outlineStyle)
  assert.notEqual(outline, "none", `${label}: a focused link shows its outline`)
  // The evidence screenshot follows; it shows the page at rest.
  await link.blur()
}

/**
 * Feed discovery in the head on every blog page: one RSS and one Atom link to
 * this domain's feeds, with titles that tell them apart.
 * @param page - The loaded page.
 * @param label - The route label for messages.
 */
async function checkFeedDiscovery(page: Page, label: string): Promise<void> {
  const titles = new Set<string>()
  for (const feed of FEEDS) {
    const link = page.locator(`head link[rel="alternate"][type="${feed.type}"]`)
    assert.equal(await link.count(), 1, `${label}: one ${feed.type} link in the head`)
    const href = (await link.getAttribute("href")) ?? ""
    assert.equal(new URL(href).pathname, `${BLOG_PATH}/${feed.file}`, `${label}: ${feed.file}`)
    const title = (await link.getAttribute("title")) ?? ""
    assert.notEqual(title, "", `${label}: the ${feed.file} link has a title`)
    titles.add(title)
  }
  assert.equal(titles.size, FEEDS.length, `${label}: the feed links have distinct titles`)
}

/**
 * The visible subscribe links: named, served as XML, and focusable.
 * @param page - The loaded overview or tag archive.
 * @param label - The route label for messages.
 */
async function checkSubscribeLinks(page: Page, label: string): Promise<void> {
  for (const feed of FEEDS) {
    const link = page.locator(`main a[type="${feed.type}"]`)
    assert.equal(await link.count(), 1, `${label}: one visible ${feed.file} subscribe link`)
    assert.ok(await link.isVisible(), `${label}: the ${feed.file} link is visible`)
    assert.notEqual(await text(link), "", `${label}: the ${feed.file} link has a name`)
    const href = (await link.getAttribute("href")) ?? ""
    assert.equal(href, `${BLOG_PATH}/${feed.file}`, `${label}: the link stays on this domain`)
    const response = await page.request.get(new URL(href, page.url()).href)
    assert.equal(response.status(), OK, `${label}: ${href} is served`)
    assert.match(response.headers()["content-type"] ?? "", /xml/v, `${label}: ${href} is XML`)
    await checkFocus(link, `${label} ${feed.file}`)
  }
}

/**
 * The posts of a listing: each a level-two heading that links its post.
 * @param page - The loaded overview or tag archive.
 * @returns The number of listed posts.
 */
async function listedPosts(page: Page): Promise<number> {
  const links = page.locator("main li h2 a")
  for (const link of await links.all()) {
    assert.notEqual(await text(link), "")
    assert.ok(((await link.getAttribute("href")) ?? "").startsWith(`${BLOG_PATH}/`))
  }
  return links.count()
}

async function checkOverview(page: Page, context: PageContext): Promise<void> {
  const { label, locale } = context
  await checkSubscribeLinks(page, label)
  const other = page.locator("main a[hreflang]")
  if ((await listedPosts(page)) > 0) {
    assert.equal(await other.count(), 0, `${label}: an overview with posts shows no empty state`)
    return
  }
  // The empty state leads to the other language's blog.
  assert.equal(await other.count(), 1, `${label}: the empty state links the other blog`)
  assert.equal(
    await other.getAttribute("href"),
    otherLanguageUrl(locale, BLOG_PATH),
    `${label}: the empty state links the other language's overview`
  )
  assert.equal(await other.getAttribute("hreflang"), otherLocale(locale), `${label}: hreflang`)
  assert.notEqual(await text(other), "", `${label}: the other blog's link has a name`)
}

async function checkTagArchive(page: Page, label: string): Promise<void> {
  assert.notEqual(await text(page.locator("main h1")), "", `${label}: the archive names its tag`)
  await checkSubscribeLinks(page, label)
  assert.ok((await listedPosts(page)) > 0, `${label}: a tag archive lists its posts`)
}

/**
 * The next-step box as a section: named by its own title, and the last part
 * of the article.
 * @param box - The one next-step box.
 * @param label - The route label for messages.
 */
async function checkNextStepBox(box: Locator, label: string): Promise<void> {
  const titleId = (await box.getAttribute("aria-labelledby")) ?? ""
  assert.notEqual(
    await text(box.locator(`[id="${titleId}"]`)),
    "",
    `${label}: the next step is named by its title`
  )
  assert.ok(
    await box.evaluate((element) => {
      const article = element.closest("article")
      const last = article ? [...article.querySelectorAll("*")].at(-1) : undefined
      return last !== undefined && element.contains(last)
    }),
    `${label}: the next step closes the article`
  )
}

/**
 * The next step: one box at the end of the article for its target, or none
 * for a development report.
 * @param page - The loaded post.
 * @param label - The route label for messages.
 * @returns Whether the post shows a box.
 */
async function checkNextStep(page: Page, label: string): Promise<boolean> {
  const step = (await page.locator("article").getAttribute("data-next-step")) ?? ""
  assert.notEqual(step, "", `${label}: the post carries its next step`)
  const boxes = page.locator("article section[aria-labelledby][data-next-step]")
  if (step === "none") {
    assert.equal(await boxes.count(), 0, `${label}: a development report shows no next step`)
    return false
  }
  assert.equal(await boxes.count(), 1, `${label}: exactly one next-step box`)
  assert.equal(await boxes.getAttribute("data-next-step"), step, `${label}: the box's target`)
  await checkNextStepBox(boxes, label)
  const link = boxes.locator("a")
  assert.equal(await link.count(), 1, `${label}: the next step is one link`)
  assert.notEqual(await text(link), "", `${label}: the next step's link names its destination`)
  assert.notEqual((await link.getAttribute("href")) ?? "", "")
  await checkFocus(link, `${label} next step`)
  return true
}

/**
 * The in-article link to the translation: one link to the same path on the
 * other domain for a paired post, none for a single-language post.
 * @param page - The loaded post.
 * @param context - The page's language, path, and pairing.
 */
async function checkTranslationLink(page: Page, context: PageContext): Promise<void> {
  const { label, locale, paired, pathname } = context
  const links = page.locator("article a[hreflang]")
  if (!paired) {
    assert.equal(await links.count(), 0, `${label}: a single-language post links no translation`)
    return
  }
  assert.equal(await links.count(), 1, `${label}: a translated post links its translation once`)
  assert.equal(await links.getAttribute("href"), otherLanguageUrl(locale, pathname), label)
  assert.equal(await links.getAttribute("hreflang"), otherLocale(locale), `${label}: hreflang`)
  assert.notEqual(await text(links), "", `${label}: the translation link has a name`)
}

/**
 * The post's tag links: one per `article:tag` of the head, each named, and
 * the first archive served.
 * @param page - The loaded post.
 * @param label - The route label for messages.
 */
async function checkTagLinks(page: Page, label: string): Promise<void> {
  const tags = await page
    .locator('meta[property="article:tag"]')
    .evaluateAll((elements) => elements.map((element) => element.getAttribute("content") ?? ""))
  const links = page.locator(`article a[href^="${BLOG_TAGS_PATH}/"]`)
  assert.equal(await links.count(), tags.length, `${label}: one tag link per article:tag`)
  const all = await links.all()
  for (const [index, link] of all.entries()) {
    assert.notEqual(await text(link), "", `${label}: each tag link names its tag`)
    assert.equal(await link.getAttribute("href"), `${BLOG_TAGS_PATH}/${tags[index] ?? ""}`)
  }
  if (tags.length === 0) return
  const archive = (await links.first().getAttribute("href")) ?? ""
  const response = await page.request.get(new URL(archive, page.url()).href)
  assert.equal(response.status(), OK, `${label}: ${archive} is served`)
}

async function checkPost(page: Page, context: PageContext): Promise<boolean> {
  const { label } = context
  assert.equal(await page.locator("main article").count(), 1, `${label}: one article`)
  assert.equal(await page.locator("article h1").count(), 1, `${label}: the title heads the article`)
  const times = page.locator("article time")
  assert.ok((await times.count()) > 0, `${label}: the post is dated`)
  for (const time of await times.all()) {
    const value = (await time.getAttribute("datetime")) ?? ""
    assert.ok(!Number.isNaN(Date.parse(value)), `${label}: ${value} is a machine-readable date`)
  }
  assert.equal(
    await page.locator('meta[property="og:type"]').getAttribute("content"),
    "article",
    `${label}: a post is an article`
  )
  assert.equal(await page.locator('meta[property="article:published_time"]').count(), 1)
  assert.ok((await page.locator("article ul[aria-label] li").count()) > 0, `${label}: authors`)
  await checkTranslationLink(page, context)
  await checkTagLinks(page, label)
  return checkNextStep(page, label)
}

/**
 * The blog checks of one page; other pages pass unchanged.
 * @param page - The loaded page.
 * @param options - The page and where its coverage is recorded.
 * @param options.coverage - The kinds of blog page the run has checked.
 * @param options.label - The route label for messages.
 * @param options.locale - The page's language.
 * @param options.paired - Whether the other language's build has the same path.
 * @param options.pathname - The page's path.
 */
export async function checkBlogPage(
  page: Page,
  options: { coverage: BlogCoverage } & PageContext
): Promise<void> {
  const { coverage, label, pathname } = options
  if (!isBlogPath(pathname)) return
  await checkFeedDiscovery(page, label)
  const kind = pathname === BLOG_PATH ? "overview" : singleLanguageClass(pathname)
  if (kind === "overview") await checkOverview(page, options)
  if (kind === "tag-archive") await checkTagArchive(page, label)
  if (kind === "post") coverage.add((await checkPost(page, options)) ? "next-step" : "no-next-step")
  if (kind !== undefined) coverage.add(kind)
}
