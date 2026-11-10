import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactNode } from "react"

import { pageMeta } from "@sebastian-websites/site/meta"

import { WernerProfile } from "~/components/werner-profile/WernerProfile"
import { getConsultant, skills } from "~/data/werner.data"
import { activeLocale } from "~/lib/i18n"
import { createSeoMetadata } from "~/lib/meta"
import { PROFILE_PHOTOS } from "~/lib/photos"
import { variant } from "~/lib/site"
import {
  ADDRESS,
  COMPANY_BRAND,
  META,
  META_DESCRIPTIONS,
  PAGE_TITLES,
  SCHEMA,
  TEAM,
} from "~/lib/untranslated"

// =============================================================================
// Meta
// =============================================================================

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const title = PAGE_TITLES.werner
  const description = META_DESCRIPTIONS.werner

  return pageMeta(
    variant,
    "/werner",
    createSeoMetadata({
      additional: [
        { content: TEAM.werner.firstName, property: META.profileFirstName },
        { content: TEAM.werner.lastName, property: META.profileLastName },
      ],
      description,
      openGraphType: "profile",
      siteName: COMPANY_BRAND,
      title,
    })
  )
}

// =============================================================================
// Component
// =============================================================================

export default function ProfileWerner(): ReactNode {
  const consultant = getConsultant()

  // JSON-LD Person structured data
  const personSchema = {
    "@context": SCHEMA.context,
    "@type": SCHEMA.types.person,
    address: {
      "@type": SCHEMA.types.postalAddress,
      addressCountry: ADDRESS.country,
      addressLocality: ADDRESS.locality,
    },
    email: consultant.email,
    familyName: TEAM.werner.lastName,
    givenName: TEAM.werner.firstName,
    jobTitle: consultant.title,
    knowsAbout: [
      ...skills.frontend,
      ...skills.backend,
      ...skills.specialization,
      ...(skills.additional ?? []),
    ],
    knowsLanguage: consultant.languages,
    name: TEAM.werner.name,
    telephone: consultant.phone,
    url: `${variant.canonicalOrigin}/werner`,
    worksFor: {
      "@type": SCHEMA.types.organization,
      name: COMPANY_BRAND,
      url: variant.canonicalOrigin,
    },
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <WernerProfile
        consultant={{ ...consultant, photo: PROFILE_PHOTOS.werner.sheet }}
        lang={activeLocale}
      />
    </>
  )
}
