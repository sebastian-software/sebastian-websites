import { t } from "@palamedes/core/macro"

import { FOUNDER_NAMES, type FounderId } from "./founderNames.ts"

export type Founder = {
  /** The founder's key, the same as the post author key. */
  readonly id: FounderId
  readonly name: string
  readonly role: string
}

/**
 * The two founders with their roles in the page's language, for the author
 * line of a post. The Software company page shows the same roles. Call it
 * while rendering, so the active locale decides the copy.
 *
 * @returns Both founders.
 */
export function getFounders(): readonly Founder[] {
  return [
    {
      id: "werner",
      name: FOUNDER_NAMES.werner,
      role: t`Founder · Frontend architecture and developer experience`,
    },
    { id: "fastner", name: FOUNDER_NAMES.fastner, role: t`Founder · Full stack and platform` },
  ]
}

/**
 * One founder by key, such as the `id` Ardo gives a post author.
 *
 * @param id - The author key.
 * @returns The founder, or undefined for any other key.
 */
export function getFounder(id: string | undefined): Founder | undefined {
  return getFounders().find((founder) => founder.id === id)
}
