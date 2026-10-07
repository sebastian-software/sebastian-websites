import { canonicalPath } from "./seo.ts"
import {
  type BrandId,
  getSiteOrigin,
  type Locale,
  LOCALE_LABELS,
  LOCALES,
  SITE_BRAND,
  type SiteId,
  SOURCE_LOCALE,
} from "./sites.ts"

/**
 * Interim shared intro-call calendar of the Consulting site, until the shared
 * Terminaro calendar exists (sebastian-consulting.de, `BOOKING.shared`).
 */
export const BOOKING_URL = "https://calendly.com/swernerx/15min"

/** The company's public profiles, shown as small glyph links in every footer. */
export const COMPANY_PROFILES = [
  { href: "https://www.linkedin.com/company/sebastian-software/", id: "linkedin" },
  { href: "https://github.com/sebastian-software", id: "github" },
] as const

export type CompanyProfile = (typeof COMPANY_PROFILES)[number]

/** Consulting's contact mailbox carries the variant's language. */
const CONSULTING_CONTACT = {
  de: "kontakt@sebastian-consulting.de",
  en: "contact@sebastian-consulting.com",
} as const satisfies Readonly<Record<Locale, string>>

export type FrameLinkId =
  | "booking"
  | "company"
  | "contact"
  | "imprint"
  | "opensource"
  | "privacy"
  | "products"
  | "profiles"
  | "services"
  | "skills"

/** A resolved link of the frame; labels belong to the rendering site's catalog. */
export type FrameLink = {
  readonly current: boolean
  readonly href: string
  readonly id: FrameLinkId
}

export type LanguageLink = {
  readonly current: boolean
  readonly href: string
  readonly label: string
  readonly locale: Locale
}

/** Everything the header and the page ending need for one page. */
export type SiteFrame = {
  /** The brand that publishes the current site; it owns the only logo. */
  readonly brand: BrandId
  /** The current brand's home page. */
  readonly home: string
  /** The footer's local index. */
  readonly index: readonly FrameLink[]
  readonly languages: readonly LanguageLink[]
  readonly legal: readonly FrameLink[]
  /** The header's local links. */
  readonly navigation: readonly FrameLink[]
  /** The other brand, reached by plain outward text in the same language. */
  readonly outbound: { readonly brand: BrandId; readonly href: string }
}

type Destination =
  | { readonly href: (locale: Locale) => string; readonly id: FrameLinkId }
  | { readonly id: FrameLinkId; readonly path: string; readonly site: "current" | SiteId }

type ContextSpec = {
  readonly home: SiteId
  readonly index: readonly Destination[]
  readonly navigation: readonly Destination[]
  readonly outbound: BrandId
}

const PRODUCTS: Destination = { id: "products", path: "/products", site: "software" }
const OPEN_SOURCE: Destination = { id: "opensource", path: "/", site: "opensource" }
const SKILLS: Destination = { id: "skills", path: "/", site: "skills" }
const SERVICES: Destination = { id: "services", path: "/#services", site: "consulting" }
const PROFILES: Destination = { id: "profiles", path: "/#profiles", site: "consulting" }

/**
 * The two frame contexts. Open Source and Skills belong to Software. Routes that
 * do not exist yet (the Software journal, Consulting references) stay out until
 * they can be validated; the booking link replaces a contact route on Consulting.
 */
const CONTEXTS: Readonly<Record<BrandId, ContextSpec>> = {
  consulting: {
    home: "consulting",
    index: [SERVICES, PROFILES, { href: () => BOOKING_URL, id: "booking" }],
    navigation: [SERVICES, PROFILES],
    outbound: "software",
  },
  software: {
    home: "software",
    index: [PRODUCTS, OPEN_SOURCE, SKILLS, { id: "company", path: "/company", site: "software" }],
    navigation: [PRODUCTS, OPEN_SOURCE, SKILLS],
    outbound: "consulting",
  },
}

const LEGAL: Readonly<Record<BrandId, readonly Destination[]>> = {
  consulting: [
    { id: "imprint", path: "/imprint", site: "current" },
    { id: "privacy", path: "/privacy", site: "current" },
    { href: (locale) => `mailto:${CONSULTING_CONTACT[locale]}`, id: "contact" },
  ],
  software: [
    { id: "imprint", path: "/imprint", site: "current" },
    { id: "privacy", path: "/privacy", site: "current" },
    { id: "contact", path: "/contact", site: "software" },
  ],
}

/** The switch reads EN / DE: the source language first (ADR-0006). */
const LANGUAGE_ORDER: readonly Locale[] = [
  SOURCE_LOCALE,
  ...LOCALES.filter((locale) => locale !== SOURCE_LOCALE),
]

function toHref(origin: string, path: string): string {
  return path === "/" ? `${origin}/` : `${origin}${path}`
}

type Rendering = {
  readonly locale: Locale
  readonly path: string
  readonly site: SiteId
}

function isCurrent(target: SiteId, path: string, rendering: Rendering): boolean {
  if (target !== rendering.site || path.includes("#")) {
    return false
  }
  // An area's home is current anywhere on that area's site; the brand home is not a menu entry.
  if (path === "/") {
    return CONTEXTS[SITE_BRAND[target]].home !== target
  }
  return rendering.path === path || rendering.path.startsWith(`${path}/`)
}

function resolve(destination: Destination, rendering: Rendering): FrameLink {
  if ("href" in destination) {
    return { current: false, href: destination.href(rendering.locale), id: destination.id }
  }
  const target = destination.site === "current" ? rendering.site : destination.site
  // Same-site links stay relative so that origin hosts and previews keep working.
  const href =
    target === rendering.site
      ? destination.path
      : toHref(getSiteOrigin(target, rendering.locale), destination.path)
  return { current: isCurrent(target, destination.path, rendering), href, id: destination.id }
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
  return LANGUAGE_ORDER.map((target) => ({
    current: target === locale,
    href: toHref(getSiteOrigin(site, target), canonicalPath(path)),
    label: LOCALE_LABELS[target],
    locale: target,
  }))
}

/**
 * Resolves the header and page-ending links of one page. The current site's
 * brand owns the logo and local links; the other brand is one outward link.
 * Cross-site links always keep the current language.
 *
 * @param site - The site that renders the page.
 * @param locale - The language of the rendering variant.
 * @param pathname - The current path, as seen by the router.
 * @returns The resolved frame links for that page.
 */
export function getSiteFrame(site: SiteId, locale: Locale, pathname: string): SiteFrame {
  const brand = SITE_BRAND[site]
  const context = CONTEXTS[brand]
  const rendering: Rendering = { locale, path: canonicalPath(pathname), site }
  const link = (destination: Destination): FrameLink => resolve(destination, rendering)
  return {
    brand,
    home: context.home === site ? "/" : toHref(getSiteOrigin(context.home, locale), "/"),
    index: context.index.map((destination) => link(destination)),
    languages: getLanguageLinks(site, locale, rendering.path),
    legal: LEGAL[brand].map((destination) => link(destination)),
    navigation: context.navigation.map((destination) => link(destination)),
    outbound: {
      brand: context.outbound,
      href: toHref(getSiteOrigin(CONTEXTS[context.outbound].home, locale), "/"),
    },
  }
}
