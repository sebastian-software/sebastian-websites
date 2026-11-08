import type { ArdoMetaDescriptor } from "ardo/runtime"

/** The format names that tell the two feed discovery links apart. */
const FEED_FORMATS: Readonly<Record<string, string>> = {
  "application/atom+xml": "Atom",
  "application/rss+xml": "RSS",
}

/**
 * The format of a feed discovery link, from its media type.
 * @param descriptor - A link descriptor.
 * @returns `RSS`, `Atom`, or undefined for any other link.
 */
function feedFormat(descriptor: ArdoMetaDescriptor): string | undefined {
  return "type" in descriptor && typeof descriptor.type === "string"
    ? FEED_FORMATS[descriptor.type]
    : undefined
}

/**
 * Ardo's feed discovery links, which the site's own metadata keeps: index,
 * post and tag `defaults` end with the RSS and Atom alternates. Ardo gives
 * both the publication's name as their title; each gains its format, so feed
 * readers and browsers offer two distinguishable subscriptions.
 * @param defaults - The descriptors Ardo would render.
 * @returns The RSS and Atom alternate links.
 */
export function feedLinks(defaults: readonly ArdoMetaDescriptor[]): ArdoMetaDescriptor[] {
  return defaults
    .filter(
      (descriptor) =>
        "tagName" in descriptor &&
        descriptor.tagName === "link" &&
        "rel" in descriptor &&
        descriptor.rel === "alternate"
    )
    .map((descriptor) => {
      const format = feedFormat(descriptor)
      if (format === undefined) return descriptor
      const name =
        "title" in descriptor && typeof descriptor.title === "string" ? descriptor.title : "Blog"
      return { ...descriptor, title: `${name} (${format})` }
    })
}

/**
 * The robots directive of a blog page: none while the blog is indexed, and
 * `noindex` while its navigation item is off, so search engines skip the
 * unlinked pages until the launch.
 * @param indexed - Whether the build indexes the blog (`__BLOG_INDEXED__`).
 * @returns The robots descriptors.
 */
export function blogRobots(indexed: boolean): ArdoMetaDescriptor[] {
  return indexed ? [] : [{ content: "noindex", name: "robots" }]
}

/**
 * Reads the counterpart `build.ts` writes into a staged post, or the tag
 * module's `frontmatter` returns: the other language's path, or null.
 * @param value - The `counterpart` field as Ardo passes it on.
 * @returns The other language's path, or undefined when the page has none.
 */
export function counterpartPath(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}
