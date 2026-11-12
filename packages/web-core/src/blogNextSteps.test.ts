import { describe, expect, it } from "vitest"

import { isNextStep, NEXT_STEPS, type NextStep, nextStepHref } from "./blogNextSteps.ts"

const EXPECTED: Readonly<Record<NextStep, Readonly<Record<"de" | "en", string | undefined>>>> = {
  "consulting-architecture": {
    de: "https://sebastian-consulting.de/services#architecture",
    en: "https://sebastian-consulting.com/services#architecture",
  },
  "consulting-enablement": {
    de: "https://sebastian-consulting.de/services#enablement",
    en: "https://sebastian-consulting.com/services#enablement",
  },
  "consulting-internationalization": {
    de: "https://sebastian-consulting.de/services#internationalization",
    en: "https://sebastian-consulting.com/services#internationalization",
  },
  contact: { de: "/contact", en: "/contact" },
  "ferramenta-docs": { de: "https://ferramenta.dev", en: "https://ferramenta.dev" },
  none: { de: undefined, en: undefined },
  "open-source": { de: "/open-source", en: "/open-source" },
  "palamedes-docs": { de: "https://palamedes.dev", en: "https://palamedes.dev" },
  products: { de: "/products", en: "/products" },
}

describe("next steps", () => {
  it("covers every step of the closed set", () => {
    expect(Object.keys(EXPECTED).toSorted()).toStrictEqual([...NEXT_STEPS].toSorted())
  })

  it.each(NEXT_STEPS)("links %s relatively on the same site and absolutely elsewhere", (step) => {
    for (const locale of ["de", "en"] as const) {
      expect(nextStepHref(step, { locale, site: "software" })).toBe(EXPECTED[step][locale])
    }
  })

  it("keeps Software targets absolute when the tech blog renders the post", () => {
    expect(nextStepHref("products", { locale: "de", site: "blog" })).toBe(
      "https://sebastian-software.de/products"
    )
    expect(nextStepHref("contact", { locale: "en", site: "blog" })).toBe(
      "https://sebastian-software.com/contact"
    )
  })

  it("accepts only the named steps", () => {
    expect(NEXT_STEPS.every((step) => isNextStep(step))).toBe(true)
    expect([undefined, "", "newsletter", "Contact"].some((value) => isNextStep(value))).toBe(false)
  })
})
