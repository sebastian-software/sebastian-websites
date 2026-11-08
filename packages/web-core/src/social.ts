import type { Locale, SiteId } from "./sites.ts"

import { canonicalUrl } from "./seo.ts"
import { isZonedTimestamp } from "./timestamps.ts"

/** Open Graph names a language together with its region. */
export const OPEN_GRAPH_LOCALES = {
  de: "de_DE",
  en: "en_US",
} as const satisfies Readonly<Record<Locale, string>>

/** An absolute, already transformed preview image, such as a `responsiveImage()` result. */
export type SocialImage = {
  readonly height: number
  readonly url: string
  readonly width: number
}

/** Article metadata; timestamps carry a time zone, as the publication requires. */
export type SocialArticle = {
  /** The last substantive revision; defaults to the publication time. */
  readonly modifiedAt?: string
  readonly publishedAt: string
  /** Tag keys of the article. */
  readonly tags?: readonly string[]
}

export type SocialMetaOptions = {
  /** Marks the document as an article with its publication times. */
  readonly article?: SocialArticle
  readonly description?: string
  readonly image: SocialImage
  readonly locale: Locale
  /**
   * The canonical path of the document. Documents without a canonical, such as
   * the not-found page, omit it and get no `og:url`.
   */
  readonly path?: string
  readonly site: SiteId
  readonly siteName: string
  readonly title: string
}

/** One social `meta` element: Open Graph uses `property`, Twitter uses `name`. */
export type SocialMetaTag =
  | { readonly content: string; readonly name: string }
  | { readonly content: string; readonly property: string }

function articleTime(value: string, field: string): string {
  const time = new Date(value)
  if (!isZonedTimestamp(value)) {
    throw new Error(`Article ${field} must be an ISO timestamp with a time zone: ${value}`)
  }
  return time.toISOString()
}

function assertImage(image: SocialImage): void {
  const url = new URL(image.url)
  if (url.protocol !== "https:") {
    throw new Error(`Social preview images must be absolute HTTPS URLs: ${image.url}`)
  }
  if (![image.width, image.height].every((value) => Number.isSafeInteger(value) && value > 0)) {
    throw new Error("Social preview image dimensions must be positive integers")
  }
}

function articleTags(article: SocialArticle): readonly SocialMetaTag[] {
  const published = articleTime(article.publishedAt, "publishedAt")
  const modified =
    article.modifiedAt === undefined ? published : articleTime(article.modifiedAt, "modifiedAt")
  if (modified < published) {
    throw new Error("Article modifiedAt cannot precede publishedAt")
  }
  return [
    { content: published, property: "article:published_time" },
    { content: modified, property: "article:modified_time" },
    ...(article.tags ?? []).map((tag) => ({ content: tag, property: "article:tag" })),
  ]
}

/**
 * Builds the Open Graph and Twitter card metadata of one document. `og:url`
 * equals the canonical URL, so previews and search engines name the same page.
 *
 * @param options - The document's site, language, canonical path, copy, and preview image.
 * @returns The `meta` elements in a stable order.
 */
export function createSocialMeta(options: SocialMetaOptions): readonly SocialMetaTag[] {
  assertImage(options.image)
  return [
    { content: options.article === undefined ? "website" : "article", property: "og:type" },
    { content: options.title, property: "og:title" },
    ...(options.description === undefined
      ? []
      : [{ content: options.description, property: "og:description" }]),
    ...(options.path === undefined
      ? []
      : [
          {
            content: canonicalUrl(options.site, options.locale, options.path),
            property: "og:url",
          },
        ]),
    { content: options.siteName, property: "og:site_name" },
    { content: OPEN_GRAPH_LOCALES[options.locale], property: "og:locale" },
    { content: options.image.url, property: "og:image" },
    { content: String(options.image.width), property: "og:image:width" },
    { content: String(options.image.height), property: "og:image:height" },
    ...(options.article === undefined ? [] : articleTags(options.article)),
    { content: "summary_large_image", name: "twitter:card" },
  ]
}
