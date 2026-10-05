import { describe, expect, it } from "vitest"

import { getBrandBar, getLanguageLinks } from "./brandBar.ts"
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

describe("brand bar", () => {
  it("shows two groups led by the two brands", () => {
    const groups = getBrandBar("skills", "en")
    expect(groups.map((group) => group.brand)).toStrictEqual(["software", "consulting"])
    expect(groups.map((group) => group.links.map((link) => link.id))).toStrictEqual([
      ["software", "opensource", "skills"],
      ["consulting", "services", "profiles"],
    ])
  })

  it("marks the current site and keeps the language", () => {
    const links = getBrandBar("opensource", "de").flatMap((group) => group.links)
    expect(links.filter((link) => link.current).map((link) => link.id)).toStrictEqual([
      "opensource",
    ])
    expect(links.every((link) => new URL(link.href).hostname.endsWith(".de"))).toBe(true)
    expect(links.find((link) => link.id === "profiles")?.href).toBe(
      "https://sebastian-consulting.de/profiles"
    )
  })
})

describe("language links", () => {
  it("keeps the path and swaps only the domain", () => {
    expect(getLanguageLinks("software", "de", "/company")).toStrictEqual([
      {
        current: true,
        href: "https://sebastian-software.de/company",
        label: "Deutsch",
        locale: "de",
      },
      {
        current: false,
        href: "https://sebastian-software.com/company",
        label: "English",
        locale: "en",
      },
    ])
  })
})
