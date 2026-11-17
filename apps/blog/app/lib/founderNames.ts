import { PEOPLE } from "@sebastian-websites/web-core"

/**
 * The founders' names by their blog author key. Names are not translated, so
 * this module stays free of Palamedes macros: `ardo.config.ts` hands the same
 * names to Ardo's publication authors, whose feeds use nothing else.
 */
export const FOUNDER_NAMES = {
  fastner: PEOPLE.fastner.name,
  werner: PEOPLE.werner.name,
} as const

/** The author key of a founder, as posts name them in their frontmatter. */
export type FounderId = keyof typeof FOUNDER_NAMES
