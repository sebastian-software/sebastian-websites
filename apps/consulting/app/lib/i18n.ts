import type { Locale } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

export { getI18n } from "@palamedes/runtime"

/** The language of this build; profile documents format dates and lists with it. */
export const activeLocale: Locale = variant.locale

export type { Locale } from "@sebastian-websites/web-core"
