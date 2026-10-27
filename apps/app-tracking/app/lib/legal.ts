import { defineLegalSiteConfig, siteOperator } from "@sebastian-websites/legal"

import { variant } from "./site"

export const legalConfig = defineLegalSiteConfig({
  imprintReview: {
    contentSource: "Shared company imprint; unchanged operator details",
    contentVerifiedOn: "2026-10-27",
    legalReviewStatus: "approved",
  },
  locale: variant.locale,
  operator: siteOperator({ brand: "Sebastian Software", email: "info@sebastian-software.de" }),
  privacyActivities: ["hosting:bunny", "contact:email"],
  privacyEmail: "info@sebastian-software.de",
  privacyReview: {
    contentSource:
      "Implemented app-tracking website delivery and reporting overview; deployment settings need verification before canonical activation",
    contentVerifiedOn: "2026-10-27",
    legalReviewStatus: "review-required-before-production",
  },
})
