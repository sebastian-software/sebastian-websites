import { describe, expect, it } from "vitest"

import { BOOKING_URL, getLanguageLinks, getSiteFrame } from "./frame.ts"

describe("site frame", () => {
  it("gives Software, Open Source, and Skills the Software context", () => {
    for (const site of ["software", "opensource", "skills"] as const) {
      const frame = getSiteFrame(site, "en", "/")
      expect(frame.brand).toBe("software")
      expect(frame.navigation.map((link) => link.id)).toStrictEqual([
        "products",
        "opensource",
        "skills",
      ])
      expect(frame.outbound).toStrictEqual({
        brand: "consulting",
        href: "https://sebastian-consulting.com/",
      })
    }
  })

  it("keeps same-site links relative and resolves the other sites in the current language", () => {
    const frame = getSiteFrame("software", "de", "/company")
    expect(frame.home).toBe("/")
    // The Skills site is English only, so it keeps its .com address.
    expect(frame.navigation.map((link) => link.href)).toStrictEqual([
      "/products",
      "https://oss.sebastian-software.de/",
      "https://skills.sebastian-software.com/",
    ])
    expect(frame.outbound.href).toBe("https://sebastian-consulting.de/")
    expect(frame.index.find((link) => link.id === "company")).toStrictEqual({
      current: true,
      href: "/company",
      id: "company",
    })
  })

  it("marks the current area and leaves the brand home unmarked", () => {
    const openSource = getSiteFrame("opensource", "en", "/")
    expect(openSource.home).toBe("https://sebastian-software.com/")
    expect(
      openSource.navigation.filter((link) => link.current).map((link) => link.id)
    ).toStrictEqual(["opensource"])
    expect(getSiteFrame("software", "en", "/").navigation.some((link) => link.current)).toBe(false)
    expect(
      getSiteFrame("software", "en", "/products/").navigation.find((link) => link.current)?.id
    ).toBe("products")
  })

  it("leads Consulting to its sections, the booking calendar, and Software", () => {
    const frame = getSiteFrame("consulting", "de", "/imprint")
    expect(frame.brand).toBe("consulting")
    expect(frame.navigation.map((link) => link.href)).toStrictEqual(["/#services", "/team"])
    expect(frame.index.map((link) => link.href)).toStrictEqual(["/#services", "/team", BOOKING_URL])
    expect(
      getSiteFrame("consulting", "en", "/team").navigation.find((link) => link.current)?.id
    ).toBe("profiles")
    expect(frame.outbound).toStrictEqual({
      brand: "software",
      href: "https://sebastian-software.de/",
    })
    expect(frame.legal.map((link) => link.href)).toStrictEqual([
      "/imprint",
      "/privacy",
      "mailto:info@sebastian-consulting.de",
    ])
  })

  it("sends Software-context legal contact to the Software contact page", () => {
    const legal = getSiteFrame("opensource", "de", "/").legal
    expect(legal.map((link) => link.href)).toStrictEqual([
      "/imprint",
      "/privacy",
      "https://sebastian-software.de/contact",
    ])
  })
})

describe("language links", () => {
  it("keeps the path and swaps only the domain", () => {
    expect(getLanguageLinks("software", "de", "/company")).toStrictEqual([
      {
        current: false,
        href: "https://sebastian-software.com/company",
        label: "English",
        locale: "en",
      },
      {
        current: true,
        href: "https://sebastian-software.de/company",
        label: "Deutsch",
        locale: "de",
      },
    ])
  })

  it("follows the frame's normalized path", () => {
    const languages = getSiteFrame("consulting", "en", "/privacy/").languages
    expect(languages.map((language) => language.href)).toStrictEqual([
      "https://sebastian-consulting.com/privacy",
      "https://sebastian-consulting.de/privacy",
    ])
  })
})
