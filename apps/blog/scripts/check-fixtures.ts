/* eslint-disable security/detect-non-literal-fs-filename -- Paths stay below the fixture directory and its scratch output. */
/* eslint-disable no-await-in-loop -- Fixture builds and their checks run one after another. */
/**
 * Builds the blog fixtures in `test/fixtures/blog/` into `build/fixtures/` and
 * checks the output: drafts and posts that are not due stay out of every
 * file at one build time and appear in both languages at a later one, both
 * feeds parse with a strict XML parser, an MDX post with prose builds past
 * Palamedes, the empty state builds and links the other blog, single-language
 * pages switch to the other blog, and a post's cover and body images render
 * as Ardo's local renditions, with the cover as social preview and feed image.
 * Every fixture build passes the hosting gate of `pnpm hosting:plan`.
 *
 * Run it with `pnpm --filter @sebastian-websites/blog check:fixtures`.
 */
import {
  BLOG_TAGS,
  getVariant,
  type Locale,
  LOCALES,
  otherLocale,
} from "@sebastian-websites/web-core"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { access, mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, type Page } from "playwright"

import {
  alternates,
  canonical,
  documentAt,
  type Feed,
  languageLink,
  mainLanguageLinks,
  parseFeed,
  sitemapPaths,
  textFiles,
} from "./fixture-output.ts"

const app = fileURLToPath(new URL("..", import.meta.url))
const repository = path.resolve(app, "../..")
const fixtures = path.join(app, "test/fixtures/blog")
const scratch = path.join(app, "build/fixtures")
const ORIGINS: Readonly<Record<Locale, string>> = {
  de: getVariant("blog-de").canonicalOrigin,
  en: getVariant("blog-en").canonicalOrigin,
}
const TAG = "internationalization"
const OVERVIEW = "/posts"
const PAIR_POST = "/posts/pair"
const GERMAN_POST = "/posts/nur-deutsch"
const MDX_ROUTE = "/posts/mdx-prose"
const SCHEDULED_ROUTE = "/posts/scheduled"
const TAG_ARCHIVE = `${OVERVIEW}/tags/${TAG}`
/** Before the scheduled pair falls due on December 1, 2026, and after it. */
const BEFORE = "2026-11-20T12:00:00Z"
const AFTER = "2026-12-02T12:00:00Z"
/** Text that only unpublished fixture posts contain. */
const UNPUBLISHED = ["DRAFT-MARKER", "fixture-draft", "/posts/draft"]
const SCHEDULED = ["SCHEDULED-MARKER", "fixture-scheduled", SCHEDULED_ROUTE]

type Build = Readonly<Record<Locale, ReadonlyMap<string, string>>>
type Expected = {
  /** Text no file of either build may contain. */
  readonly absent: readonly string[]
  /** Blog routes that exist in both languages. */
  readonly paired: readonly string[]
  /** The blog routes each language publishes, sorted. */
  readonly routes: Readonly<Record<Locale, readonly string[]>>
}

/**
 * Runs a command and collects its output.
 * @param args - The Node.js arguments.
 * @param cwd - The working directory.
 * @returns The exit code and the combined output.
 */
async function node(
  args: readonly string[],
  cwd: string
): Promise<{ code: number; output: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, env: process.env })
    const output: Buffer[] = []
    const collect = (chunk: Buffer): void => {
      output.push(chunk)
    }
    child.stdout.on("data", collect)
    child.stderr.on("data", collect)
    child.once("error", reject)
    child.once("exit", (code) => {
      resolve({ code: code ?? 1, output: Buffer.concat(output).toString("utf8") })
    })
  })
}

async function succeed(args: readonly string[], cwd: string, label: string): Promise<string> {
  const result = await node(args, cwd)
  if (result.code !== 0) {
    console.error(result.output)
    throw new Error(`${label} exited ${String(result.code)}`)
  }
  return result.output
}

/**
 * Builds one fixture into its own checkout-shaped root, so the hosting gate
 * can check it like a real checkout, and runs that gate.
 * @param name - The scratch directory name.
 * @param content - The directory with the `de` and `en` posts.
 * @param buildTime - The shared build time.
 * @returns The scratch root.
 */
async function buildFixture(name: string, content: string, buildTime: string): Promise<string> {
  const root = path.join(scratch, name)
  const args = [
    "scripts/build.ts",
    `--content=${content}`,
    `--build-time=${buildTime}`,
    `--out=${path.join(root, "apps/blog/build")}`,
  ]
  console.log(`Building fixture ${name} at ${buildTime}`)
  await succeed(args, app, `The ${name} fixture build`)
  await gate(root, name)
  return root
}

/**
 * Runs `pnpm hosting:plan` against a fixture root.
 * @param root - The checkout-shaped fixture root.
 * @param name - The fixture name, for messages.
 */
async function gate(root: string, name: string): Promise<void> {
  // The gate also plans the shared asset zone, which a fixture does not use.
  await mkdir(path.join(root, "assets"), { recursive: true })
  await writeFile(path.join(root, "assets/fixture.txt"), "fixture\n")
  const output = await succeed(
    ["hosting/check-builds.ts", root],
    repository,
    `The hosting gate on the ${name} fixture`
  )
  assert.match(output, /ready to publish/v)
}

async function loadBuild(root: string): Promise<Build> {
  const client = (locale: Locale): string =>
    path.join(root, "apps/blog/build", `blog-${locale}`, "client")
  return { de: await textFiles(client("de")), en: await textFiles(client("en")) }
}

function blogRoutes(files: ReadonlyMap<string, string>): readonly string[] {
  return [...files.keys()]
    .filter((file) => file === "posts/index.html" || /^posts\/.+\/index\.html$/v.test(file))
    .map((file) => `/${file.slice(0, -"/index.html".length)}`)
    .toSorted()
}

function checkRoutes(build: Build, expected: Expected): void {
  for (const locale of LOCALES) {
    const files = build[locale]
    assert.deepEqual(blogRoutes(files), expected.routes[locale], `${locale} blog routes`)
    const sitemap = files.get("sitemap.xml") ?? ""
    assert.deepEqual(
      sitemapPaths(sitemap)
        .filter((route) => route === OVERVIEW || route.startsWith(`${OVERVIEW}/`))
        .toSorted(),
      expected.routes[locale],
      `${locale} sitemap lists exactly the published blog documents`
    )
    for (const [file, text] of files) {
      for (const marker of expected.absent) {
        assert.ok(!text.includes(marker), `${locale}/${file} contains ${marker}`)
      }
    }
  }
}

/**
 * Checks hreflang and the language switch: a paired page links its
 * counterpart, a single-language page has no alternates and switches to the
 * other language's blog overview.
 * @param build - Both language builds.
 * @param expected - The published routes.
 */
function checkLanguages(build: Build, expected: Expected): void {
  for (const locale of LOCALES) {
    const other = otherLocale(locale)
    for (const route of expected.routes[locale]) {
      const html = documentAt(build[locale], route) ?? ""
      assert.equal(canonical(html), `${ORIGINS[locale]}${route}`, `${locale}${route} canonical`)
      const switchTarget = languageLink(html, other)
      if (expected.paired.includes(route)) {
        assert.deepEqual(
          alternates(html),
          [
            `de ${ORIGINS.de}${route}`,
            `en ${ORIGINS.en}${route}`,
            `x-default ${ORIGINS.en}${route}`,
          ],
          `${locale}${route} links both languages`
        )
        assert.equal(switchTarget, `${ORIGINS[other]}${route}`, `${locale}${route} switch`)
      } else {
        assert.deepEqual(alternates(html), [], `${locale}${route} has no alternates`)
        assert.equal(switchTarget, `${ORIGINS[other]}${OVERVIEW}`, `${locale}${route} falls back`)
      }
    }
  }
}

/**
 * The overview's own links to the other language: the empty state links the
 * other blog's overview once, an overview with posts not at all.
 * @param build - Both language builds.
 * @param empty - The languages whose overview shows the empty state.
 */
function checkOverviewLinks(build: Build, empty: readonly Locale[]): void {
  for (const locale of LOCALES) {
    const other = otherLocale(locale)
    const links = mainLanguageLinks(documentAt(build[locale], OVERVIEW) ?? "")
    assert.deepEqual(
      links,
      empty.includes(locale) ? [`${other} ${ORIGINS[other]}${OVERVIEW}`] : [],
      `${locale}${OVERVIEW}: the empty state alone links the other blog`
    )
  }
}

/** A published post as its feed entries must show it. */
type FeedPost = {
  /** Text of the post body, which proves the entry has the full content. */
  readonly marker: string
  readonly route: string
  readonly tags: readonly string[]
}
type FeedExpectation = {
  readonly feed: Feed
  readonly kind: "atom" | "rss"
  readonly locale: Locale
  /** The published posts, newest first. */
  readonly posts: readonly FeedPost[]
}

function checkFeed({ feed, kind, locale, posts }: FeedExpectation): void {
  const label = `${locale} ${kind}`
  assert.equal(feed.error, undefined, `${label} is well-formed XML: ${feed.error ?? ""}`)
  assert.equal(feed.root, kind === "rss" ? "rss 2.0" : "atom feed", `${label} root`)
  assert.equal(feed.language, locale, `${label} language`)
  assert.deepEqual(
    feed.entries.map((entry) => entry.link),
    posts.map((post) => `${ORIGINS[locale]}${post.route}`),
    `${label} links every published post by its canonical URL`
  )
  const host = new URL(ORIGINS[locale]).host
  for (const [index, entry] of feed.entries.entries()) {
    const post = posts[index]
    assert.ok(
      entry.id.includes(`${host}${OVERVIEW}`),
      `${label} ${entry.id} is qualified by its publication`
    )
    assert.ok(
      entry.authors.length > 0 && entry.authors.every((name) => name.startsWith("Sebastian "))
    )
    assert.deepEqual(entry.categories, post.tags, `${label} ${post.route} carries its tag keys`)
    assert.ok(entry.categories.every((tag) => (BLOG_TAGS as readonly string[]).includes(tag)))
    assert.ok(entry.content.includes(post.marker), `${label} ${post.route} has its full content`)
  }
  assert.equal(new Set(feed.entries.map((entry) => entry.id)).size, feed.entries.length)
}

async function checkFeeds(
  page: Page,
  build: Build,
  posts: Readonly<Record<Locale, readonly FeedPost[]>>
): Promise<void> {
  const ids = new Map<Locale, readonly string[]>()
  for (const locale of LOCALES) {
    const own: string[] = []
    for (const kind of ["rss", "atom"] as const) {
      const xml = build[locale].get(`posts/${kind}.xml`)
      assert.ok(xml !== undefined, `${locale} has posts/${kind}.xml`)
      const feed = await parseFeed(page, xml)
      checkFeed({ feed, kind, locale, posts: posts[locale] })
      own.push(...feed.entries.map((entry) => entry.id))
    }
    ids.set(locale, own)
  }
  // A translated pair shares its post id; the feeds must still not collide.
  const german = new Set(ids.get("de"))
  assert.ok(
    (ids.get("en") ?? []).every((id) => !german.has(id)),
    "feed ids are unique per publication"
  )
}

async function expectRejected(content: string, message: RegExp, label: string): Promise<void> {
  const result = await node(
    [
      "scripts/build.ts",
      `--content=${content}`,
      `--build-time=${BEFORE}`,
      `--out=${path.join(scratch, "rejected")}`,
    ],
    app
  )
  assert.notEqual(result.code, 0, `${label} must fail the build`)
  assert.match(result.output, message, label)
}

/** Where Ardo writes the AVIF and JPEG renditions of post images. */
const RENDITIONS = "/assets/posts/"

/**
 * Every `src` and `srcset` candidate of the image elements in some markup.
 * @param html - The markup.
 * @returns The referenced URLs in document order.
 */
function imageUrls(html: string): readonly string[] {
  const urls: string[] = []
  for (const element of html.matchAll(/<(?:img|source)\b[^>]*>/gv)) {
    for (const match of element[0].matchAll(/\b(?<name>src|srcset)="(?<value>[^"]*)"/giv)) {
      const value = match.groups?.value ?? ""
      const candidates =
        match.groups?.name.toLowerCase() === "srcset"
          ? value.split(",").map((candidate) => candidate.trim().split(/\s+/v, 1)[0] ?? "")
          : [value]
      urls.push(...candidates.filter((url) => url !== ""))
    }
  }
  return urls
}

/**
 * The one `og:image` of a document.
 * @param html - The document.
 * @returns The preview URL.
 */
function socialImage(html: string): string {
  const previews = [...html.matchAll(/<meta\s[^>]*property="og:image"[^>]*>/gv)].map(
    (meta) => /\bcontent="(?<url>[^"]*)"/v.exec(meta[0])?.groups?.url ?? ""
  )
  assert.equal(previews.length, 1, "one social preview")
  return previews[0] ?? ""
}

/**
 * Every image in the post's `<main>` is one of Ardo's local renditions, and
 * the post has AVIF candidates, JPEG fallbacks, and its SVG.
 * @param client - The English client build.
 * @param main - The post's `<main>` markup.
 */
async function checkRenditions(client: string, main: string): Promise<void> {
  const urls = [...new Set(imageUrls(main))]
  for (const url of urls) {
    assert.ok(url.startsWith(RENDITIONS), `${url} is a local rendition`)
    await access(path.join(client, url))
  }
  for (const extension of [".avif", ".jpg", ".svg"]) {
    assert.ok(
      urls.some((url) => url.endsWith(extension)),
      `${PAIR_POST} has ${extension} images`
    )
  }
}

/**
 * The cover's JPEG is the post's one social preview and appears in both feeds.
 * @param build - Both language builds.
 * @param html - The English post document.
 * @param main - Its `<main>` markup.
 */
function checkPreview(build: Build, html: string, main: string): void {
  const cover = /<img\s[^>]*alt="COVER-ALT-MARKER"[^>]*>/v.exec(main)?.[0] ?? ""
  const coverJpeg = /\bsrc="(?<url>[^"]*\.jpg)"/v.exec(cover)?.groups?.url ?? ""
  assert.notEqual(coverJpeg, "", "the cover has a JPEG fallback")
  const preview = socialImage(html)
  assert.equal(preview, `${ORIGINS.en}${coverJpeg}`, "the cover JPEG is the social preview")
  for (const kind of ["rss", "atom"]) {
    assert.ok(
      (build.en.get(`posts/${kind}.xml`) ?? "").includes(preview),
      `the ${kind} feed shows the cover JPEG`
    )
  }
}

/**
 * The English pair post shows its framed cover with caption and the same file
 * in its body, all as Ardo's renditions in the build, and its cover is the
 * social preview. The German pair, without a cover, keeps the default preview.
 * @param root - The checkout-shaped fixture root.
 * @param build - Both language builds.
 */
async function checkImages(root: string, build: Build): Promise<void> {
  const html = documentAt(build.en, PAIR_POST) ?? ""
  const main = /<main\b[\s\S]*<\/main>/v.exec(html)?.[0] ?? ""
  for (const marker of ["COVER-ALT-MARKER", "COVER-CAPTION-MARKER", "INLINE-ALT-MARKER"]) {
    assert.ok(main.includes(marker), `${PAIR_POST} shows ${marker}`)
  }
  await checkRenditions(path.join(root, "apps/blog/build/blog-en/client"), main)
  checkPreview(build, html, main)
  const german = socialImage(documentAt(build.de, PAIR_POST) ?? "")
  assert.ok(!german.includes(RENDITIONS), "a post without a cover keeps the default preview")
}

const GERMAN_ONLY: FeedPost = { marker: "GERMAN-ONLY-MARKER", route: GERMAN_POST, tags: [] }
const SCHEDULED_POST: FeedPost = { marker: "SCHEDULED-MARKER", route: SCHEDULED_ROUTE, tags: [TAG] }
const GERMAN_PAIR: FeedPost = { marker: "PAIR-MARKER-DE", route: PAIR_POST, tags: [] }
const ENGLISH_PAIR: FeedPost = { marker: "PAIR-MARKER-EN", route: PAIR_POST, tags: [TAG] }
const MDX_POST: FeedPost = { marker: "MDX-PROSE-MARKER", route: MDX_ROUTE, tags: [] }

await rm(scratch, { force: true, recursive: true })
await mkdir(scratch, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage()

  // Source checks fail before any variant is built.
  await expectRejected(
    path.join(fixtures, "authored-counterpart"),
    /de\/beitrag\.md: counterpart is written by the build/v,
    "an authored counterpart"
  )

  const before = await buildFixture("before", path.join(fixtures, "posts"), BEFORE)
  const beforeBuild = await loadBuild(before)
  const beforeExpected: Expected = {
    absent: [...UNPUBLISHED, ...SCHEDULED],
    paired: [OVERVIEW, PAIR_POST],
    routes: {
      de: [OVERVIEW, GERMAN_POST, PAIR_POST],
      en: [OVERVIEW, MDX_ROUTE, PAIR_POST, TAG_ARCHIVE],
    },
  }
  checkRoutes(beforeBuild, beforeExpected)
  checkLanguages(beforeBuild, beforeExpected)
  checkOverviewLinks(beforeBuild, [])
  await checkFeeds(page, beforeBuild, {
    de: [GERMAN_ONLY, GERMAN_PAIR],
    en: [MDX_POST, ENGLISH_PAIR],
  })
  await checkImages(before, beforeBuild)

  const after = await buildFixture("after", path.join(fixtures, "posts"), AFTER)
  const afterBuild = await loadBuild(after)
  const afterExpected: Expected = {
    absent: UNPUBLISHED,
    paired: [OVERVIEW, PAIR_POST, SCHEDULED_ROUTE, TAG_ARCHIVE],
    routes: {
      de: [OVERVIEW, GERMAN_POST, PAIR_POST, SCHEDULED_ROUTE, TAG_ARCHIVE],
      en: [OVERVIEW, MDX_ROUTE, PAIR_POST, SCHEDULED_ROUTE, TAG_ARCHIVE],
    },
  }
  checkRoutes(afterBuild, afterExpected)
  checkLanguages(afterBuild, afterExpected)
  checkOverviewLinks(afterBuild, [])
  await checkFeeds(page, afterBuild, {
    de: [SCHEDULED_POST, GERMAN_ONLY, GERMAN_PAIR],
    en: [SCHEDULED_POST, MDX_POST, ENGLISH_PAIR],
  })

  // Git keeps no empty directory, so the empty state starts without any.
  const emptyContent = path.join(scratch, "empty-content")
  await mkdir(emptyContent, { recursive: true })
  const empty = await buildFixture("empty", emptyContent, BEFORE)
  const emptyBuild = await loadBuild(empty)
  const emptyExpected: Expected = {
    absent: [
      ...UNPUBLISHED,
      ...SCHEDULED,
      GERMAN_PAIR.marker,
      ENGLISH_PAIR.marker,
      MDX_POST.marker,
    ],
    paired: [OVERVIEW],
    routes: { de: [OVERVIEW], en: [OVERVIEW] },
  }
  checkRoutes(emptyBuild, emptyExpected)
  checkLanguages(emptyBuild, emptyExpected)
  checkOverviewLinks(emptyBuild, LOCALES)
  await checkFeeds(page, emptyBuild, { de: [], en: [] })
} finally {
  await browser.close()
}
console.log(
  "Blog fixtures: exclusion at two build times, feeds, MDX prose, empty state, language fallback, and post images passed"
)
