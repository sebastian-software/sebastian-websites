import { BLOG_NAVIGATION } from "./blogLaunch.ts"
import { BLOG_PATH, BLOG_SITE } from "./blogPaths.ts"
import { localeControls } from "./locale.ts"
import { canonicalPath, canonicalUrl, type PageReference, resolvePage } from "./seo.ts"
import {
  type BrandId,
  getSiteOrigin,
  type Locale,
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

/** Each brand's contact mailbox; Consulting's carries the variant's language. */
const CONTACT_EMAIL = {
  consulting: { de: "info@sebastian-consulting.de", en: "info@sebastian-consulting.com" },
  software: { de: "info@sebastian-software.de", en: "info@sebastian-software.de" },
} as const satisfies Readonly<Record<BrandId, Readonly<Record<Locale, string>>>>

/**
 * The brand's contact mailbox in one language, for footers, legal texts, and
 * printed profiles alike.
 *
 * @param brand - The brand whose mailbox is wanted.
 * @param locale - The language of the page or document.
 * @returns The mailbox address.
 */
export function contactEmail(brand: BrandId, locale: Locale): string {
  return CONTACT_EMAIL[brand][locale]
}

export type FrameLinkId =
  | "blog"
  | "booking"
  | "company"
  | "contact"
  | "imprint"
  | "opensource"
  | "privacy"
  | "products"
  | "profiles"
  | "references"
  | "services"

/** A resolved link of the frame; labels belong to the rendering site's catalog. */
export type FrameLink = {
  readonly current: boolean
  readonly href: string
  readonly id: FrameLinkId
}

export type LanguageLink = {
  readonly current: boolean
  /**
   * Set when the page has no counterpart and the link leads to the other
   * language's blog overview instead of a translation.
   */
  readonly fallback?: true
  readonly href: string
  readonly label: string
  readonly locale: Locale
}

/** Everything the header and the page ending need for one page. */
export type SiteFrame = {
  /** The brand that publishes the current site; it owns the only logo. */
  readonly brand: BrandId
  /** The brand's contact mailbox in the page's language, shown in the footer address. */
  readonly email: string
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
const SERVICES: Destination = { id: "services", path: "/services", site: "consulting" }
const PROFILES: Destination = { id: "profiles", path: "/team", site: "consulting" }
const REFERENCES: Destination = { id: "references", path: "/references", site: "consulting" }
/** The tech blog's home; the brand's other sites link it like Products, as a cross-site link. */
const BLOG: Destination = { id: "blog", path: "/", site: BLOG_SITE }

/**
 * The two frame contexts. Open Source belongs to Software; Effective Agent is a
 * product and is reached through Open Source, not the header (2026-10-09). The
 * tech blog joins the brand navigation of every Software site once its
 * launch phase (`BLOG_NAVIGATION`) is `launching` or `live`; the footer index
 * stays without it. The booking link replaces a contact route on Consulting.
 */
const CONTEXTS: Readonly<Record<BrandId, ContextSpec>> = {
  consulting: {
    home: "consulting",
    index: [SERVICES, PROFILES, REFERENCES, { href: () => BOOKING_URL, id: "booking" }],
    navigation: [SERVICES, PROFILES, REFERENCES],
    outbound: "software",
  },
  software: {
    home: "software",
    index: [PRODUCTS, OPEN_SOURCE, { id: "company", path: "/company", site: "software" }],
    navigation: BLOG_NAVIGATION === "off" ? [PRODUCTS, OPEN_SOURCE] : [PRODUCTS, OPEN_SOURCE, BLOG],
    outbound: "consulting",
  },
}

const LEGAL: Readonly<Record<BrandId, readonly Destination[]>> = {
  consulting: [
    { id: "imprint", path: "/imprint", site: "current" },
    { id: "privacy", path: "/privacy", site: "current" },
    { href: (locale) => `mailto:${CONTACT_EMAIL.consulting[locale]}`, id: "contact" },
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
 * switch replaces only the domain (ADR-0010). A page without a counterpart
 * links the other language's blog overview instead.
 *
 * @param site - The site that renders the switch.
 * @param locale - The language of the rendering variant.
 * @param page - The current path, optionally with whether the other language has it.
 * @returns One link per language, the current one marked.
 */
export function getLanguageLinks(
  site: SiteId,
  locale: Locale,
  page: PageReference
): readonly LanguageLink[] {
  const { counterpart, path } = resolvePage(page)
  if (!counterpart && site !== BLOG_SITE) {
    throw new Error(`${site} has no blog; every page needs a counterpart`)
  }
  return localeControls
    .switchItems({ currentLocale: locale })
    .toSorted(
      (left, right) => LANGUAGE_ORDER.indexOf(left.locale) - LANGUAGE_ORDER.indexOf(right.locale)
    )
    .map((item) => {
      const fallback = !counterpart && !item.active
      return {
        current: item.active,
        ...(fallback ? { fallback: true as const } : {}),
        href: canonicalUrl(site, item.locale, fallback ? BLOG_PATH : path),
        label: item.label,
        locale: item.locale,
      }
    })
}

/**
 * Resolves the header and page-ending links of one page. The current site's
 * brand owns the logo and local links; the other brand is one outward link.
 * Cross-site links always keep the current language.
 *
 * @param site - The site that renders the page.
 * @param locale - The language of the rendering variant.
 * @param page - The current path, as seen by the router, optionally with
 *   whether the other language has the page.
 * @returns The resolved frame links for that page.
 */
export function getSiteFrame(site: SiteId, locale: Locale, page: PageReference): SiteFrame {
  const { counterpart, path: pathname } = resolvePage(page)
  const brand = SITE_BRAND[site]
  const context = CONTEXTS[brand]
  const rendering: Rendering = { locale, path: canonicalPath(pathname), site }
  const link = (destination: Destination): FrameLink => resolve(destination, rendering)
  return {
    brand,
    email: CONTACT_EMAIL[brand][locale],
    home: context.home === site ? "/" : toHref(getSiteOrigin(context.home, locale), "/"),
    index: context.index.map((destination) => link(destination)),
    languages: getLanguageLinks(site, locale, { counterpart, path: rendering.path }),
    legal: LEGAL[brand].map((destination) => link(destination)),
    navigation: context.navigation.map((destination) => link(destination)),
    outbound: {
      brand: context.outbound,
      href: toHref(getSiteOrigin(CONTEXTS[context.outbound].home, locale), "/"),
    },
  }
}
