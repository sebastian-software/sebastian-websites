import { describe, expect, it } from "vitest"

import { defineVariants, getSiteOrigin, getVariant, SITES, VARIANTS } from "./sites.ts"

describe("variants", () => {
  it("defines a German and an English variant for each of the four sites", () => {
    expect(Object.keys(VARIANTS)).toHaveLength(8)
    for (const site of SITES) {
      expect(getSiteOrigin(site, "de")).toMatch(/\.de$/v)
      expect(getSiteOrigin(site, "en")).toMatch(/\.com$/v)
    }
  })

  it("rejects unknown variants", () => {
    expect(() => getVariant("software-fr")).toThrow("Unknown variant")
  })

  it("rejects a locale on the wrong TLD", () => {
    expect(() =>
      defineVariants({
        "skills-de": {
          canonicalOrigin: "https://skills.sebastian-software.com",
          deploymentTarget: "a",
          locale: "de",
          productionActive: false,
          site: "skills",
        },
        "skills-en": {
          canonicalOrigin: "https://skills.sebastian-software.de",
          deploymentTarget: "b",
          locale: "en",
          productionActive: false,
          site: "skills",
        },
      })
    ).toThrow("expected a .de host")
  })

  it("rejects a site without both languages", () => {
    expect(() =>
      defineVariants({
        "skills-en": {
          canonicalOrigin: "https://skills.sebastian-software.com",
          deploymentTarget: "b",
          locale: "en",
          productionActive: false,
          site: "skills",
        },
      })
    ).toThrow("one German and one English variant")
  })

  it("rejects going live in one language only", () => {
    expect(() =>
      defineVariants({
        "skills-de": {
          canonicalOrigin: "https://skills.sebastian-software.de",
          deploymentTarget: "a",
          locale: "de",
          productionActive: true,
          site: "skills",
        },
        "skills-en": {
          canonicalOrigin: "https://skills.sebastian-software.com",
          deploymentTarget: "b",
          locale: "en",
          productionActive: false,
          site: "skills",
        },
      })
    ).toThrow("in both languages or in neither")
  })
})
