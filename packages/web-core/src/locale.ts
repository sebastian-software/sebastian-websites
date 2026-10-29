import { defineLocaleControls } from "@palamedes/core/locale"

export const LOCALES = ["de", "en"] as const
export type Locale = (typeof LOCALES)[number]

/** English is the source language and the `x-default` of every site (ADR-0006). */
export const SOURCE_LOCALE: Locale = "en"

export const LOCALE_LABELS = {
  de: "Deutsch",
  en: "English",
} as const satisfies Readonly<Record<Locale, string>>

/** Shared language and URL policy; site origins remain deployment configuration. */
export const localeControls = defineLocaleControls({
  defaultLocale: SOURCE_LOCALE,
  hosts: { defaultTld: "com", mode: "tld", tld: { com: SOURCE_LOCALE } },
  labels: LOCALE_LABELS,
  locales: LOCALES,
  protocol: "https",
})
