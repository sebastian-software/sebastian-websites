/**
 * The source half of the blog's raster-image ban. Until the Bunny image
 * provider exists, posts carry no raster images: no image frontmatter, no
 * non-SVG Markdown images, no image elements, no non-SVG MDX file imports, and
 * no author avatars. SVG stays allowed.
 */

/** Frontmatter fields that would make Ardo render or emit a raster image. */
export const IMAGE_FRONTMATTER_FIELDS = ["coverImage", "images", "ogImage", "twitterImage"] as const

const INLINE_IMAGE = /!\[[^\]]*\]\(\s*(?:<(?<angle>[^>]*)>|(?<bare>[^\s\)]+))/gv
const REFERENCE_IMAGE = /!\[(?<alt>[^\]]*)\]/gv
const DEFINITION = /^ {0,3}\[(?<label>[^\]]+)\]:[ \t]*(?:<(?<angle>[^>]*)>|(?<bare>\S+))/gmv
const IMAGE_ELEMENT = /<(?:img|picture|source)\b/iv
const IMAGE_COMPONENT = /<Image\b/v
/** The start of an MDX ESM statement; MDX allows them at the start of a line only. */
const ESM_STATEMENT = /^(?:import|export)\b/gmv
/** The module of a static statement: `… from "x"`, or the bare `import "x"`. */
const STATIC_SPECIFIER = /(?:\bfrom\s*|^import\s*)["'](?<specifier>[^"']+)["']/v
const DYNAMIC_IMPORT = /\bimport\s*\(\s*["'](?<specifier>[^"']+)["']/gv
const FENCE_LENGTH = 3
/** Module extensions an MDX post may import as components or data. */
const CODE_EXTENSIONS = new Set([".js", ".jsx", ".md", ".mdx", ".mjs", ".ts", ".tsx"])

/**
 * The opening or closing fence of a code block: three or more backticks or tildes.
 *
 * @param line - One source line.
 * @returns The fence characters, or undefined when the line is no fence.
 */
function fenceOf(line: string): string | undefined {
  const trimmed = line.trimStart()
  const marker = trimmed[0]
  if (marker !== "`" && marker !== "~") return undefined
  let length = 0
  while (trimmed[length] === marker) length += 1
  return length >= FENCE_LENGTH ? marker.repeat(length) : undefined
}

function withoutFencedCode(markdown: string): string {
  const kept: string[] = []
  let open: string | undefined
  for (const line of markdown.split("\n")) {
    const fence = fenceOf(line)
    if (open === undefined) {
      if (fence === undefined) kept.push(line)
      else open = fence
    } else if (fence?.startsWith(open) === true) {
      open = undefined
    }
  }
  return kept.join("\n")
}

function withoutCodeSpans(markdown: string): string {
  let result = ""
  let index = 0
  while (index < markdown.length) {
    const start = markdown.indexOf("`", index)
    if (start === -1) break
    let end = start
    while (markdown[end] === "`") end += 1
    const ticks = markdown.slice(start, end)
    const close = markdown.indexOf(ticks, end)
    result += markdown.slice(index, start)
    index = close === -1 ? end : close + ticks.length
  }
  return result + markdown.slice(index)
}

function withoutCode(markdown: string): string {
  return withoutCodeSpans(withoutFencedCode(markdown))
}

function extension(target: string): string {
  const path = target.split(/[?#]/v, 1)[0] ?? ""
  const name = path.split("/").at(-1) ?? ""
  const dot = name.lastIndexOf(".")
  return dot <= 0 ? "" : name.slice(dot).toLowerCase()
}

function isSvg(target: string): boolean {
  return extension(target) === ".svg"
}

function normalizeLabel(label: string): string {
  return label.trim().replaceAll(/\s+/gv, " ").toLowerCase()
}

function definitions(markdown: string): ReadonlyMap<string, string> {
  const result = new Map<string, string>()
  for (const match of markdown.matchAll(DEFINITION)) {
    const label = normalizeLabel(match.groups?.label ?? "")
    if (!result.has(label)) {
      result.set(label, match.groups?.angle ?? match.groups?.bare ?? "")
    }
  }
  return result
}

function inlineImageIssues(markdown: string): readonly string[] {
  return [...markdown.matchAll(INLINE_IMAGE)]
    .map((match) => match.groups?.angle ?? match.groups?.bare ?? "")
    .filter((target) => !isSvg(target))
    .map((target) => `Markdown image ${target} is not an SVG`)
}

/**
 * The definition label of a reference-style image: `![alt][label]`, or the alt
 * text for the collapsed `![alt][]` and shortcut `![alt]` forms. Inline images
 * have no label.
 *
 * @param markdown - The source the match belongs to.
 * @param match - The `![alt]` match.
 * @returns The normalized label, or undefined for an inline image.
 */
function referenceKey(markdown: string, match: RegExpExecArray): string | undefined {
  const after = match.index + match[0].length
  const next = markdown[after]
  if (next === "(") return undefined
  const alt = match.groups?.alt ?? ""
  if (next !== "[") return normalizeLabel(alt)
  const close = markdown.indexOf("]", after)
  const label = close === -1 ? "" : markdown.slice(after + 1, close)
  return normalizeLabel(label === "" ? alt : label)
}

function referenceImageIssues(markdown: string): readonly string[] {
  const references = definitions(markdown)
  const issues: string[] = []
  for (const match of markdown.matchAll(REFERENCE_IMAGE)) {
    const key = referenceKey(markdown, match)
    const target = key === undefined ? undefined : references.get(key)
    if (key !== undefined && target !== undefined && !isSvg(target)) {
      issues.push(`Markdown image reference [${key}] points to ${target}, which is not an SVG`)
    }
  }
  return issues
}

/**
 * The text of one ESM statement: up to its semicolon or the blank line that
 * ends an MDX ESM block, so multi-line imports keep their `from` clause.
 *
 * @param markdown - The post body.
 * @param start - Where the statement begins.
 * @returns The statement text.
 */
function statementAt(markdown: string, start: number): string {
  const ends = [markdown.indexOf(";", start), markdown.indexOf("\n\n", start)].filter(
    (index) => index !== -1
  )
  return markdown.slice(start, ends.length === 0 ? markdown.length : Math.min(...ends))
}

function moduleSpecifiers(markdown: string): readonly string[] {
  const statics = [...markdown.matchAll(ESM_STATEMENT)].map(
    (match) => STATIC_SPECIFIER.exec(statementAt(markdown, match.index))?.groups?.specifier
  )
  const dynamics = [...markdown.matchAll(DYNAMIC_IMPORT)].map((match) => match.groups?.specifier)
  return [...statics, ...dynamics].filter((specifier) => specifier !== undefined)
}

function isAllowedModule(specifier: string): boolean {
  const type = extension(specifier)
  return !specifier.includes("?") && (type === "" || type === ".svg" || CODE_EXTENSIONS.has(type))
}

function mdxImportIssues(markdown: string): readonly string[] {
  return moduleSpecifiers(markdown)
    .filter((specifier) => !isAllowedModule(specifier))
    .map((specifier) => `MDX import ${specifier} is not an SVG or a module`)
}

/**
 * Lists the raster images in one post source. Code blocks and code spans are
 * ignored, so a post can still show Markdown image syntax as an example.
 *
 * @param post - The parsed frontmatter, the body without frontmatter, and the source format.
 * @param post.body - The Markdown or MDX body.
 * @param post.format - `mdx` also checks import statements.
 * @param post.frontmatter - The parsed frontmatter.
 * @returns One message per rejected image; empty when the post has none.
 */
export function rasterImageIssues(post: {
  readonly body: string
  readonly format: "md" | "mdx"
  readonly frontmatter: Readonly<Record<string, unknown>>
}): readonly string[] {
  const issues: string[] = IMAGE_FRONTMATTER_FIELDS.filter((field) =>
    Object.hasOwn(post.frontmatter, field)
  ).map((field) => `Frontmatter field ${field} is not allowed before the image plan`)
  const markdown = withoutCode(post.body)
  issues.push(...inlineImageIssues(markdown), ...referenceImageIssues(markdown))
  if (IMAGE_ELEMENT.test(markdown) || IMAGE_COMPONENT.test(markdown)) {
    issues.push("Image elements (img, picture, source, Image) are not allowed")
  }
  if (post.format === "mdx") {
    issues.push(...mdxImportIssues(markdown))
  }
  return issues
}

/**
 * Lists the author profiles that carry an avatar, which the blog does not use
 * until the image plan.
 *
 * @param authors - The publication's author profiles by key.
 * @returns One message per author with an avatar entry.
 */
export function authorAvatarIssues(
  authors: Readonly<Record<string, Readonly<Record<string, unknown>>>>
): readonly string[] {
  return Object.entries(authors)
    .filter(([, profile]) => Object.hasOwn(profile, "avatar"))
    .map(([key]) => `Author ${key} has an avatar entry`)
}
