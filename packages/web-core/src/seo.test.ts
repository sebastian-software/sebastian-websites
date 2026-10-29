import { describe, expect, it } from "vitest"

import { canonicalPath, createRobots, createSeoLinks, createSitemap } from "./seo.ts"
import { VARIANTS } from "./sites.ts"

describe("seo", () => {
  it("normalizes paths without trailing slashes", () => {
    expect(canonicalPath("/")).toBe("/")
    expect(canonicalPath("/company/")).toBe("/company")
    expect(canonicalPath("company")).toBe("/company")
  })

  it("links canonical, both languages, and the English default", () => {
    expect(createSeoLinks("opensource", "de", "/privacy/")).toStrictEqual([
      { href: "https://oss.sebastian-software.de/privacy", rel: "canonical" },
      { href: "https://oss.sebastian-software.de/privacy", hrefLang: "de", rel: "alternate" },
      { href: "https://oss.sebastian-software.com/privacy", hrefLang: "en", rel: "alternate" },
      {
        href: "https://oss.sebastian-software.com/privacy",
        hrefLang: "x-default",
        rel: "alternate",
      },
    ])
  })

  it.each(Object.values(VARIANTS))(
    "keeps canonical hosts independent of previews for $site-$locale",
    (variant) => {
      const links = createSeoLinks(variant.site, variant.locale, "/privacy/")
      expect(links[0]).toStrictEqual({
        href: `${variant.canonicalOrigin}/privacy`,
        rel: "canonical",
      })
      expect(links).toHaveLength(4)
      for (const link of links) expect(link.href).toMatch(/^https:\/\/[^\/]+\/privacy$/v)
      expect(links.at(-1)!.href).toMatch(/\.com\/privacy$/v)
    }
  )

  it("lists only the variant's own URLs in the sitemap", () => {
    const sitemap = createSitemap("software", "de", ["/", "/company"])
    expect(sitemap).toContain("<loc>https://sebastian-software.de/</loc>")
    expect(sitemap).toContain("<loc>https://sebastian-software.de/company</loc>")
    expect(sitemap).not.toContain(".com")
  })

  it("rejects duplicate sitemap paths", () => {
    expect(() => createSitemap("software", "en", ["/a", "/a/"])).toThrow("unique")
  })

  it("points robots to the sitemap on the same origin", () => {
    expect(createRobots("skills", "en")).toContain(
      "Sitemap: https://skills.sebastian-software.com/sitemap.xml"
    )
  })
})
