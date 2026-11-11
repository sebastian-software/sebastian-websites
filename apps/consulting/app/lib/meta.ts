import type { ArdoMetaDescriptor } from "ardo/runtime"

export type SeoMetadataOptions = {
  readonly additional?: readonly ArdoMetaDescriptor[]
  readonly description: string
  readonly openGraphType: "profile" | "website"
  readonly siteName?: string
  readonly title: string
}

/**
 * Builds the title, description, Open Graph, and Twitter tags of a profile page,
 * as the profiles carried them on sebastian-consulting.de.
 *
 * @param options - Title, description, Open Graph type, and extra tags.
 * @returns The meta descriptors for the route.
 */
export function createSeoMetadata(options: SeoMetadataOptions): ArdoMetaDescriptor[] {
  const { additional = [], description, openGraphType, siteName, title } = options
  return [
    { title },
    { content: description, name: "description" },
    { content: openGraphType, property: "og:type" },
    { content: title, property: "og:title" },
    { content: description, property: "og:description" },
    ...(siteName === undefined ? [] : [{ content: siteName, property: "og:site_name" }]),
    { content: "summary_large_image", name: "twitter:card" },
    { content: title, name: "twitter:title" },
    { content: description, name: "twitter:description" },
    ...additional,
  ]
}
