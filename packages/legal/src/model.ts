import type { ReactNode } from "react"

export type IsoDate = `${number}-${number}-${number}`

export type LegalReviewStatus = "approved" | "review-required-before-production"

export type LegalReview = {
  readonly contentSource: string
  readonly contentVerifiedOn: IsoDate
  readonly legalReviewStatus: LegalReviewStatus
  readonly versionOn?: IsoDate
}

export type LegalAddress = {
  readonly city: string
  readonly countryCode: "DE"
  readonly postalCode: string
  readonly street: string
}

export type LegalContact = {
  readonly email: string
  readonly fax?: string
  readonly phone: string
  readonly phoneHref: `tel:${string}`
}

export type LegalOperator = {
  readonly address: LegalAddress
  readonly brand: string
  readonly contact: LegalContact
  readonly editorialResponsible: string
  readonly managingDirectors: readonly [string, ...string[]]
  readonly name: string
  readonly registerCourt: string
  readonly registerNumber: string
  readonly vatId: string
}

export type PrivacyActivity =
  "analytics:rybbit" | "booking:terminaro" | "contact:email" | "hosting:bunny"

export type LegalSiteConfig = {
  readonly imprintReview: LegalReview
  readonly locale: "de" | "en"
  readonly operator: LegalOperator
  /** Credited in the imprint when the site shows the business photos. */
  readonly photographer?: string
  readonly privacyActivities: readonly PrivacyActivity[]
  readonly privacyEmail: string
  readonly privacyReview: LegalReview
}

export type LegalClassNames = {
  readonly address: string
  readonly definitionDescription: string
  readonly definitionList: string
  readonly definitionTerm: string
  readonly link: string
  readonly list: string
  readonly page: string
  readonly pageContent: string
  readonly pageTitle: string
  readonly section: string
  readonly sectionTitle: string
  readonly subsectionTitle: string
  readonly subtitle: string
  readonly text: string
}

export type LegalDocumentProperties = {
  readonly additionalSections?: ReactNode
  readonly classes: LegalClassNames
  readonly config: LegalSiteConfig
}

const CONTACT_EMAIL_SECTION_ID = "contact-email"

const PRIVACY_BASE_SECTION_IDS = [
  "controller",
  "overview",
  CONTACT_EMAIL_SECTION_ID,
  "processors",
  "external-links",
  "automated-decision-making",
  "rights",
  "right-to-object",
  "complaint",
] as const

const ACTIVITY_SECTION_IDS: Readonly<Record<PrivacyActivity, string>> = {
  "analytics:rybbit": "analytics-rybbit",
  "booking:terminaro": "booking-terminaro",
  "contact:email": CONTACT_EMAIL_SECTION_ID,
  "hosting:bunny": "hosting-bunny",
}

export function getPrivacySectionIds(config: LegalSiteConfig): readonly string[] {
  const activitySections = config.privacyActivities
    .filter((activity) => activity !== "contact:email")
    .map((activity) => ACTIVITY_SECTION_IDS[activity])

  const insertionIndex = PRIVACY_BASE_SECTION_IDS.indexOf(CONTACT_EMAIL_SECTION_ID)
  return [
    ...PRIVACY_BASE_SECTION_IDS.slice(0, insertionIndex),
    ...activitySections,
    ...PRIVACY_BASE_SECTION_IDS.slice(insertionIndex),
  ]
}

export function getPrivacyProcessorIds(config: LegalSiteConfig): readonly string[] {
  const processors = new Set<string>()

  if (config.privacyActivities.includes("hosting:bunny")) {
    processors.add("bunny")
  }
  if (
    config.privacyActivities.includes("analytics:rybbit") ||
    config.privacyActivities.includes("booking:terminaro")
  ) {
    processors.add("hetzner")
  }

  return [...processors]
}

function validateReview(review: LegalReview, documentName: string): void {
  if (review.contentSource.trim().length === 0) {
    throw new Error(`${documentName} must declare its content source.`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/v.test(review.contentVerifiedOn)) {
    throw new Error(`${documentName} must declare an ISO content verification date.`)
  }
  if (review.versionOn !== undefined && !/^\d{4}-\d{2}-\d{2}$/v.test(review.versionOn)) {
    throw new Error(`${documentName} must declare its version as an ISO date.`)
  }
}

export function defineLegalSiteConfig(config: LegalSiteConfig): LegalSiteConfig {
  validateReview(config.imprintReview, "Imprint")
  validateReview(config.privacyReview, "Privacy policy")

  if (new Set(config.privacyActivities).size !== config.privacyActivities.length) {
    throw new Error("Privacy activities must be unique.")
  }
  if (config.operator.managingDirectors.length === 0) {
    throw new Error("At least one managing director is required.")
  }

  return config
}
