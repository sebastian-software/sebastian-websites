/* eslint-disable security/detect-non-literal-fs-filename -- Paths stay below the fixture directory and its scratch output. */
/* eslint-disable no-await-in-loop -- Fixture builds and their checks run one after another. */
/**
 * Builds the blog fixtures in `test/fixtures/blog/` into `build/fixtures/` and
 * checks the output: drafts and posts that are not due stay out of every
 * file at one build time and appear in both languages at a later one, both
 * feeds parse with a strict XML parser, an MDX post with prose builds past
 * Palamedes, the empty state builds and links the other blog, single-language
 * pages switch to the other blog, and raster images fail the source and
 * output checks. Every fixture build passes the hosting gate of `pnpm
 * hosting:plan`.
 *
 * Run it with `pnpm --filter @sebastian-websites/software check:fixtures`.
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
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
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
  de: getVariant("software-de").canonicalOrigin,
  en: getVariant("software-en").canonicalOrigin,
}
const TAG = "internationalization"
const OVERVIEW = "/blog"
const PAIR_POST = "/blog/pair"
const GERMAN_POST = "/blog/nur-deutsch"
const MDX_ROUTE = "/blog/mdx-prose"
const SCHEDULED_ROUTE = "/blog/scheduled"
const TAG_ARCHIVE = `${OVERVIEW}/tags/${TAG}`
/** Before the scheduled pair falls due on December 1, 2026, and after it. */
const BEFORE = "2026-11-20T12:00:00Z"
const AFTER = "2026-12-02T12:00:00Z"
/** Text that only unpublished fixture posts contain. */
const UNPUBLISHED = ["DRAFT-MARKER", "fixture-draft", "/blog/draft"]
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
    `--out=${path.join(root, "apps/software/build")}`,
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
    path.join(root, "apps/software/build", `software-${locale}`, "client")
  return { de: await textFiles(client("de")), en: await textFiles(client("en")) }
}

function blogRoutes(files: ReadonlyMap<string, string>): readonly string[] {
  return [...files.keys()]
    .filter((file) => file === "blog/index.html" || /^blog\/.+\/index\.html$/v.test(file))
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
      const xml = build[locale].get(`blog/${kind}.xml`)
      assert.ok(xml !== undefined, `${locale} has blog/${kind}.xml`)
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

/**
 * The output half of the raster-image check: a raster `<img>` added to a
 * built post must fail the hosting gate.
 * @param root - A fixture root that passed the gate.
 */
async function expectOutputRejected(root: string): Promise<void> {
  const doctored = path.join(scratch, "raster-output")
  await rm(doctored, { force: true, recursive: true })
  await cp(root, doctored, { recursive: true })
  const post = path.join(doctored, "apps/software/build/software-en/client/blog/pair/index.html")
  const html = await readFile(post, "utf8")
  await writeFile(post, html.replace("</article>", '<img src="/photo.jpg" alt=""></article>'))
  const result = await node(["hosting/check-builds.ts", doctored], repository)
  assert.notEqual(result.code, 0, "a raster image in the blog output must fail the gate")
  assert.match(result.output, /blog\/pair\/index\.html: image \/photo\.jpg is not an SVG/v)
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
    path.join(fixtures, "raster-image"),
    /en\/photo\.md: Markdown image \.\/photo\.jpg is not an SVG/v,
    "a raster image in a post"
  )
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
  await expectOutputRejected(before)

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
  "Blog fixtures: exclusion at two build times, feeds, MDX prose, empty state, language fallback, and raster-image checks passed"
)
