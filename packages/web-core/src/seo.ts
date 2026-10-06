import { getSiteOrigin, type Locale, LOCALES, type SiteId, SOURCE_LOCALE } from "./sites.ts"

export type SeoLink = {
  readonly href: string
  readonly hrefLang?: "x-default" | Locale
  readonly rel: "alternate" | "canonical"
}

/**
 * Normalizes a path to the canonical form: leading slash, no trailing slash
 * except for the root (ADR-0010).
 *
 * @param path - A path as seen in the router, with or without slashes.
 * @returns The path with one leading slash and no trailing slash.
 */
export function canonicalPath(path: string): string {
  let end = path.length
  while (end > 1 && path[end - 1] === "/") {
    end -= 1
  }
  const trimmed = path.slice(0, end)
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

/**
 * Builds the absolute canonical URL of a path on one variant.
 *
 * @param site - The site whose origin is used.
 * @param locale - The language, which selects the domain.
 * @param path - The path on that site, normalized before use.
 * @returns The absolute URL.
 */
export function canonicalUrl(site: SiteId, locale: Locale, path: string): string {
  const normalized = canonicalPath(path)
  return `${getSiteOrigin(site, locale)}${normalized === "/" ? "/" : normalized}`
}

/**
 * Builds the canonical link, one alternate per language, and the English
 * `x-default` for a document.
 *
 * @param site - The site rendering the document.
 * @param locale - The document's language.
 * @param path - The document's path.
 * @returns The link descriptors for the document head.
 */
export function createSeoLinks(site: SiteId, locale: Locale, path: string): readonly SeoLink[] {
  return [
    { href: canonicalUrl(site, locale, path), rel: "canonical" },
    ...LOCALES.map((target) => ({
      href: canonicalUrl(site, target, path),
      hrefLang: target,
      rel: "alternate" as const,
    })),
    { href: canonicalUrl(site, SOURCE_LOCALE, path), hrefLang: "x-default", rel: "alternate" },
  ]
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

/**
 * Builds the sitemap of one variant: absolute canonical URLs of that variant only.
 *
 * @param site - The site whose sitemap is built.
 * @param locale - The variant's language, which selects the domain.
 * @param paths - Indexable paths; redirects and downloads are not listed.
 * @returns The sitemap XML.
 */
export function createSitemap(site: SiteId, locale: Locale, paths: readonly string[]): string {
  const urls = paths.map((path) => canonicalUrl(site, locale, path))
  if (new Set(urls).size !== urls.length) {
    throw new Error("Sitemap paths must be unique after normalization.")
  }
  const entries = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`
}

/**
 * Builds the robots file that points to the variant's own sitemap.
 *
 * @param site - The site whose robots file is built.
 * @param locale - The variant's language, which selects the domain.
 * @returns The robots.txt content.
 */
export function createRobots(site: SiteId, locale: Locale): string {
  return `User-agent: *
Allow: /

Sitemap: ${canonicalUrl(site, locale, "/sitemap.xml")}
`
}
