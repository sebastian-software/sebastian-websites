import {
  BUSINESS_PHOTOGRAPHER,
  defineLegalSiteConfig,
  type LegalSiteConfig,
  siteOperator,
} from "@sebastian-websites/legal"

import { variant } from "~/lib/site"

// The Software site has no dedicated privacy mailbox yet; both addresses use the
// general one until the legal review settles them.
export const CONTACT_EMAIL = "info@sebastian-software.de"

export const legalConfig: LegalSiteConfig = defineLegalSiteConfig({
  imprintReview: {
    contentSource: "sebastian-consulting.de imprint, adapted for Sebastian Software",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "approved",
  },
  locale: variant.locale,
  operator: siteOperator({ brand: "Sebastian Software", email: CONTACT_EMAIL }),
  photographer: BUSINESS_PHOTOGRAPHER,
  privacyActivities: ["hosting:bunny", "analytics:rybbit", "contact:email"],
  privacyEmail: CONTACT_EMAIL,
  privacyReview: {
    contentSource:
      "Existing website notice plus app-tracking reporting contracts and provider disclosures; verify processor agreements and activation settings before real reporting",
    contentVerifiedOn: "2026-10-27",
    legalReviewStatus: "review-required-before-production",
    versionOn: "2026-10-27",
  },
})
