import {
  type BrandId,
  getSiteOrigin,
  type Locale,
  LOCALE_LABELS,
  LOCALES,
  type SiteId,
} from "./sites.ts"

/** Brand names stay as they are; area names carry the variant's language. */
export type BrandBarLink = {
  readonly current: boolean
  readonly href: string
  readonly id: string
  readonly label: string
}

export type BrandBarGroup = {
  readonly brand: BrandId
  readonly links: readonly BrandBarLink[]
}

type LinkSpec = {
  readonly id: string
  readonly label: Readonly<Record<Locale, string>>
  readonly path: string
  readonly site: SiteId
}

const same = (label: string): Readonly<Record<Locale, string>> => ({ de: label, en: label })

type GroupSpec = {
  readonly brand: BrandId
  readonly links: readonly LinkSpec[]
}

/**
 * The two groups of equal weight: each brand followed by its areas. Services
 * and Profiles lead into the Consulting site.
 */
const GROUPS: readonly GroupSpec[] = [
  {
    brand: "software",
    links: [
      { id: "software", label: same("Sebastian Software"), path: "/", site: "software" },
      { id: "opensource", label: same("Open Source"), path: "/", site: "opensource" },
      { id: "skills", label: same("Skills"), path: "/", site: "skills" },
    ],
  },
  {
    brand: "consulting",
    links: [
      { id: "consulting", label: same("Sebastian Consulting"), path: "/", site: "consulting" },
      {
        id: "services",
        label: { de: "Leistungen", en: "Services" },
        path: "/services",
        site: "consulting",
      },
      {
        id: "profiles",
        label: { de: "Profile", en: "Profiles" },
        path: "/profiles",
        site: "consulting",
      },
    ],
  },
]

export type LanguageLink = {
  readonly current: boolean
  readonly href: string
  readonly label: string
  readonly locale: Locale
}

/**
 * Builds the language switch: the same path on the other locale's origin, so a
 * switch replaces only the domain (ADR-0010).
 *
 * @param site - The site that renders the switch.
 * @param locale - The language of the rendering variant.
 * @param path - The current path, starting with a slash.
 * @returns One link per language, the current one marked.
 */
export function getLanguageLinks(
  site: SiteId,
  locale: Locale,
  path: string
): readonly LanguageLink[] {
  return LOCALES.map((target) => ({
    current: target === locale,
    href: toHref(getSiteOrigin(site, target), path),
    label: LOCALE_LABELS[target],
    locale: target,
  }))
}

function toHref(origin: string, path: string): string {
  return path === "/" ? `${origin}/` : `${origin}${path}`
}

/**
 * Builds the brand bar for one site in one language. Links never switch the
 * language: every target uses the origin of the current locale.
 *
 * @param currentSite - The site that renders the bar.
 * @param locale - The language of the rendering variant.
 * @returns Both groups with absolute links and the current site marked.
 */
export function getBrandBar(currentSite: SiteId, locale: Locale): readonly BrandBarGroup[] {
  return GROUPS.map((group) => ({
    brand: group.brand,
    links: group.links.map((link) => ({
      current: link.path === "/" && link.site === currentSite,
      href: toHref(getSiteOrigin(link.site, locale), link.path),
      id: link.id,
      label: link.label[locale],
    })),
  }))
}
