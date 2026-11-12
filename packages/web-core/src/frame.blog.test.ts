import { beforeEach, describe, expect, it, vi } from "vitest"

import type { BlogNavigationPhase } from "./blogLaunch.ts"
import type { getSiteFrame } from "./frame.ts"

// The committed phase stays off until the owners' first post; this suite checks
// the navigation in the phases that show the item.
describe.each<BlogNavigationPhase>(["launching", "live"])(
  "site frame with the blog navigation %s",
  (phase) => {
    let siteFrame: typeof getSiteFrame

    beforeEach(async () => {
      // The frame reads the phase once, when its module loads.
      vi.resetModules()
      vi.doMock(import("./blogLaunch.ts"), async (importOriginal) => ({
        ...(await importOriginal()),
        BLOG_NAVIGATION: phase,
      }))
      const frame = await import("./frame.ts")
      siteFrame = frame.getSiteFrame
    })

    // Same-site links stay relative; the brand's other sites link the German tech blog.
    it.each([
      ["blog", "/"],
      ["software", "https://blog.sebastian-software.de/"],
      ["opensource", "https://blog.sebastian-software.de/"],
      ["skills", "https://blog.sebastian-software.de/"],
      ["app-tracking", "https://blog.sebastian-software.de/"],
    ] as const)("adds the Blog to the navigation of %s", (site, href) => {
      const frame = siteFrame(site, "de", "/")
      expect(frame.navigation.map((link) => link.id)).toStrictEqual([
        "products",
        "opensource",
        "blog",
      ])
      expect(frame.navigation.at(-1)).toStrictEqual({
        current: site === "blog",
        href,
        id: "blog",
      })
    })

    it("marks the Blog on every page of the tech blog", () => {
      for (const path of [
        "/",
        "/posts",
        "/posts/a-post",
        { counterpart: false, path: "/posts/tags/rust" },
        "/imprint",
      ]) {
        const navigation = siteFrame("blog", "en", path).navigation
        expect(navigation.filter((link) => link.current).map((link) => link.id)).toStrictEqual([
          "blog",
        ])
      }
      expect(
        siteFrame("software", "en", "/posts").navigation.find((link) => link.id === "blog")?.current
      ).toBe(false)
    })

    it("keeps the footer index and the Consulting navigation unchanged", () => {
      expect(siteFrame("software", "en", "/").index.map((link) => link.id)).toStrictEqual([
        "products",
        "opensource",
        "company",
      ])
      const consulting = siteFrame("consulting", "en", "/")
      expect(consulting.navigation.map((link) => link.id)).toStrictEqual([
        "services",
        "profiles",
        "references",
      ])
      expect(consulting.index.some((link) => link.id === "blog")).toBe(false)
    })
  }
)
