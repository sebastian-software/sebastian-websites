import type { Locale } from "@sebastian-websites/web-core"

/**
 * Centralized file for strings that should NOT be translated.
 * This includes: proper names, company info, technical identifiers, URLs, etc.
 *
 * By centralizing these strings here with a single eslint-disable,
 * we avoid scattering eslint-disable comments throughout the codebase.
 *
 * @param value - Deliberately untranslated value.
 * @returns The unchanged value with its original type.
 */

export function unlocalized<const TValue>(value: TValue): TValue {
  return value
}

// =============================================================================
// HTML Attributes
// =============================================================================

export const REL_EXTERNAL = "noopener noreferrer"

// =============================================================================
// Company Information
// =============================================================================

export const COMPANY_NAME = "Sebastian Software GmbH"
export const COMPANY_BRAND = "Sebastian Consulting"
export const COMPANY_ALT_NAME = "Sebastian Software"
export const COMPANY_EMAIL = "info@sebastian-software.de"
export const COMPANY_CONTACT_EMAIL = "info@sebastian-software.de"
export const COMPANY_WEBSITE = "https://www.sebastian-software.de"
export const COMPANY_WEBSITE_DISPLAY = "www.sebastian-software.de"
export const COMPANY_PHONE = "+49-6131-9729-830"
export const COMPANY_PHONE_HREF = "tel:+4961319729830"
export const COMPANY_FAX = "+49-6131-9729-831"

export const COMPANY_ADDRESS = {
  city: "Mainz",
  street: "Dalheimer Straße 12",
  zip: "55128",
}

export const COMPANY_CONTACT_CONSULTING_EMAIL: Record<string, string> = {
  de: "kontakt@sebastian-consulting.de",
  en: "contact@sebastian-consulting.com",
}

export const COMPANY_PRIVACY_EMAIL: Record<string, string> = {
  de: "datenschutz@sebastian-consulting.de",
  en: "privacy@sebastian-consulting.com",
}

export const LEGAL_CONTENT_SOURCES = {
  imprint: "consulting-imprint-existing-copy",
  privacy: "consulting-privacy-2026-03-09",
} as const

export const COMPANY_LEGAL = {
  court: "Amtsgericht Mainz HRB 45232",
  registerCourt: "Amtsgericht Mainz",
  registerNumber: "HRB 45232",
  vatId: "USt-IdNr. DE295226721",
  vatNumber: "DE295226721",
}

// =============================================================================
// Team Members
// =============================================================================

export const TEAM = {
  fastner: {
    firstName: "Sebastian",
    lastName: "Fastner",
    name: "Sebastian Fastner",
  },
  werner: {
    firstName: "Sebastian",
    lastName: "Werner",
    name: "Sebastian Werner",
  },
} as const

// =============================================================================
// Profile PDFs
// =============================================================================

/** Stored path and browser download name of one pre-generated profile PDF. */
export type ProfilePdfDescriptor = {
  readonly downloadName: string
  readonly href: string
}

export type ProfileDocumentKind = "consultant_profile" | "project_profile"

/** One public profile document and its locale-specific PDF artifacts. */
export type ProfileDocumentDescriptor = {
  readonly consultantId: string
  readonly kind: ProfileDocumentKind
  readonly pdfs: Readonly<Record<Locale, ProfilePdfDescriptor>>
  readonly route: `/${string}`
}

/**
 * Derives both names of a profile PDF from a single stem. The stored path stays
 * lowercase kebab-case like every other public asset, while the download name
 * carries the readable capitalization. The language token stays lowercase in
 * both forms because ISO 639-1 codes are conventionally written that way.
 *
 * @param member - Team member whose profile the PDF renders.
 * @param locale - Language of the generated PDF.
 * @returns Stored path and download name for that consultant and language.
 */
function createProfilePdfDescriptor(
  member: (typeof TEAM)[keyof typeof TEAM],
  locale: Locale
): ProfilePdfDescriptor {
  const stem = `CV-${member.firstName}-${member.lastName}-${locale}`
  return {
    downloadName: `${stem}.pdf`,
    href: `/pdfs/${stem.toLowerCase()}.pdf`,
  }
}

function createLocalePdfMatrix(
  createDescriptor: (locale: Locale) => ProfilePdfDescriptor
): Record<Locale, ProfilePdfDescriptor> {
  return {
    de: createDescriptor("de"),
    en: createDescriptor("en"),
  }
}

function createConsultantProfileDocument(
  consultantId: keyof typeof TEAM,
  member: (typeof TEAM)[keyof typeof TEAM]
): ProfileDocumentDescriptor {
  return {
    consultantId,
    kind: "consultant_profile",
    pdfs: createLocalePdfMatrix((locale) => createProfilePdfDescriptor(member, locale)),
    route: `/${consultantId}`,
  }
}

const PROJECT_PROFILE_PDFS: Readonly<Record<Locale, ProfilePdfDescriptor>> = {
  de: {
    downloadName: "Projektprofil-Sebastian-Fastner-React-TypeScript-de.pdf",
    href: "/pdfs/projektprofil-sebastian-fastner-react-typescript-de.pdf",
  },
  en: {
    downloadName: "Project-Profile-Sebastian-Fastner-React-TypeScript-en.pdf",
    href: "/pdfs/project-profile-sebastian-fastner-react-typescript-en.pdf",
  },
}

// Central matrix for every public profile document. Routes, generated file
// paths and browser download names must always be derived from this source.
export const PROFILE_DOCUMENTS: readonly ProfileDocumentDescriptor[] = [
  createConsultantProfileDocument("fastner", TEAM.fastner),
  createConsultantProfileDocument("werner", TEAM.werner),
  {
    consultantId: "fastner",
    kind: "project_profile",
    pdfs: PROJECT_PROFILE_PDFS,
    route: "/fastner/project-profile",
  },
]

export function getProfileDocument(
  kind: ProfileDocumentKind,
  consultantId: string
): ProfileDocumentDescriptor {
  const matches = PROFILE_DOCUMENTS.filter(
    (document) => document.kind === kind && document.consultantId === consultantId
  )
  if (matches.length !== 1) {
    throw new Error(
      `Expected one ${kind} document for ${consultantId}, found ${String(matches.length)}.`
    )
  }
  return matches[0]
}

// Pre-generated profile PDFs (scripts/generatePdfs.ts writes them to
// public/pdfs during build). Single source for both the generator script
// and the download links on the profile pages. Path and download name come
// from the same derivation so they cannot drift apart.
export const PROFILE_PDFS: Record<
  string,
  Record<string, ProfilePdfDescriptor>
> = Object.fromEntries(
  PROFILE_DOCUMENTS.filter((document) => document.kind === "consultant_profile").map((document) => [
    document.consultantId,
    document.pdfs,
  ])
)

// =============================================================================
// External URLs
// =============================================================================

export const EXTERNAL_URLS = {
  companyWebsite: "https://sebastian-software.de",
  githubFastner: "https://github.com/sebastianfastner",
  githubWerner: "https://github.com/sebastianwerner",
  linkedinFastner: "https://linkedin.com/in/sebastianfastner",
  linkedinWerner: "https://linkedin.com/in/nicetomeatyou",
  mastodonFastner: "https://mainz.social/@sf",
  ossOverview: "https://oss.sebastian-software.com",
} as const

// =============================================================================
// Booking
// =============================================================================

// Interim booking links until a shared Terminaro intro-call calendar exists
// (tracked in issue #59). The homepage primary CTA uses the shared link;
// per-consultant links live in the consultant data (`bookingUrl`).
export const BOOKING = {
  fastner: "https://terminaro.eu/book/dcca7115-3a88-47c9-8a51-b461baa94e55",
  // Shared intro-call calendar; interim = Werner's Calendly until Terminaro is set up
  shared: "https://calendly.com/swernerx/15min",
  werner: "https://calendly.com/swernerx/15min",
} as const

// =============================================================================
// Meta / SEO Technical Identifiers
// =============================================================================

export const META = {
  cardSummaryLargeImage: "summary_large_image",
  // Property names
  description: "description",
  ogDescription: "og:description",
  ogSiteName: "og:site_name",
  ogTitle: "og:title",
  ogType: "og:type",
  profileFirstName: "profile:first_name",
  profileLastName: "profile:last_name",
  twitterCard: "twitter:card",
  twitterDescription: "twitter:description",
  twitterTitle: "twitter:title",
  typeProfile: "profile",
  // Content values
  typeWebsite: "website",
} as const

// =============================================================================
// JSON-LD Schema
// =============================================================================

export const SCHEMA = {
  context: "https://schema.org",
  types: {
    organization: "Organization",
    person: "Person",
    postalAddress: "PostalAddress",
  },
} as const

// Organization schema description (German, untranslated for JSON-LD)
export const ORG_DESCRIPTION =
  "Ihr Partner für React-Entwicklung, Frontend-Architektur und technische Beratung."

// Skills/expertise for JSON-LD (technical terms, not translated)
export const EXPERTISE = [
  "React",
  "TypeScript",
  "Frontend Architecture",
  "Web Development",
  "UI/UX Design",
] as const

// Job titles for JSON-LD
export const JOB_TITLES = {
  fastner: "Senior Technology Consultant",
  werner: "Frontend-Spezialist & Architekt",
} as const

// Meta descriptions (German, for SEO - not translated)
export const META_DESCRIPTIONS = {
  fastner:
    "Senior Technology Consultant fuer Fullstack-Entwicklung, Frontend-Architektur und UI-Design.",
  werner:
    "Principal Technology Consultant fuer Frontend-Architektur, Developer Experience und Code-Qualitaet.",
} as const

// Address info for JSON-LD
export const ADDRESS = {
  country: "DE",
  locality: "Mainz",
} as const

// Page title helpers
export const PAGE_TITLES = {
  fastner: `${TEAM.fastner.name} – ${COMPANY_BRAND}`,
  werner: `${TEAM.werner.name} – ${COMPANY_BRAND}`,
} as const
