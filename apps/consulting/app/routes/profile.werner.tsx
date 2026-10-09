import type { ReactNode } from "react"

import { ConsultantProfile } from "~/components/ConsultantProfile"
import { getConsultant, getProjects, skills } from "~/data/werner.data"
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

import type { Route } from "./+types/profile.werner"

// =============================================================================
// Meta
// =============================================================================

// eslint-disable-next-line react-refresh/only-export-components -- React Router requires co-exporting meta with the route component
export function meta(): Route.MetaDescriptors {
  const title = PAGE_TITLES.werner
  const description = META_DESCRIPTIONS.werner

  return createSeoMetadata({
    additional: [
      { content: TEAM.werner.firstName, property: META.profileFirstName },
      { content: TEAM.werner.lastName, property: META.profileLastName },
    ],
    description,
    openGraphType: "profile",
    siteName: COMPANY_BRAND,
    title,
  })
}

// =============================================================================
// Component
// =============================================================================

export default function ProfileWerner(): ReactNode {
  const consultant = getConsultant()
  const projects = getProjects()

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
      <ConsultantProfile
        consultant={{ ...consultant, photo: PROFILE_PHOTOS.werner.sheet }}
        lang={activeLocale}
        projects={projects}
      />
    </>
  )
}
