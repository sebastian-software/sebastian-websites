/**
 * The founders' names by key, the same keys as the tech blog's post authors.
 * Names are not translated, so this module stays free of Palamedes macros.
 */
export const FOUNDER_NAMES = {
  fastner: "Sebastian Fastner",
  werner: "Sebastian Werner",
} as const

/** The key of a founder. */
export type FounderId = keyof typeof FOUNDER_NAMES
