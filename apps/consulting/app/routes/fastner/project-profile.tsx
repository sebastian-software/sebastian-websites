import type { ReactNode } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { jsonLd, personIdentity } from "@sebastian-websites/web-core"

import { ProjectProfile } from "~/components/project-profile/ProjectProfile"
import { getConsultant, getProjects } from "~/data/fastner.data"
import { createFastnerProjectProfile } from "~/data/fastner.project-profile"
import { activeLocale } from "~/lib/i18n"
import { createSeoMetadata } from "~/lib/meta"
import { PROFILE_PHOTOS } from "~/lib/photos"
import { variant } from "~/lib/site"
import { ADDRESS, COMPANY_BRAND, getProfileDocument, SCHEMA, TEAM } from "~/lib/untranslated"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(
    variant,
    "/fastner/project-profile",
    createSeoMetadata({
      description: t`Concise project profile for Sebastian Fastner covering React, TypeScript, and frontend projects, including availability, skills, and project experience.`,
      openGraphType: "profile",
      siteName: COMPANY_BRAND,
      title: t`Project Profile Sebastian Fastner – React & TypeScript`,
    })
  )
}

export default function ProfileFastnerProject(): ReactNode {
  const consultant = getConsultant()
  const projectProfile = createFastnerProjectProfile(consultant, getProjects())
  const document = getProfileDocument("project_profile", consultant.id)
  const consultantProfileDocument = getProfileDocument("consultant_profile", consultant.id)
  const personSchema = {
    "@context": SCHEMA.context,
    ...personIdentity("fastner", activeLocale),
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
    telephone: consultant.phone,
  }

  return (
    <>
      <script type="application/ld+json">{jsonLd(personSchema)}</script>
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
