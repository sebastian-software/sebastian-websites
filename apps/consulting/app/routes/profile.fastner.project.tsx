import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"

import { ProjectProfile } from "~/components/project-profile/ProjectProfile"
import { getConsultant, getProjects } from "~/data/fastner.data"
import { createFastnerProjectProfile } from "~/data/fastner.project-profile"
import { activeLocale } from "~/lib/i18n"
import { createSeoMetadata } from "~/lib/meta"
import { PROFILE_PHOTOS } from "~/lib/photos"
import { variant } from "~/lib/site"
import {
  ADDRESS,
  COMPANY_BRAND,
  COMPANY_NAME,
  getProfileDocument,
  SCHEMA,
  TEAM,
} from "~/lib/untranslated"

import type { Route } from "./+types/profile.fastner.project"

// eslint-disable-next-line react-refresh/only-export-components -- React Router requires co-exporting meta with the route component
export function meta(): Route.MetaDescriptors {
  return createSeoMetadata({
    description: t`Concise project profile for Sebastian Fastner covering React, TypeScript, and frontend projects, including availability, skills, and project experience.`,
    openGraphType: "profile",
    siteName: COMPANY_BRAND,
    title: t`Project Profile Sebastian Fastner – React & TypeScript`,
  })
}

export default function ProfileFastnerProject(): ReactNode {
  const consultant = getConsultant()
  const projectProfile = createFastnerProjectProfile(consultant, getProjects())
  const document = getProfileDocument("project_profile", consultant.id)
  const consultantProfileDocument = getProfileDocument("consultant_profile", consultant.id)
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
    jobTitle: projectProfile.role,
    knowsAbout: projectProfile.focusSkills,
    knowsLanguage: consultant.languages,
    name: TEAM.fastner.name,
    telephone: consultant.phone,
    url: `${variant.canonicalOrigin}${document.route}`,
    worksFor: {
      "@type": SCHEMA.types.organization,
      name: COMPANY_NAME,
      url: variant.canonicalOrigin,
    },
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <ProjectProfile
        consultantProfileUrl={`${variant.canonicalOrigin}${consultantProfileDocument.route}`}
        data={projectProfile}
        document={document}
        headshot={PROFILE_PHOTOS.fastner.sheet}
        lang={activeLocale}
      />
    </>
  )
}
