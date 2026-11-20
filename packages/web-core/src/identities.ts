import { getSiteOrigin, type Locale } from "./sites.ts"

/** One legal publisher, regardless of the language or publishing brand. */
export const ORGANIZATION_ID = "https://sebastian-software.de/#organization"
export const CONSULTING_BRAND_ID = "https://sebastian-software.de/#consulting"

/** Public personal accounts; company accounts belong to the publisher instead. */
export const PEOPLE = {
  fastner: {
    github: "https://github.com/fastner",
    linkedin: "https://linkedin.com/in/sebastianfastner",
    name: "Sebastian Fastner",
  },
  werner: {
    github: "https://github.com/swernerx",
    linkedin: "https://www.linkedin.com/in/swernerx/",
    name: "Sebastian Werner",
  },
} as const

export type PersonId = keyof typeof PEOPLE

/**
 * The durable profile in the reader's language, with a locale-independent ID.
 * @param person - The consultant key also used by blog authors.
 * @param locale - The reader's language.
 * @returns Shared identity fields for profile and article markup.
 */
export function personIdentity(
  person: PersonId,
  locale: Locale
): {
  readonly "@id": string
  readonly "@type": "Person"
  readonly name: string
  readonly sameAs: readonly string[]
  readonly url: string
  readonly worksFor: {
    readonly "@id": string
    readonly "@type": "Organization"
    readonly name: string
  }
} {
  const data = PEOPLE[person]
  return {
    "@id": `${getSiteOrigin("consulting", "de")}/${person}#person`,
    "@type": "Person",
    name: data.name,
    sameAs: [data.linkedin, data.github],
    url: `${getSiteOrigin("consulting", locale)}/${person}`,
    worksFor: { "@id": ORGANIZATION_ID, "@type": "Organization", name: "Sebastian Software GmbH" },
  }
}

/**
 * Serialize structured data safely inside an HTML script element.
 * @param value - The public structured data.
 * @returns JSON with HTML opening delimiters escaped.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c")
}
