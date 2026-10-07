/**
 * Known legacy paths of the former sites and where they live now (ADR-0010).
 * Each rule applies to its site in both languages; an unknown path is not
 * redirected and stays 404. Rule IDs follow the matrix of the former Consulting
 * repository (its ADR-0002), so the decision record and these tests share names.
 */
import {
  getSiteOrigin,
  type Locale,
  LOCALES,
  type SiteId,
  VARIANTS,
} from "../packages/web-core/src/sites.ts"

/** Where a legacy path now lives. Without a locale, the requesting host's language applies. */
export type Destination = {
  readonly locale?: Locale
  readonly path: string
  readonly site: SiteId
}

/**
 * One legacy path, either moved or removed on purpose. A path ending in `/*`
 * matches everything below it.
 */
export type PathRule =
  | { readonly destination: Destination; readonly id: string; readonly path: string }
  | { readonly gone: true; readonly id: string; readonly path: string }

// The former Consulting site carried the language as a path prefix. These are
// its known routes below the prefix; the empty path is the home page.
const CONSULTING_PREFIXED_PATHS = [
  "",
  "/fastner",
  "/fastner/projektprofil",
  "/werner",
  "/privacy",
  "/imprint",
] as const

const CONSULTING_RENAMED_PATHS: Readonly<Record<string, string>> = {
  "/fastner/projektprofil": "/fastner/project-profile",
}

function currentConsultingPath(path: string): string {
  return CONSULTING_RENAMED_PATHS[path] ?? (path === "" ? "/" : path)
}

// `/de/…` always leads to the German site and `/en/…` to the English one, so on
// the other language's host these rules are the matrix's CON-CROSS rules.
const CONSULTING_LOCALE_RULES: readonly PathRule[] = LOCALES.flatMap((locale) =>
  CONSULTING_PREFIXED_PATHS.map((path) => ({
    destination: { locale, path: currentConsultingPath(path), site: "consulting" },
    id: `CON-LOC-${locale.toUpperCase()}`,
    path: `/${locale}${path}`,
  }))
)

/** The legacy rules of every site. */
export const PATH_RULES: Readonly<Record<SiteId, readonly PathRule[]>> = {
  consulting: [
    ...CONSULTING_LOCALE_RULES,
    {
      destination: { path: "/fastner/project-profile", site: "consulting" },
      id: "CON-PROJECT-PROFILE",
      path: "/fastner/projektprofil",
    },
    // The fixed-price offers were not carried over; they need their own concept.
    {
      gone: true,
      id: "CON-OFFER-GONE",
      path: "/pdfs/angebot-react-delivery-architecture-reset-de.pdf",
    },
    { gone: true, id: "CON-OFFER-GONE", path: "/pdfs/offer-global-saas-ai-localization-en.pdf" },
  ],
  opensource: [],
  skills: [],
  software: [
    { destination: { path: "/fastner", site: "consulting" }, id: "SW-FASTNER", path: "/fastner" },
    { destination: { path: "/werner", site: "consulting" }, id: "SW-WERNER", path: "/werner" },
    { destination: { path: "/", site: "consulting" }, id: "SW-CONSULTING", path: "/consulting" },
    { destination: { path: "/team", site: "consulting" }, id: "SW-TEAM", path: "/team" },
    { destination: { path: "/company", site: "software" }, id: "SW-MISSION", path: "/mission" },
    {
      destination: { path: "/privacy", site: "software" },
      id: "SW-PRIVACY",
      path: "/privacy-policy",
    },
    // Testimonials return as Consulting references (#26); until then they are gone.
    { gone: true, id: "SW-TESTIMONIALS", path: "/testimonials" },
    { gone: true, id: "SW-TESTIMONIALS", path: "/testimonial/*" },
  ],
}

/** The site and language one storage zone serves. */
export type ServingVariant = { readonly locale: Locale; readonly site: SiteId }

/** What a legacy path resolves to, or nothing for a current or unknown path. */
export type LegacyPlan =
  | { readonly id: string; readonly kind: "gone" }
  | { readonly id: string; readonly kind: "moved"; readonly location: string }

function withoutTrailingSlashes(pathname: string): string {
  let end = pathname.length
  while (end > 1 && pathname[end - 1] === "/") {
    end -= 1
  }
  return pathname.slice(0, end)
}

function matches(rule: PathRule, pathname: string): boolean {
  return rule.path.endsWith("/*")
    ? pathname.startsWith(rule.path.slice(0, -1))
    : pathname === rule.path
}

/**
 * Finds the site and language a storage zone serves.
 *
 * @param storageZone - The zone name, which is the variant's deployment target.
 * @returns The variant's site and language, or nothing for the brand or asset zones.
 */
export function zoneVariant(storageZone: string): ServingVariant | undefined {
  return Object.values(VARIANTS).find((variant) => variant.deploymentTarget === storageZone)
}

/**
 * Resolves a requested path against the legacy rules of the serving site. A
 * move within the same site and language keeps the visitor's host, so the
 * origin hosts redirect to themselves before the cutover; every other move
 * targets the canonical origin. Trailing slashes on the legacy path are
 * ignored, so a redirect never chains.
 *
 * @param serving - The site and language of the requesting host.
 * @param url - The requested URL as the visitor sees it.
 * @returns The redirect or removal, or nothing when no rule applies.
 */
export function planLegacyPath(serving: ServingVariant, url: URL): LegacyPlan | undefined {
  const pathname = withoutTrailingSlashes(url.pathname)
  const rule = PATH_RULES[serving.site].find((candidate) => matches(candidate, pathname))
  if (rule === undefined) {
    return undefined
  }
  if ("gone" in rule) {
    return { id: rule.id, kind: "gone" }
  }
  const { destination } = rule
  const locale = destination.locale ?? serving.locale
  const sameHost = destination.site === serving.site && locale === serving.locale
  const origin = sameHost ? url.origin : getSiteOrigin(destination.site, locale)
  return { id: rule.id, kind: "moved", location: `${origin}${destination.path}` }
}
