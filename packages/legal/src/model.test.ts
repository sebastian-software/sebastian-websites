import { describe, expect, it } from "vitest"

import type { LegalSiteConfig } from "./model"

import { defineLegalSiteConfig, getPrivacyProcessorIds, getPrivacySectionIds } from "./model"

const baseConfig: LegalSiteConfig = {
  imprintReview: {
    contentSource: "Existing company imprint",
    contentVerifiedOn: "2026-07-27",
    legalReviewStatus: "review-required-before-production",
  },
  locale: "de",
  operator: {
    address: {
      city: "Mainz",
      countryCode: "DE",
      postalCode: "55128",
      street: "Dalheimer Straße 12",
    },
    brand: "Sebastian Consulting",
    contact: {
      email: "kontakt@example.de",
      phone: "+49 123",
      phoneHref: "tel:+49123",
    },
    editorialResponsible: "Sebastian Fastner",
    managingDirectors: ["Sebastian Fastner", "Sebastian Werner"],
    name: "Sebastian Software GmbH",
    registerCourt: "Amtsgericht Mainz",
    registerNumber: "HRB 45232",
    vatId: "DE295226721",
  },
  privacyActivities: ["hosting:bunny", "analytics:rybbit", "contact:email"],
  privacyEmail: "privacy@example.de",
  privacyReview: {
    contentSource: "Existing company privacy policy",
    contentVerifiedOn: "2026-07-27",
    legalReviewStatus: "review-required-before-production",
    versionOn: "2026-03-09",
  },
}

describe("legal site model", () => {
  it("makes configured processing activities explicit in the rendered section order", () => {
    expect(getPrivacySectionIds(baseConfig)).toStrictEqual([
      "controller",
      "overview",
      "hosting-bunny",
      "analytics-rybbit",
      "contact-email",
      "processors",
      "external-links",
      "automated-decision-making",
      "rights",
      "right-to-object",
      "complaint",
    ])
  })

  it("only exposes processors required by the configured activities", () => {
    expect(getPrivacyProcessorIds(baseConfig)).toStrictEqual(["bunny", "hetzner"])
    expect(
      getPrivacyProcessorIds({
        ...baseConfig,
        privacyActivities: ["contact:email"],
      })
    ).toStrictEqual([])
  })

  it("keeps domain-specific email targets visible in each locale configuration", () => {
    const englishConfig = defineLegalSiteConfig({
      ...baseConfig,
      locale: "en",
      operator: {
        ...baseConfig.operator,
        contact: {
          ...baseConfig.operator.contact,
          email: "contact@example.com",
        },
      },
      privacyEmail: "privacy@example.com",
    })

    expect(englishConfig.locale).toBe("en")
    expect(englishConfig.operator.contact.email).toBe("contact@example.com")
    expect(englishConfig.privacyEmail).toBe("privacy@example.com")
  })

  it("rejects duplicated privacy activities", () => {
    expect(() =>
      defineLegalSiteConfig({
        ...baseConfig,
        privacyActivities: ["contact:email", "contact:email"],
      })
    ).toThrow("Privacy activities must be unique.")
  })

  it("rejects review metadata without ISO dates", () => {
    expect(() =>
      defineLegalSiteConfig({
        ...baseConfig,
        privacyReview: {
          ...baseConfig.privacyReview,
          versionOn: "2026-3-9",
        },
      })
    ).toThrow("Privacy policy must declare its version as an ISO date.")
  })
})
