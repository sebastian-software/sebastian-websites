import { describe, expect, it } from "vitest"

import { canonicalPath, createRobots, createSeoLinks, createSitemap } from "./seo.ts"

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
