import { describe, expect, it, vi } from "vitest"

import { BLOG_NAVIGATION_PHASES, type BlogNavigationPhase } from "./blogLaunch.ts"
import { BOOKING_URL, contactEmail, getLanguageLinks, getSiteFrame } from "./frame.ts"
import { getSiteVariant, LOCALES, SITES } from "./sites.ts"

// This suite checks the frame before the launch, whatever phase is committed;
// `frame.blog.test.ts` covers the launching and live phases.
vi.mock(import("./blogLaunch.ts"), async (importOriginal) => ({
  ...(await importOriginal()),
  BLOG_NAVIGATION: "off" as const,
}))

describe("site frame", () => {
  it("gives Software and its areas the Software context without a Skills entry", () => {
    for (const site of ["software", "opensource", "skills", "blog"] as const) {
      const frame = getSiteFrame(site, "en", "/")
      expect(frame.brand).toBe("software")
      expect(frame.navigation.map((link) => link.id)).toStrictEqual(["products", "opensource"])
      expect(frame.outbound).toStrictEqual({
        brand: "consulting",
        href: "https://sebastian-consulting.com/",
      })
    }
  })

  it("commits one of the known launch phases", async () => {
    const committed = await vi.importActual<{ BLOG_NAVIGATION: BlogNavigationPhase }>(
      "./blogLaunch.ts"
    )
    expect(BLOG_NAVIGATION_PHASES).toContain(committed.BLOG_NAVIGATION)
  })

  it("shows the Blog item only once the tech blog's domains are live", async () => {
    const committed = await vi.importActual<{ BLOG_NAVIGATION: BlogNavigationPhase }>(
      "./blogLaunch.ts"
    )
    const live = LOCALES.every((locale) => getSiteVariant("blog", locale).productionActive)
    // Either the item is off, or both domains resolve.
    expect([committed.BLOG_NAVIGATION === "off", live]).toContain(true)
  })

  it("leaves the blog out of every navigation while its launch phase is off", () => {
    for (const site of SITES) {
      const frame = getSiteFrame(site, "en", "/")
      expect(frame.navigation.some((link) => link.id === "blog")).toBe(false)
      expect(frame.index.some((link) => link.id === "blog")).toBe(false)
    }
  })

  it("keeps same-site links relative and resolves the other sites in the current language", () => {
    const frame = getSiteFrame("software", "de", "/company")
    expect(frame.home).toBe("/")
    expect(frame.navigation.map((link) => link.href)).toStrictEqual([
      "/products",
      "https://oss.sebastian-software.de/",
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

  it("leads Consulting to its pages, the booking calendar, and Software", () => {
    const frame = getSiteFrame("consulting", "de", "/imprint")
    expect(frame.brand).toBe("consulting")
    expect(frame.navigation.map((link) => link.href)).toStrictEqual([
      "/services",
      "/team",
      "/references",
    ])
    expect(frame.index.map((link) => link.href)).toStrictEqual([
      "/services",
      "/team",
      "/references",
      BOOKING_URL,
    ])
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

  it.each(["services", "references"])("marks the Consulting %s page in the navigation", (page) => {
    const navigation = getSiteFrame("consulting", "en", `/${page}`).navigation
    expect(navigation.filter((link) => link.current).map((link) => link.id)).toStrictEqual([page])
    expect(getSiteFrame("consulting", "de", "/").navigation.some((link) => link.current)).toBe(
      false
    )
  })

  it("prints the same mailbox in the address as the contact link", () => {
    for (const locale of ["de", "en"] as const) {
      const frame = getSiteFrame("consulting", locale, "/")
      expect(frame.legal.find((link) => link.id === "contact")?.href).toBe(`mailto:${frame.email}`)
    }
    expect(getSiteFrame("consulting", "en", "/").email).toBe("info@sebastian-consulting.com")
    expect(getSiteFrame("software", "en", "/").email).toBe("info@sebastian-software.de")
    expect(contactEmail("consulting", "de")).toBe("info@sebastian-consulting.de")
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

  it("leads a page without a counterpart to the other language's blog overview", () => {
    expect(
      getLanguageLinks("blog", "de", { counterpart: false, path: "/posts/ein-beitrag" })
    ).toStrictEqual([
      {
        current: false,
        fallback: true,
        href: "https://blog.sebastian-software.com/posts",
        label: "English",
        locale: "en",
      },
      {
        current: true,
        href: "https://blog.sebastian-software.de/posts/ein-beitrag",
        label: "Deutsch",
        locale: "de",
      },
    ])
    const frame = getSiteFrame("blog", "en", { counterpart: false, path: "/posts/tags/rust/" })
    expect(frame.languages.map((language) => language.href)).toStrictEqual([
      "https://blog.sebastian-software.com/posts/tags/rust",
      "https://blog.sebastian-software.de/posts",
    ])
  })

  it("keeps the matching page when a counterpart exists", () => {
    expect(
      getLanguageLinks("blog", "en", { counterpart: true, path: "/posts/a-post" })
    ).toStrictEqual(getLanguageLinks("blog", "en", "/posts/a-post"))
    expect(
      getSiteFrame("blog", "de", { counterpart: true, path: "/posts/a-post" }).languages.some(
        (language) => language.fallback === true
      )
    ).toBe(false)
  })

  it.each(["software", "consulting", "opensource", "skills", "app-tracking"] as const)(
    "requires a counterpart on %s, which has no blog",
    (site) => {
      expect(() => getSiteFrame(site, "en", { counterpart: false, path: "/" })).toThrow("no blog")
      expect(getSiteFrame(site, "en", "/privacy").languages).toStrictEqual(
        getLanguageLinks(site, "en", "/privacy")
      )
    }
  )

  it("follows the frame's normalized path", () => {
    const languages = getSiteFrame("consulting", "en", "/privacy/").languages
    expect(languages.map((language) => language.href)).toStrictEqual([
      "https://sebastian-consulting.com/privacy",
      "https://sebastian-consulting.de/privacy",
    ])
  })
})
