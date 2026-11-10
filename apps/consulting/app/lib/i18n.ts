import type { Locale } from "@sebastian-websites/web-core"

import { createCatalogI18n, initializeClientI18n } from "@sebastian-websites/site/i18n"
import { messages } from "virtual:site-catalog"

import { variant } from "~/lib/site"

export { getI18n } from "@palamedes/runtime"

/** The language of this build; profile documents format dates and lists with it. */
export const activeLocale: Locale = variant.locale

/**
 * One complete locale catalog for the static render and browser hydration.
 * @returns The translation instance for this build's language.
 */
export function createSiteI18n(): ReturnType<typeof createCatalogI18n> {
  return createCatalogI18n(variant.locale, messages)
}

initializeClientI18n(createSiteI18n)

export type { Locale } from "@sebastian-websites/web-core"
