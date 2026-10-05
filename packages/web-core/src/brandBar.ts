import { type BrandId, getSiteOrigin, type Locale, type SiteId } from "./sites.ts"

/** Labels are brand and area names; they are not translated. */
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
  readonly label: string
  readonly path: string
  readonly site: SiteId
}

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
      { id: "software", label: "Sebastian Software", path: "/", site: "software" },
      { id: "opensource", label: "Open Source", path: "/", site: "opensource" },
      { id: "skills", label: "Skills", path: "/", site: "skills" },
    ],
  },
  {
    brand: "consulting",
    links: [
      { id: "consulting", label: "Sebastian Consulting", path: "/", site: "consulting" },
      { id: "services", label: "Services", path: "/services", site: "consulting" },
      { id: "profiles", label: "Profiles", path: "/profiles", site: "consulting" },
    ],
  },
]

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
      label: link.label,
    })),
  }))
}
