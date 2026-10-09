import type { ReactNode } from "react"

import { PROFILE_PDFS } from "~/lib/untranslated"
import { cn } from "~/lib/utilities"

import type { ConsultantProfileProperties } from "./profile-print/types"

import { CompanyContact } from "./profile-print/CompanyContact"
import { EarlierExperience } from "./profile-print/EarlierExperience"
import { groupProjectsByTier } from "./profile-print/helpers"
import * as styles from "./profile-print/print.css"
import { ProjectReports } from "./profile-print/ProjectReports"
import { RunningHeads } from "./profile-print/RunningHeads"
import { SummaryPage } from "./profile-print/SummaryPage"
import { getOtherProfile } from "./profile-screen/otherProfile"
import { ProfileMobileBar } from "./profile-screen/ProfileMobileBar"
import { ProfileOutro } from "./profile-screen/ProfileOutro"
import { ProfileRail } from "./profile-screen/ProfileRail"
import * as stage from "./profile-screen/stage.css"

/**
 * The consultant profile: one A4 document that the browser previews and the
 * PDF pipeline prints. Website controls stay outside the article.
 *
 * @param props - Consultant record, its projects, language and related documents.
 * @returns The printable profile with the screen-only rail and closing actions.
 */
export function ConsultantProfile(props: ConsultantProfileProperties): ReactNode {
  const { consultant, lang = "de", projectProfile, projects } = props
  const { additionalProjects, tier1Projects } = groupProjectsByTier(projects)
  const pdfByLocale = consultant.id in PROFILE_PDFS ? PROFILE_PDFS[consultant.id] : undefined
  const pdf = pdfByLocale?.[lang]
  const other = getOtherProfile(consultant.id)

  return (
    <div
      className={cn(stage.canvas, styles.printBody, lang === "de" ? styles.langDe : styles.langEn)}
    >
      <RunningHeads consultant={consultant} />
      <div className={stage.stage}>
        {/* The printable A4 sheet — single source for the PDF/print output.
            The rail follows in the DOM so the profile is read before the actions. */}
        <article aria-label={consultant.name} className={cn(styles.document, stage.sheet)}>
          <div className={cn(styles.page, styles.pageFirst)}>
            <SummaryPage consultant={consultant} lang={lang} />
          </div>
          <div className={styles.pageFlow}>
            <ProjectReports lang={lang} projects={tier1Projects} />
            {additionalProjects.length > 0 ? (
              <EarlierExperience projects={additionalProjects} />
            ) : null}
            <CompanyContact colophon lang={lang} />
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
