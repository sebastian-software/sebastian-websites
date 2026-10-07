import type { ReactNode } from "react"

import { PROFILE_PDFS } from "~/lib/untranslated"
import { cn } from "~/lib/utilities"

import type { ProfilePrintV2Properties } from "./profile-print/types"

import { AdditionalProjects } from "./profile-print/AdditionalProjects"
import { CompanyContact } from "./profile-print/CompanyContact"
import { groupProjectsByTier } from "./profile-print/helpers"
import { IndustryExperience } from "./profile-print/IndustryExperience"
import { IntroSection } from "./profile-print/IntroSection"
import { PersonalDetails } from "./profile-print/PersonalDetails"
import { SkillTags } from "./profile-print/SkillTags"
import { Tier1Projects } from "./profile-print/Tier1Projects"
import { getOtherProfile } from "./profile-screen/otherProfile"
import { ProfileMobileBar } from "./profile-screen/ProfileMobileBar"
import { ProfileOutro } from "./profile-screen/ProfileOutro"
import { ProfileRail } from "./profile-screen/ProfileRail"
import * as screen from "./profile-screen/profileScreen.css"
import * as styles from "./ProfilePrintV2.css"

export type { Consultant, ProfilePrintV2Properties, Project, Skills } from "./profile-print/types"

export function ProfilePrintV2({
  consultant,
  lang = "de",
  projectProfile,
  projects,
  skills,
}: ProfilePrintV2Properties): ReactNode {
  const { additionalProjects, tier1Projects } = groupProjectsByTier(projects)
  const hasAdditionalProjects = additionalProjects.length > 0
  const pdfByLocale = consultant.id in PROFILE_PDFS ? PROFILE_PDFS[consultant.id] : undefined
  const pdf = pdfByLocale?.[lang]
  const other = getOtherProfile(consultant.id)

  return (
    <div className={cn(styles.printBody, lang === "de" ? styles.langDe : styles.langEn)}>
      <div className={screen.layoutShell}>
        {/* The printable A4 sheet — single source for the PDF/print output.
            The rail follows in the DOM so the profile is read before the actions. */}
        <article aria-label={consultant.name} className={styles.document}>
          <div className={cn(styles.page, styles.pageFirst)}>
            <IntroSection consultant={consultant} />
            <SkillTags competencyFocus={consultant.competencyFocus} skills={skills} />
            <PersonalDetails consultant={consultant} lang={lang} />
            <IndustryExperience consultant={consultant} />
            {/* "Mein Stack" section hidden on request. To restore: re-import SkillStack
                from "./profile-print/SkillStack" and render <SkillStack skills={skills} /> here. */}
          </div>
          <div className={styles.pageFlow}>
            <Tier1Projects projects={tier1Projects} />
            {hasAdditionalProjects ? (
              <AdditionalProjects
                additionalProjects={additionalProjects}
                lang={lang}
                tier1Projects={tier1Projects}
              />
            ) : null}
            <CompanyContact lang={lang} />
          </div>
        </article>
        <ProfileRail
          bookingUrl={consultant.bookingUrl}
          consultant={consultant.id}
          lang={lang}
          other={other}
          pdf={pdf}
          projectProfile={projectProfile}
        />
      </div>
      {consultant.bookingUrl === undefined ? null : (
        <>
          <ProfileOutro
            bookingUrl={consultant.bookingUrl}
            consultant={consultant.id}
            other={other}
          />
          <ProfileMobileBar bookingUrl={consultant.bookingUrl} consultant={consultant.id} />
        </>
      )}
    </div>
  )
}
