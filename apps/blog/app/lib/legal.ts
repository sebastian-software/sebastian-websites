import {
  BUSINESS_PHOTOGRAPHER,
  defineLegalSiteConfig,
  type LegalSiteConfig,
  siteOperator,
} from "@sebastian-websites/legal"

import { variant } from "~/lib/site"

// The tech blog is an area of Sebastian Software and shares its general mailbox
// until the legal review settles a dedicated privacy address.
export const CONTACT_EMAIL = "info@sebastian-software.de"

export const legalConfig: LegalSiteConfig = defineLegalSiteConfig({
  imprintReview: {
    contentSource: "sebastian-consulting.de imprint, adapted for Sebastian Software",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "approved",
  },
  locale: variant.locale,
  operator: siteOperator({ brand: "Sebastian Software", email: CONTACT_EMAIL }),
  // The social preview shows the founders' photograph.
  photographer: BUSINESS_PHOTOGRAPHER,
  privacyActivities: ["hosting:bunny", "contact:email"],
  privacyEmail: CONTACT_EMAIL,
  privacyReview: {
    contentSource:
      "Open Source notice of 2026-10-07, checked against the blog on 2026-11-12: Bunny hosting with EU-only routing and no cookies; email contact; no analytics script or newsletter service. Retains the reviewed formal German wording.",
    contentVerifiedOn: "2026-11-12",
    legalReviewStatus: "approved",
    versionOn: "2026-11-12",
  },
})
