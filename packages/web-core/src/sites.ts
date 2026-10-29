import { type Locale, localeControls, LOCALES } from "./locale.ts"

export { type Locale, LOCALE_LABELS, LOCALES, SOURCE_LOCALE } from "./locale.ts"

const APP_TRACKING_SITE = "app-tracking"
export const SITES = ["software", "consulting", "opensource", "skills", APP_TRACKING_SITE] as const
export type SiteId = (typeof SITES)[number]

export const BRANDS = ["software", "consulting"] as const
export type BrandId = (typeof BRANDS)[number]

/** Open Source, Skills, and app-tracking are areas of the Software brand. */
export const SITE_BRAND = {
  "app-tracking": "software",
  consulting: "consulting",
  opensource: "software",
  skills: "software",
  software: "software",
} as const satisfies Readonly<Record<SiteId, BrandId>>

export type VariantDefinition = {
  readonly canonicalOrigin: string
  readonly deploymentTarget: string
  readonly locale: Locale
  readonly productionActive: boolean
  readonly site: SiteId
}

type VariantMap = Readonly<Record<string, VariantDefinition>>

function assertOrigin(variantId: string, variant: VariantDefinition): void {
  const url = new URL(variant.canonicalOrigin)
  if (url.protocol !== "https:" || url.origin !== variant.canonicalOrigin) {
    throw new Error(`${variantId} canonical origin must be an HTTPS origin without a path.`)
  }
  const expectedOrigin = new URL(
    localeControls.canonicalUrl({
      locale: variant.locale,
      pathname: "/",
      requestHost: url.host,
    })
  ).origin
  if (url.origin !== expectedOrigin) {
    throw new Error(
      `${variantId} maps locale ${variant.locale} to ${url.hostname}; expected ${expectedOrigin}.`
    )
  }
}

function assertUnique(seen: Set<string>, value: string, label: string): void {
  if (seen.has(value)) {
    throw new Error(`${label} ${value} is assigned more than once.`)
  }
  seen.add(value)
}

type ValidationState = {
  readonly activeBySite: Map<SiteId, Set<boolean>>
  readonly localesBySite: Map<SiteId, Set<Locale>>
  readonly origins: Set<string>
  readonly targets: Set<string>
}

function addToGroup<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue): void {
  const group = map.get(key) ?? new Set<TValue>()
  group.add(value)
  map.set(key, group)
}

function recordVariant(
  variantId: string,
  variant: VariantDefinition,
  state: ValidationState
): void {
  if (variantId !== `${variant.site}-${variant.locale}`) {
    throw new Error(`${variantId} must be named ${variant.site}-${variant.locale}.`)
  }
  assertOrigin(variantId, variant)
  assertUnique(state.origins, variant.canonicalOrigin, "Canonical origin")
  assertUnique(state.targets, variant.deploymentTarget, "Deployment target")
  addToGroup(state.localesBySite, variant.site, variant.locale)
  addToGroup(state.activeBySite, variant.site, variant.productionActive)
}

function assertCompleteSites(state: ValidationState): void {
  for (const [site, locales] of state.localesBySite) {
    if (LOCALES.some((locale) => !locales.has(locale))) {
      throw new Error(`${site} must define one German and one English variant.`)
    }
    if (state.activeBySite.get(site)?.size !== 1) {
      throw new Error(`${site} must be production-active in both languages or in neither.`)
    }
  }
}

/**
 * Validates the variant list: one German and one English variant per site, the
 * TLD matching the locale, and unique origins and hosting targets. A site goes
 * live in both languages or not at all.
 *
 * @param variants - Variant definitions keyed by `${site}-${locale}`.
 * @returns The validated, frozen variant list with its literal types intact.
 */
export function defineVariants<const TVariants extends VariantMap>(
  variants: TVariants
): Readonly<TVariants> {
  const state: ValidationState = {
    activeBySite: new Map(),
    localesBySite: new Map(),
    origins: new Set(),
    targets: new Set(),
  }
  for (const [variantId, variant] of Object.entries(variants)) {
    recordVariant(variantId, variant, state)
  }
  assertCompleteSites(state)
  return Object.freeze(variants)
}

export const VARIANTS = defineVariants({
  "app-tracking-de": {
    canonicalOrigin: "https://app-tracking.sebastian-software.de",
    deploymentTarget: "sebastian-websites-app-tracking-de",
    locale: "de",
    productionActive: true,
    site: APP_TRACKING_SITE,
  },
  "app-tracking-en": {
    canonicalOrigin: "https://app-tracking.sebastian-software.com",
    deploymentTarget: "sebastian-websites-app-tracking-en",
    locale: "en",
    productionActive: true,
    site: APP_TRACKING_SITE,
  },
  "consulting-de": {
    canonicalOrigin: "https://sebastian-consulting.de",
    deploymentTarget: "sebastian-websites-consulting-de",
    locale: "de",
    productionActive: true,
    site: "consulting",
  },
  "consulting-en": {
    canonicalOrigin: "https://sebastian-consulting.com",
    deploymentTarget: "sebastian-websites-consulting-en",
    locale: "en",
    productionActive: true,
    site: "consulting",
  },
  "opensource-de": {
    canonicalOrigin: "https://oss.sebastian-software.de",
    deploymentTarget: "sebastian-websites-opensource-de",
    locale: "de",
    productionActive: true,
    site: "opensource",
  },
  "opensource-en": {
    canonicalOrigin: "https://oss.sebastian-software.com",
    deploymentTarget: "sebastian-websites-opensource-en",
    locale: "en",
    productionActive: true,
    site: "opensource",
  },
  "skills-de": {
    canonicalOrigin: "https://skills.sebastian-software.de",
    deploymentTarget: "sebastian-websites-skills-de",
    locale: "de",
    productionActive: false,
    site: "skills",
  },
  "skills-en": {
    canonicalOrigin: "https://skills.sebastian-software.com",
    deploymentTarget: "sebastian-websites-skills-en",
    locale: "en",
    productionActive: false,
    site: "skills",
  },
  "software-de": {
    canonicalOrigin: "https://sebastian-software.de",
    deploymentTarget: "sebastian-websites-software-de",
    locale: "de",
    productionActive: true,
    site: "software",
  },
  "software-en": {
    canonicalOrigin: "https://sebastian-software.com",
    deploymentTarget: "sebastian-websites-software-en",
    locale: "en",
    productionActive: true,
    site: "software",
  },
} as const)

export type VariantId = keyof typeof VARIANTS
export type Variant = (typeof VARIANTS)[VariantId]

export function isVariantId(value: unknown): value is VariantId {
  return typeof value === "string" && Object.hasOwn(VARIANTS, value)
}

export function getVariant(value: unknown): Variant {
  if (!isVariantId(value)) {
    throw new Error(
      `Unknown variant ${JSON.stringify(value)}. Expected one of: ${Object.keys(VARIANTS).join(", ")}.`
    )
  }
  return VARIANTS[value]
}

export function getSiteVariant(site: SiteId, locale: Locale): Variant {
  return getVariant(`${site}-${locale}`)
}

export function getSiteOrigin(site: SiteId, locale: Locale): string {
  return getSiteVariant(site, locale).canonicalOrigin
}
