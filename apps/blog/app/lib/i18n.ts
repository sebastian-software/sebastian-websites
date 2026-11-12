import { createCatalogI18n, initializeClientI18n } from "@sebastian-websites/site/i18n"
import { messages } from "virtual:site-catalog"

import { variant } from "./site.ts"

export { getI18n } from "@palamedes/runtime"

/**
 * The domain's complete catalog, shared by prerendering and hydration.
 * @returns The locale-bound translation instance.
 */
export function createSiteI18n(): ReturnType<typeof createCatalogI18n> {
  return createCatalogI18n(variant.locale, messages)
}

initializeClientI18n(createSiteI18n)
