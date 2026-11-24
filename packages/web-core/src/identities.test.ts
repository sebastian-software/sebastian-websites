import { describe, expect, it } from "vitest"

import { jsonLd, ORGANIZATION_ID, personIdentity } from "./identities.ts"

describe("public identities", () => {
  it("keeps each person stable across languages and points to the corresponding profile", () => {
    for (const person of ["werner", "fastner"] as const) {
      const de = personIdentity(person, "de")
      const en = personIdentity(person, "en")
      expect(de["@id"]).toBe(en["@id"])
      expect(de.url).toBe(`https://sebastian-consulting.de/${person}`)
      expect(en.url).toBe(`https://sebastian-consulting.com/${person}`)
      expect(de.worksFor["@id"]).toBe(ORGANIZATION_ID)
      expect(de.sameAs).not.toContain("https://github.com/sebastian-software")
    }
    expect(personIdentity("werner", "de")["@id"]).not.toBe(personIdentity("fastner", "de")["@id"])
  })

  it("cannot close its script element and round-trips ordinary article text", () => {
    const value = {
      description: "A < B & C",
      headline: "</script><script>window.changed = true</script>",
    }
    const serialized = jsonLd(value)
    expect(serialized).not.toContain("<")
    expect(JSON.parse(serialized)).toStrictEqual(value)
  })
})
