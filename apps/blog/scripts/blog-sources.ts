/* eslint-disable security/detect-non-literal-fs-filename -- Paths are restricted to the authored post directories. */
/* eslint-disable no-await-in-loop -- Post directories are read in a stable order. */
import type { Dirent } from "node:fs"

import {
  assertBlogLaunch,
  type BlogIndex,
  blogPostCounterpart,
  type BlogPostSource,
  blogTagArchives,
  createBlogIndex,
  type Locale,
  LOCALES,
  otherLocale,
  splitFrontmatter,
} from "@sebastian-websites/web-core"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { parse as parseYaml } from "yaml"

/** Translation relationships are derived by the build; sources must not set them. */
export const COUNTERPART = "counterpart"
const POST_FILE = /\.mdx?$/v

/** The blog of one build: every source and the index at the shared build time. */
export type BlogBuild = {
  readonly index: BlogIndex
  readonly sources: readonly BlogPostSource[]
}

/** A post source the build refuses before any variant is built. */
export class BlogSourceError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "BlogSourceError"
  }
}

/**
 * Tells whether a thrown value is a Node.js error with the given code.
 * @param error - The caught value.
 * @param code - The error code, such as `ENOENT`.
 * @returns Whether it matches.
 */
function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && "code" in error && error.code === code
}

/**
 * What an entry of the post tree is to the publication. Posts must be regular
 * files, and the tree holds no symbolic link, so the publication never reads through one.
 *
 * @param entry - A directory entry that is neither hidden nor `_`-prefixed.
 * @param relative - Its path below the language directory, for messages.
 * @returns `directory`, `post`, or `other` for a non-post asset.
 * @throws {BlogSourceError} For a symbolic link, or a post that is no regular file.
 */
function entryKind(entry: Dirent, relative: string): "directory" | "other" | "post" {
  if (entry.isSymbolicLink()) {
    throw new BlogSourceError(`${relative}: symbolic links are not allowed in the blog content`)
  }
  if (entry.isDirectory()) return "directory"
  if (!POST_FILE.test(entry.name)) return "other"
  if (!entry.isFile()) throw new BlogSourceError(`${relative}: a post must be a regular file`)
  return "post"
}

/**
 * The Markdown and MDX files of one language, the way the publication reads
 * them: recursively, without hidden or `_`-prefixed entries.
 *
 * @param directory - The language's post directory.
 * @param prefix - The path of `directory` below the language directory.
 * @returns Post files relative to the language directory, with forward slashes.
 * @throws {BlogSourceError} For a symbolic link, or a post that is no regular file.
 */
async function postFiles(directory: string, prefix = ""): Promise<string[]> {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    // Git drops empty directories; a language without posts has none.
    if (hasCode(error, "ENOENT")) return []
    throw error
  }
  const files: string[] = []
  for (const entry of entries.toSorted((left, right) => (left.name < right.name ? -1 : 1))) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue
    const relative = `${prefix}${entry.name}`
    const kind = entryKind(entry, relative)
    if (kind === "directory") {
      files.push(...(await postFiles(path.join(directory, entry.name), `${relative}/`)))
    } else if (kind === "post") files.push(relative)
  }
  return files
}

/**
 * Tells whether parsed YAML is a mapping, the only valid shape of frontmatter.
 * @param value - The parsed frontmatter.
 * @returns Whether it is a plain object.
 */
function isMapping(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Reads one post file and parses its frontmatter.
 *
 * @param directory - The language's post directory.
 * @param locale - The language of the file.
 * @param file - The file path relative to `directory`.
 * @returns The source with its parsed frontmatter.
 * @throws {BlogSourceError} For invalid YAML, a non-mapping, or an authored counterpart.
 */
async function readSource(
  directory: string,
  locale: Locale,
  file: string
): Promise<BlogPostSource> {
  const split = splitFrontmatter(await readFile(path.join(directory, file), "utf8"))
  let parsed: unknown
  try {
    parsed = parseYaml(split.yaml) ?? {}
  } catch (error) {
    throw new BlogSourceError(`${locale}/${file}: the frontmatter is not valid YAML`, {
      cause: error,
    })
  }
  if (!isMapping(parsed)) {
    throw new BlogSourceError(`${locale}/${file}: the frontmatter must be a YAML mapping`)
  }
  if (Object.hasOwn(parsed, COUNTERPART)) {
    throw new BlogSourceError(
      `${locale}/${file}: ${COUNTERPART} is written by the build; remove it from the source`
    )
  }
  return { body: split.body, file, frontmatter: parsed, locale }
}

/** How a build reads its posts. */
export type ReadBlogOptions = {
  /**
   * The launch guard: fail when either language publishes nothing at the
   * build time. `build.ts` sets it while the navigation item is launching and
   * the posts are the site's own, so fixture builds and tests decide for
   * themselves in every phase.
   */
  readonly requireBothLanguages: boolean
}

/**
 * Reads and validates the posts of both languages, drafts and future posts
 * included, and indexes the posts that are due at the shared build time.
 *
 * @param content - The directory that holds the `de` and `en` post directories.
 * @param buildTime - The shared build time, as Ardo receives it.
 * @param options - Whether the launch guard applies.
 * @returns The validated sources and the cross-language index.
 * @throws {BlogSourceError} For a link, unreadable frontmatter, or an authored counterpart.
 * @throws {Error} A `BlogValidationError` for invalid posts or the launch guard.
 */
export async function readBlog(
  content: string,
  buildTime: string,
  options: ReadBlogOptions
): Promise<BlogBuild> {
  const sources: BlogPostSource[] = []
  for (const locale of LOCALES) {
    const directory = path.join(content, locale)
    for (const file of await postFiles(directory)) {
      sources.push(await readSource(directory, locale, file))
    }
  }
  const index = createBlogIndex(sources, new Date(buildTime))
  if (options.requireBothLanguages) assertBlogLaunch(index)
  return { index, sources }
}

/** The only cross-language information a domain's pages need. */
export type BlogLanguageData = {
  readonly counterparts: Readonly<Record<string, null | string>>
  readonly otherLanguage: readonly string[]
}

/**
 * Keep translation paths and tag keys, without another language's post content.
 * @param index - The validated publication index at one build time.
 * @param locale - The domain's language.
 * @returns Only the translation data this domain's pages need.
 */
export function blogLanguageData(index: BlogIndex, locale: Locale): BlogLanguageData {
  return {
    counterparts: Object.fromEntries(
      index.posts[locale].map((post) => [post.path, blogPostCounterpart(index, locale, post.path)])
    ),
    otherLanguage: blogTagArchives(index, otherLocale(locale)),
  }
}
