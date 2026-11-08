/**
 * The cross-language index of the Software blog. Each language has its own
 * posts; a translated pair shares one `id` and one path, and the index tells
 * every page whether it has a counterpart in the other language. Validation
 * covers every source, drafts and future posts included; the index lists only
 * the posts that are due at the shared build time.
 *
 * The functions are pure: the build reads the files, parses the YAML
 * frontmatter with the parser the publication uses, and passes the data here.
 */
import { rasterImageIssues } from "./blogImages.ts"
import { isNextStep, type NextStep } from "./blogNextSteps.ts"
import { BLOG_PATH, BLOG_TAGS_PATH, RESERVED_POST_SLUGS, singleLanguageClass } from "./blogPaths.ts"
import { type BlogTag, isBlogTag, isSlug } from "./blogTags.ts"
import { canonicalPath } from "./seo.ts"
import { type Locale, LOCALES } from "./sites.ts"
import { isZonedTimestamp } from "./timestamps.ts"

/** One post source of one language, as the build reads it. */
export type BlogPostSource = {
  /** The Markdown or MDX body after the frontmatter. */
  readonly body: string
  /** The path relative to the language's post directory, with forward slashes. */
  readonly file: string
  /** The parsed YAML frontmatter. */
  readonly frontmatter: Readonly<Record<string, unknown>>
  readonly locale: Locale
}

/** A validated post, due or not. */
export type BlogPost = {
  readonly draft: boolean
  readonly file: string
  readonly id: string
  readonly locale: Locale
  readonly nextStep: NextStep
  readonly path: string
  readonly publishedAt: string
  readonly tags: readonly BlogTag[]
}

/** What every page of one language needs to know about a due post. */
export type BlogIndexEntry = {
  readonly id: string
  readonly nextStep: NextStep
  readonly path: string
  readonly tags: readonly BlogTag[]
}

/** The due posts of both languages at one build time, newest first. */
export type BlogIndex = {
  readonly buildTime: string
  readonly posts: Readonly<Record<Locale, readonly BlogIndexEntry[]>>
}

/** Every problem the blog sources have, reported together. */
export class BlogValidationError extends Error {
  public readonly issues: readonly string[]

  public constructor(issues: readonly string[], options?: ErrorOptions) {
    const list = issues.map((issue) => `- ${issue}`).join("\n")
    super(`The blog sources are invalid:\n${list}`, options)
    this.name = "BlogValidationError"
    this.issues = issues
  }
}

const FRONTMATTER = /^\uFEFF?---[ \t]*\r?\n(?<yaml>[\s\S]*?)\r?\n?^---[ \t]*(?:\r?\n|$)/mv
const LAST_BMP_CODE_POINT = 0xff_ff
const SOURCE_EXTENSION = /\.mdx?$/v
const INDEX_FILE = /(?:^|\/)(?:index|home)$/v

/**
 * Splits a post source into its YAML frontmatter and its body.
 *
 * @param source - The complete file content.
 * @returns The unparsed frontmatter, empty when there is none, and the body.
 */
export function splitFrontmatter(source: string): { readonly body: string; readonly yaml: string } {
  const match = FRONTMATTER.exec(source)
  if (match?.index !== 0) {
    return { body: source, yaml: "" }
  }
  return { body: source.slice(match[0].length), yaml: match.groups?.yaml ?? "" }
}

/**
 * Derives a post's path the way the publication does: the frontmatter `path`,
 * or the file path below `/blog` without its extension and index name.
 *
 * @param file - The source path relative to the language's post directory.
 * @param path - The optional `path` frontmatter field.
 * @returns The post path without a trailing slash.
 */
export function blogPostPath(file: string, path: unknown): string {
  if (typeof path === "string") {
    return path.replace(/\/$/v, "")
  }
  const relative = file.replace(SOURCE_EXTENSION, "").replace(INDEX_FILE, "")
  return `${BLOG_PATH}/${relative}`
}

type Parsed = { readonly issues: readonly string[]; readonly post?: BlogPost }

function readTags(value: unknown, issues: string[]): readonly BlogTag[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    issues.push("tags must be a list of tag keys")
    return []
  }
  const tags = value.filter((tag): tag is BlogTag => isBlogTag(tag))
  for (const tag of value.filter((entry: unknown) => !isBlogTag(entry))) {
    issues.push(`unknown tag ${JSON.stringify(tag)}; add the key to the tag registry first`)
  }
  if (new Set(tags).size !== tags.length) issues.push("tags must not repeat")
  return tags
}

function readPath(source: BlogPostSource, issues: string[]): string {
  const path = blogPostPath(source.file, source.frontmatter.path)
  const slug = path.startsWith(`${BLOG_PATH}/`) ? path.slice(BLOG_PATH.length + 1) : ""
  if (!isSlug(slug) || singleLanguageClass(path) !== "post") {
    issues.push(
      `path ${path} must be ${BLOG_PATH}/<slug>, one lowercase hyphenated segment other than ${RESERVED_POST_SLUGS.join(", ")}`
    )
  }
  return path
}

type Identity = Pick<BlogPostSource["frontmatter"], "draft" | "id" | "nextStep" | "publishedAt">

function readIdentity(frontmatter: BlogPostSource["frontmatter"], issues: string[]): Identity {
  const { draft = false, id, nextStep, publishedAt } = frontmatter
  if (typeof id !== "string" || id.trim() === "") issues.push("id must be a non-empty string")
  if (!isNextStep(nextStep)) {
    issues.push(
      nextStep === undefined
        ? "nextStep is required; use none for a development report"
        : `unknown nextStep ${JSON.stringify(nextStep)}`
    )
  }
  if (typeof publishedAt !== "string" || !isZonedTimestamp(publishedAt)) {
    issues.push("publishedAt must be a timestamp with a time zone")
  }
  if (typeof draft !== "boolean") issues.push("draft must be a boolean")
  return { draft, id, nextStep, publishedAt }
}

function parsePost(source: BlogPostSource): Parsed {
  const issues: string[] = []
  const identity = readIdentity(source.frontmatter, issues)
  const path = readPath(source, issues)
  const tags = readTags(source.frontmatter.tags, issues)
  issues.push(
    ...rasterImageIssues({
      body: source.body,
      format: source.file.endsWith(".mdx") ? "mdx" : "md",
      frontmatter: source.frontmatter,
    })
  )
  const { draft, id, nextStep, publishedAt } = identity
  if (
    issues.length > 0 ||
    typeof id !== "string" ||
    !isNextStep(nextStep) ||
    typeof publishedAt !== "string" ||
    typeof draft !== "boolean"
  ) {
    return { issues }
  }
  return {
    issues,
    post: {
      draft,
      file: source.file,
      id,
      locale: source.locale,
      nextStep,
      path,
      publishedAt,
      tags,
    },
  }
}

function duplicates(posts: readonly BlogPost[], key: "id" | "path"): readonly string[] {
  const seen = new Map<string, string>()
  const issues: string[] = []
  for (const post of posts) {
    const first = seen.get(post[key])
    if (first === undefined) seen.set(post[key], post.file)
    else issues.push(`${post.locale}: ${key} ${post[key]} is used by ${first} and ${post.file}`)
  }
  return issues
}

function uniquenessIssues(posts: readonly BlogPost[]): readonly string[] {
  return LOCALES.flatMap((locale) => {
    const own = posts.filter((post) => post.locale === locale)
    return [...duplicates(own, "id"), ...duplicates(own, "path")]
  })
}

function pairingIssues(posts: readonly BlogPost[]): readonly string[] {
  const issues: string[] = []
  const german = posts.filter((post) => post.locale === "de")
  const english = posts.filter((post) => post.locale === "en")
  for (const post of german) {
    const sameId = english.find((other) => other.id === post.id)
    if (sameId !== undefined && sameId.path !== post.path) {
      issues.push(`id ${post.id} has path ${post.path} in de but ${sameId.path} in en`)
    }
    const samePath = english.find((other) => other.path === post.path)
    if (samePath !== undefined && samePath.id !== post.id) {
      issues.push(`path ${post.path} has id ${post.id} in de but ${samePath.id} in en`)
    }
  }
  return issues
}

/**
 * Validates every post source of both languages, drafts and future posts
 * included: the required fields, the path shape, `nextStep`, tag keys, the
 * raster-image ban, unique IDs and paths per language, and the pairing rules
 * (same `id` means same path, same path means same `id`).
 *
 * @param sources - All post sources of both languages.
 * @returns The validated posts in source order.
 * @throws {BlogValidationError} Listing every problem found.
 */
export function validateBlogPosts(sources: readonly BlogPostSource[]): readonly BlogPost[] {
  const issues: string[] = []
  const posts: BlogPost[] = []
  for (const source of sources) {
    const parsed = parsePost(source)
    issues.push(...parsed.issues.map((issue) => `${source.locale}/${source.file}: ${issue}`))
    if (parsed.post !== undefined) posts.push(parsed.post)
  }
  issues.push(...uniquenessIssues(posts), ...pairingIssues(posts))
  if (issues.length > 0) {
    throw new BlogValidationError(issues)
  }
  return posts
}

/**
 * Tells whether a post appears in a build: it is no draft, and its publication
 * time is not later than the shared build time.
 *
 * @param post - A validated post.
 * @param buildTime - The build time both language builds share.
 * @returns Whether the build publishes the post.
 */
export function isDuePost(post: BlogPost, buildTime: Date): boolean {
  return !post.draft && Date.parse(post.publishedAt) <= buildTime.getTime()
}

/**
 * Orders two strings by Unicode code point, independent of the build
 * machine's collation.
 *
 * @param left - The first string.
 * @param right - The second string.
 * @returns A negative number, zero, or a positive number, as `sort` expects.
 */
function compareCodePoints(left: string, right: string): number {
  let index = 0
  while (index < left.length && index < right.length) {
    const a = left.codePointAt(index) ?? 0
    const b = right.codePointAt(index) ?? 0
    if (a !== b) return a - b
    // Both strings agree so far, so a supplementary character spans two units in each.
    index += a > LAST_BMP_CODE_POINT ? 2 : 1
  }
  return left.length - right.length
}

/**
 * Validates all sources and indexes the posts that are due at the shared
 * build time, newest first per language.
 *
 * @param sources - All post sources of both languages.
 * @param buildTime - The build time both language builds share.
 * @returns The cross-language index the variant builds receive as build data.
 * @throws {BlogValidationError} When any source, due or not, is invalid.
 */
export function createBlogIndex(sources: readonly BlogPostSource[], buildTime: Date): BlogIndex {
  if (Number.isNaN(buildTime.getTime())) {
    throw new TypeError("The blog build time must be a valid date")
  }
  const due = validateBlogPosts(sources)
    .filter((post) => isDuePost(post, buildTime))
    .toSorted(
      (left, right) =>
        Date.parse(right.publishedAt) - Date.parse(left.publishedAt) ||
        compareCodePoints(left.id, right.id)
    )
  const entries = (locale: Locale): readonly BlogIndexEntry[] =>
    due
      .filter((post) => post.locale === locale)
      .map(({ id, nextStep, path, tags }) => ({ id, nextStep, path, tags }))
  return { buildTime: buildTime.toISOString(), posts: { de: entries("de"), en: entries("en") } }
}

/**
 * Lists the tag archives of one language: every tag a due post of that
 * language uses, in the order the newest posts first use them.
 *
 * @param index - The cross-language index.
 * @param locale - The archive language.
 * @returns The tag keys with an archive.
 */
export function blogTagArchives(index: BlogIndex, locale: Locale): readonly BlogTag[] {
  return [...new Set(index.posts[locale].flatMap((post) => post.tags))]
}

/**
 * The launch guard: while the blog navigation item is launching, both
 * languages must publish at least one post at the shared build time, so the
 * item cannot go live on one domain only. The caller decides when it applies.
 *
 * @param index - The cross-language index of the build.
 * @throws {BlogValidationError} Naming each language without a published post.
 */
export function assertBlogLaunch(index: BlogIndex): void {
  const issues = LOCALES.filter((locale) => index.posts[locale].length === 0).map(
    (locale) =>
      `${locale}: the blog navigation item is launching, but no post is published at ${index.buildTime}`
  )
  if (issues.length > 0) {
    throw new BlogValidationError(issues)
  }
}

/**
 * The other language of the two.
 *
 * @param locale - One language.
 * @returns The other one.
 */
export function otherLocale(locale: Locale): Locale {
  return locale === "de" ? "en" : "de"
}

/**
 * The counterpart a staged post of one language carries: its own path when
 * the other language publishes a post there at the same build time, or null.
 *
 * @param index - The cross-language index.
 * @param locale - The language of the staged post.
 * @param path - The route of the staged post, with or without a trailing slash.
 * @returns The counterpart path, or null when the post has none.
 */
export function blogPostCounterpart(index: BlogIndex, locale: Locale, path: string): null | string {
  const own = canonicalPath(path)
  return index.posts[otherLocale(locale)].some((post) => post.path === own) ? own : null
}

/**
 * Tells whether a page of the blog site exists in the other language. Only the
 * two single-language classes can lack a counterpart: a due post pairs by its
 * path, and a tag archive exists where a due post of the other language uses
 * the tag. Every other page, the overview, nested publication pages, and paths
 * that are no due post of this language included, exists in both languages.
 *
 * @param index - The cross-language index.
 * @param locale - The language of the rendering page.
 * @param pathname - The page's path.
 * @returns Whether the other language has the same path.
 */
export function hasBlogCounterpart(index: BlogIndex, locale: Locale, pathname: string): boolean {
  const path = canonicalPath(pathname)
  const other = otherLocale(locale)
  switch (singleLanguageClass(path)) {
    case "post": {
      const own = index.posts[locale].some((post) => post.path === path)
      return !own || index.posts[other].some((post) => post.path === path)
    }
    case "tag-archive": {
      const tag = path.slice(BLOG_TAGS_PATH.length + 1)
      const own = (blogTagArchives(index, locale) as readonly string[]).includes(tag)
      return !own || (blogTagArchives(index, other) as readonly string[]).includes(tag)
    }
    case undefined: {
      return true
    }
  }
}

/**
 * Finds the due post of a page in its own language.
 *
 * @param index - The cross-language index.
 * @param locale - The language of the rendering page.
 * @param pathname - The page's path.
 * @returns The index entry, or undefined when the page is no post.
 */
export function blogPostAt(
  index: BlogIndex,
  locale: Locale,
  pathname: string
): BlogIndexEntry | undefined {
  const path = canonicalPath(pathname)
  return index.posts[locale].find((post) => post.path === path)
}
