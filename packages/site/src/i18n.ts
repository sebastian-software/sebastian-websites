import { type CompiledCatalogMessages, createI18n } from "@palamedes/core"
import { setClientI18n } from "@palamedes/runtime"

export { getI18n } from "@palamedes/runtime"

/**
 * Create the active domain's translation runtime from its compiled catalog.
 * @param locale - The active domain language.
 * @param messages - The compiled active-language catalog.
 * @returns The locale-bound translation instance.
 */
export function createCatalogI18n(
  locale: string,
  messages: CompiledCatalogMessages
): ReturnType<typeof createI18n> {
  const i18n = createI18n({ locale, timeZone: "Europe/Berlin" })
  i18n.load(locale, messages)
  return i18n
}

/**
 * Initialize the browser before Ardo evaluates translated route metadata.
 * @param create - The locale-bound translation factory.
 */
export function initializeClientI18n(create: () => ReturnType<typeof createI18n>): void {
  if (!import.meta.env.SSR) setClientI18n(create())
}
