import { t } from "@palamedes/core/macro"

import { FOUNDER_NAMES, type FounderId } from "./founderNames.ts"

export type Founder = {
  /** The founder's key, the same as the blog author key and the Consulting profile path. */
  readonly id: FounderId
  readonly name: string
  readonly role: string
  /** One line on their work. */
  readonly text: string
}

/**
 * The two founders in the page's language: the one source of their roles and
 * bios for the company page and the blog's author line. Call it while
 * rendering, so the active locale decides the copy.
 *
 * @returns Both founders, in the order the company page shows them.
 */
export function getFounders(): readonly Founder[] {
  return [
    {
      id: "werner",
      name: FOUNDER_NAMES.werner,
      role: t`Founder · Frontend architecture and developer experience`,
      text: t`React, TypeScript, internationalization, and code quality. In web development since 2000, formerly architect of the qooxdoo framework at 1&1.`,
    },
    {
      id: "fastner",
      name: FOUNDER_NAMES.fastner,
      role: t`Founder · Full stack and platform`,
      text: t`TypeScript, React, Rust, and infrastructure, from the surface to the backend. In professional software development since 2002.`,
    },
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
