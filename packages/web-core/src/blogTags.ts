/**
 * The tag registry of the Software blog. Keys are English, lowercase, and
 * hyphenated, the same in both languages; translated labels belong to the
 * site's Palamedes catalog, and feeds carry the key. Add a key here before a
 * post uses it.
 */
export const BLOG_TAGS = [
  "architecture",
  "internationalization",
  "open-source",
  "product-development",
  "rust",
  "typescript",
] as const

export type BlogTag = (typeof BLOG_TAGS)[number]

const SLUG_SEGMENT = /^[a-z0-9]+$/v

/**
 * Tells whether a value is a lowercase, hyphenated slug, the form of tag keys
 * and post slugs; a tag key doubles as its archive slug below `/blog/tags/`.
 *
 * @param value - The candidate slug.
 * @returns Whether it consists of lowercase letters and digits joined by single hyphens.
 */
export function isSlug(value: string): boolean {
  return value.split("-").every((segment) => SLUG_SEGMENT.test(segment))
}

/**
 * Tells whether a value is a registered tag key.
 *
 * @param value - A tag from post frontmatter.
 * @returns Whether the registry knows the key.
 */
export function isBlogTag(value: unknown): value is BlogTag {
  return typeof value === "string" && (BLOG_TAGS as readonly string[]).includes(value)
}
