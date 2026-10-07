import type { Locale } from "@sebastian-websites/web-core"

import { createI18n, type PalamedesI18n } from "@palamedes/core"
import { setClientI18n, setServerI18nGetter } from "@palamedes/runtime"
import { messages } from "virtual:active-catalog"

import { variant } from "~/lib/site"

const i18n = createI18n()
i18n.load(variant.locale, messages)
i18n.activate(variant.locale)

// One immutable instance for prerendering and hydration. A language switch is a
// full navigation to the other domain.
setClientI18n(i18n)
setServerI18nGetter(() => i18n)

export function getI18n(): PalamedesI18n {
  return i18n
}

/** The language of this build; profile documents format dates and lists with it. */
export const activeLocale: Locale = variant.locale

export type { Locale } from "@sebastian-websites/web-core"
