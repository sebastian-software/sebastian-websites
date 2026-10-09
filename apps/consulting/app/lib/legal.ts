import {
  BUSINESS_PHOTOGRAPHER,
  defineLegalSiteConfig,
  type LegalSiteConfig,
  siteOperator,
} from "@sebastian-websites/legal"
import { contactEmail } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

/**
 * One Consulting mailbox for contact and privacy requests, on the variant's
 * domain; it reaches both company accounts.
 */
const CONTACT_EMAIL = contactEmail("consulting", variant.locale)

export const legalConfig: LegalSiteConfig = defineLegalSiteConfig({
  imprintReview: {
    contentSource: "sebastian-consulting.de imprint",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "approved",
  },
  locale: variant.locale,
  operator: siteOperator({ brand: "Sebastian Consulting", email: CONTACT_EMAIL }),
  photographer: BUSINESS_PHOTOGRAPHER,
  privacyActivities: ["hosting:bunny", "analytics:rybbit", "contact:email", "booking:terminaro"],
  privacyEmail: CONTACT_EMAIL,
  privacyReview: {
    contentSource: "sebastian-consulting.de privacy policy of 2026-03-09",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "approved",
    versionOn: "2026-03-09",
  },
})
