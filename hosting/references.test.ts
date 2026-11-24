import assert from "node:assert/strict"
import { test } from "node:test"

import { getSiteOrigin, LOCALES } from "../packages/web-core/src/sites.ts"
import { planLegacyPath } from "./redirects.ts"

test("testimonial collections preserve language and redirect directly to published references", () => {
  for (const locale of LOCALES) {
    const origin = getSiteOrigin("software", locale)
    for (const path of ["/testimonials", "/testimonials/", "/testimonials/?campaign=legacy"]) {
      assert.deepEqual(planLegacyPath({ locale, site: "software" }, new URL(path, origin)), {
        id: "SW-TESTIMONIALS",
        kind: "moved",
        location: `${getSiteOrigin("consulting", locale)}/references`,
      })
    }
  }
})

test("preserved statements lead to their own recommendation, not another person or engagement", () => {
  for (const locale of LOCALES) {
    const origin = getSiteOrigin("software", locale)
    const serving = { locale, site: "software" } as const
    assert.deepEqual(
      planLegacyPath(
        serving,
        new URL("/testimonial/damian-osipiuk-.-sebastian-werner~cbd21c94", origin)
      ),
      {
        id: "SW-TESTIMONIAL-DETAIL",
        kind: "moved",
        location: `${getSiteOrigin("consulting", locale)}/references#recommendation-damian-osipiuk`,
      }
    )
    for (const slug of [
      "damian-osipiuk-.-sebastian-fastner~15fef647",
      "unknown",
      "matthias-dietrich-.-sebastian-werner~32ef9174",
    ]) {
      assert.deepEqual(planLegacyPath(serving, new URL(`/testimonial/${slug}`, origin)), {
        id: "SW-TESTIMONIALS",
        kind: "gone",
      })
    }
  }
})
