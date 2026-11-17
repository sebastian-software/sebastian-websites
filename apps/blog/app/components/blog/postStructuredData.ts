import type { Post } from "ardo/config"

import {
  ORGANIZATION_ID,
  personIdentity,
  type SocialImage,
  type VariantDefinition,
} from "@sebastian-websites/web-core"

type Article = Pick<
  Post,
  "authors" | "description" | "path" | "publishedAt" | "title" | "updatedAt"
>

/**
 * Article facts from the same post that supplies its visible byline and feeds.
 * @param post - The published article data.
 * @param variant - The canonical website and language.
 * @param image - An actual prepared representative image, when available.
 * @returns One article with stable publisher and known author references.
 */
export function postStructuredData(
  post: Article,
  variant: VariantDefinition,
  image?: SocialImage
): Readonly<Record<string, unknown>> {
  const url = new URL(post.path, variant.canonicalOrigin).href
  return {
    "@context": "https://schema.org",
    "@id": `${url}#article`,
    "@type": "BlogPosting",
    author: post.authors.map((author) =>
      author.id === "fastner" || author.id === "werner"
        ? personIdentity(author.id, variant.locale)
        : { "@type": "Person", name: author.name }
    ),
    datePublished: post.publishedAt,
    ...(post.updatedAt === undefined ? {} : { dateModified: post.updatedAt }),
    description: post.description ?? post.title,
    headline: post.title,
    ...(image === undefined ? {} : { image: image.url }),
    inLanguage: variant.locale,
    isPartOf: { "@id": `${variant.canonicalOrigin}/#website` },
    mainEntityOfPage: { "@id": url, "@type": "WebPage" },
    publisher: { "@id": ORGANIZATION_ID },
    url,
  }
}
