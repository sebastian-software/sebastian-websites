import type { ReactNode } from "react"

import { ConsultantProfile } from "~/components/ConsultantProfile"
import { getConsultant, getProjects, skills } from "~/data/fastner.data"
import { activeLocale } from "~/lib/i18n"
import { createSeoMetadata } from "~/lib/meta"
import { PROFILE_PHOTOS } from "~/lib/photos"
import { variant } from "~/lib/site"
import {
  ADDRESS,
  COMPANY_BRAND,
  EXTERNAL_URLS,
  getProfileDocument,
  META,
  META_DESCRIPTIONS,
  PAGE_TITLES,
  SCHEMA,
  TEAM,
  unlocalized,
} from "~/lib/untranslated"

import type { Route } from "./+types/profile.fastner"

// =============================================================================
// Meta
// =============================================================================

// eslint-disable-next-line react-refresh/only-export-components -- React Router requires co-exporting links with the route component
export const links: Route.LinksFunction = () => [
  { href: EXTERNAL_URLS.mastodonFastner, rel: unlocalized("me") },
]

// eslint-disable-next-line react-refresh/only-export-components -- React Router requires co-exporting meta with the route component
export function meta(): Route.MetaDescriptors {
  const title = PAGE_TITLES.fastner
  const description = META_DESCRIPTIONS.fastner

  return createSeoMetadata({
    additional: [
      { content: TEAM.fastner.firstName, property: META.profileFirstName },
      { content: TEAM.fastner.lastName, property: META.profileLastName },
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

export default function ProfileFastner(): ReactNode {
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
    familyName: TEAM.fastner.lastName,
    givenName: TEAM.fastner.firstName,
    jobTitle: consultant.title,
    knowsAbout: [
      ...skills.frontend,
      ...skills.backend,
      ...skills.specialization,
      ...(skills.additional ?? []),
    ],
    knowsLanguage: consultant.languages,
    name: TEAM.fastner.name,
    telephone: consultant.phone,
    url: `${variant.canonicalOrigin}/fastner`,
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
        consultant={{ ...consultant, photo: PROFILE_PHOTOS.fastner.sheet }}
        lang={activeLocale}
        projectProfile={getProfileDocument("project_profile", consultant.id)}
        projects={projects}
      />
    </>
  )
}
