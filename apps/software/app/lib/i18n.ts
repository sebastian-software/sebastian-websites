import { createI18n } from "@palamedes/core"
import { setClientI18n } from "@palamedes/runtime"
import { messages } from "virtual:software-catalog"

import { variant } from "./site.ts"

export { getI18n } from "@palamedes/runtime"

/**
 * One complete catalog per build variant, shared by app and precompiled packages.
 * @returns A locale-bound translation instance.
 */
export function createSiteI18n(): ReturnType<typeof createI18n> {
  const i18n = createI18n({ locale: variant.locale, timeZone: "Europe/Berlin" })
  i18n.load(variant.locale, messages)
  return i18n
}

if (!import.meta.env.SSR) setClientI18n(createSiteI18n())
