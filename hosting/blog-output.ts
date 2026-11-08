/**
 * The output half of the Software blog's raster-image ban; `blogImages.ts` in
 * web-core checks the sources. Until the Bunny image provider exists, the
 * `<main>` content of the blog documents and the feed entries reference no
 * image other than SVG, and the build holds no raster publication renditions.
 * The shared page frame around `<main>` keeps its Bunny images, so every blog
 * document must have exactly one `<main>` for the check to see its content.
 */
import type { Asset } from "./publish.ts"
import type { Target } from "./targets.ts"

import { BLOG_PATH, BLOG_SITE } from "../packages/web-core/src/blogPaths.ts"
import { VARIANTS } from "../packages/web-core/src/sites.ts"

const BLOG_DIRECTORY = `${BLOG_PATH.slice(1)}/`
const DOCUMENT = /(?:^|\/)index\.html$/v
const FEEDS: ReadonlySet<string> = new Set([
  `${BLOG_DIRECTORY}atom.xml`,
  `${BLOG_DIRECTORY}rss.xml`,
])
/** Where Ardo writes the AVIF and JPEG renditions of post images, and copies of their SVGs. */
export const PUBLICATION_RENDITIONS = "assets/posts/"

/** The elements that reference images, and the attributes that carry their URLs. */
const IMAGE_ATTRIBUTES: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ["image", new Set(["href", "xlink:href"])],
  ["img", new Set(["src", "srcset"])],
  ["object", new Set(["data"])],
  ["source", new Set(["src", "srcset"])],
  ["video", new Set(["poster"])],
])
const IMAGE_ELEMENT = /<(?<tag>img|source|image|video|object)\b[^>]*>/giv
const ATTRIBUTE =
  /(?<![\w:\-])(?<name>[\w:\-]+)\s*=\s*(?:"(?<double>[^"]*)"|'(?<single>[^']*)'|(?<bare>[^\s>"']+))/gv
const MAIN = /<main\b[\s\S]*?<\/main>/giv
const MAIN_START = /<main\b/giv
const CDATA = /<!\[CDATA\[(?<text>[\s\S]*?)\]\]>/gv
const ENTITIES: Readonly<Record<string, string>> = {
  "&#39;": "'",
  "&apos;": "'",
  "&gt;": ">",
  "&lt;": "<",
  "&quot;": '"',
}
const decoder = new TextDecoder()

/**
 * Tells whether a hosting target serves a variant of the Software site.
 *
 * @param target - A hosting target.
 * @returns Whether the target carries the blog.
 */
export function isBlogTarget(target: Target): boolean {
  return Object.values(VARIANTS).some(
    (variant) => variant.site === BLOG_SITE && variant.deploymentTarget === target.name
  )
}

/**
 * The markup a feed carries in its entries: CDATA sections unwrapped and
 * escaped HTML decoded, so the element check sees the post content.
 *
 * @param xml - An RSS or Atom document.
 * @returns The document with its embedded HTML as markup.
 */
function feedMarkup(xml: string): string {
  return xml
    .replaceAll(CDATA, (_match, text: string) => text)
    .replaceAll(/&(?:#39|apos|gt|lt|quot);/gv, (entity) => ENTITIES[entity] ?? entity)
    .replaceAll("&amp;", "&")
}

/**
 * Tells whether an image URL is an SVG, by its path or as an inlined data URL.
 *
 * @param url - An image URL from markup or an asset path.
 * @returns Whether it needs no raster rendition.
 */
function isSvg(url: string): boolean {
  // The site header inlines its SVG logo as a data URL.
  if (url.toLowerCase().startsWith("data:image/svg+xml")) return true
  const pathname = url.split(/[?#]/v, 1)[0] ?? ""
  return pathname.toLowerCase().endsWith(".svg")
}

/**
 * The value of one matched attribute, however it is quoted.
 *
 * @param match - A match of the attribute pattern.
 * @returns The unquoted value.
 */
function attributeValue(match: RegExpExecArray): string {
  return match.groups?.double ?? match.groups?.single ?? match.groups?.bare ?? ""
}

/**
 * The URLs in one attribute value: the value itself, or each `srcset` candidate.
 *
 * @param name - Which attribute it is, in lowercase; only `srcset` lists candidates.
 * @param value - The unquoted text after the equals sign.
 * @returns The referenced image addresses.
 */
function attributeUrls(name: string, value: string): readonly string[] {
  if (name !== "srcset") return [value]
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/v, 1)[0] ?? "")
    .filter((url) => url !== "")
}

/**
 * The image URLs one element references: `src` and the `srcset` candidates of
 * `<img>` and `<source>`, `href` of an SVG `<image>`, `poster` of a `<video>`,
 * and `data` of an `<object>`.
 *
 * @param tag - The element name, in lowercase.
 * @param element - The element's start tag.
 * @returns The referenced URLs.
 */
function elementUrls(tag: string, element: string): readonly string[] {
  const names = IMAGE_ATTRIBUTES.get(tag)
  if (names === undefined) return []
  return [...element.matchAll(ATTRIBUTE)].flatMap((match) => {
    const name = match.groups?.name.toLowerCase() ?? ""
    if (!names.has(name)) return []
    return attributeUrls(name, attributeValue(match))
  })
}

/**
 * Lists the non-SVG images that a piece of markup references.
 *
 * @param path - The file the markup comes from, for the messages.
 * @param markup - HTML or the decoded HTML of a feed.
 * @returns One message per raster reference.
 */
function markupIssues(path: string, markup: string): readonly string[] {
  return [...markup.matchAll(IMAGE_ELEMENT)].flatMap((match) =>
    elementUrls((match.groups?.tag ?? "").toLowerCase(), match[0])
      .filter((url) => !isSvg(url))
      .map((url) => `${path}: image ${url} is not an SVG`)
  )
}

/**
 * Lists the raster images of one blog document's `<main>` content, which must
 * occur exactly once.
 *
 * @param path - The document's path in the build.
 * @param html - The built page markup, frame included.
 * @returns One message per raster reference, or the missing or repeated `<main>`.
 */
function documentIssues(path: string, html: string): readonly string[] {
  const mains = [...html.matchAll(MAIN_START)].length
  if (mains !== 1) {
    return [`${path}: a blog document needs exactly one <main>, found ${String(mains)}`]
  }
  return markupIssues(path, [...html.matchAll(MAIN)].join("\n"))
}

/**
 * Lists the raster images in a Software build's blog output: non-SVG image
 * references in the one `<main>` of each blog document and in the feed
 * content, and any raster rendition of a publication image.
 *
 * @param assets - The complete client build of one Software variant.
 * @returns One message per rejected image; empty when the blog has none.
 */
export function blogImageIssues(assets: readonly Asset[]): readonly string[] {
  const issues: string[] = []
  for (const asset of assets) {
    if (asset.path.startsWith(PUBLICATION_RENDITIONS) && !isSvg(asset.path)) {
      issues.push(`${asset.path}: publication image renditions are not allowed`)
    } else if (asset.path.startsWith(BLOG_DIRECTORY) && DOCUMENT.test(asset.path)) {
      issues.push(...documentIssues(asset.path, decoder.decode(asset.bytes)))
    } else if (FEEDS.has(asset.path)) {
      issues.push(...markupIssues(asset.path, feedMarkup(decoder.decode(asset.bytes))))
    }
  }
  return issues
}

/**
 * Rejects a Software build whose blog output carries raster images, before
 * any remote file changes.
 *
 * @param target - The build's hosting target.
 * @param assets - The build's complete client files.
 * @throws {Error} Listing every rejected image.
 */
export function assertBlogOutput(target: Target, assets: readonly Asset[]): void {
  if (!isBlogTarget(target)) return
  const issues = blogImageIssues(assets)
  if (issues.length > 0) {
    const list = issues.map((issue) => `- ${issue}`).join("\n")
    throw new Error(
      `${target.name}: the blog carries raster images before the image plan:\n${list}`
    )
  }
}
