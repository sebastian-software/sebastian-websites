import {
  defineLegalSiteConfig,
  type LegalSiteConfig,
  siteOperator,
} from "@sebastian-websites/legal"

import { variant } from "~/lib/site"

/** The Consulting mailboxes carry the variant's language, as on the current site. */
const CONTACT_EMAIL = {
  de: "kontakt@sebastian-consulting.de",
  en: "contact@sebastian-consulting.com",
} as const

const PRIVACY_EMAIL = {
  de: "datenschutz@sebastian-consulting.de",
  en: "privacy@sebastian-consulting.com",
} as const

export const legalConfig: LegalSiteConfig = defineLegalSiteConfig({
  imprintReview: {
    contentSource: "sebastian-consulting.de imprint",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "review-required-before-production",
  },
  locale: variant.locale,
  operator: siteOperator({ brand: "Sebastian Consulting", email: CONTACT_EMAIL[variant.locale] }),
  privacyActivities: ["hosting:bunny", "analytics:rybbit", "contact:email"],
  privacyEmail: PRIVACY_EMAIL[variant.locale],
  privacyReview: {
    contentSource: "sebastian-consulting.de privacy policy of 2026-03-09",
    contentVerifiedOn: "2026-10-07",
    legalReviewStatus: "review-required-before-production",
    versionOn: "2026-03-09",
  },
})
