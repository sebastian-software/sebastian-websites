import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage } from "@sebastian-websites/ui"

import type { Consultant } from "~/components/profile-print/types"
import type { Locale } from "~/lib/i18n"
import type { Portrait } from "~/lib/photos"

import { CompanyContact } from "~/components/profile-print/CompanyContact"
import * as print from "~/components/profile-print/print.css"
import { RunningHeads } from "~/components/profile-print/RunningHeads"
import * as summaryStyles from "~/components/profile-print/summary.css"
import { getOtherProfile } from "~/components/profile-screen/otherProfile"
import { ProfileMobileBar } from "~/components/profile-screen/ProfileMobileBar"
import { ProfileOutro } from "~/components/profile-screen/ProfileOutro"
import { ProfileRail } from "~/components/profile-screen/ProfileRail"
import * as stage from "~/components/profile-screen/stage.css"
import { getWernerProfileCopy } from "~/data/werner.profile"
import { SHEET_PHOTO } from "~/lib/photos"
import { getProfileDocument, PROFILE_PDFS } from "~/lib/untranslated"
import { cn } from "~/lib/utilities"

import { MarkdownContent } from "./MarkdownContent"
import * as styles from "./wernerProfile.css"

type ProfileView = "executive_summary" | "full" | "project_history"
type ProfileCopy = ReturnType<typeof getWernerProfileCopy>

function DocumentNavigation({ lang, view }: { lang: Locale; view: ProfileView }): ReactNode {
  const summary = getProfileDocument("executive_summary", "werner")
  const history = getProfileDocument("project_history", "werner")
  return (
    <nav aria-label={t`Profile sections`} className={styles.navigation}>
      <a
        href={view === "project_history" ? summary.route : "#werner-summary"}
      >{t`Executive summary`}</a>
      <a
        href={view === "executive_summary" ? history.route : "#werner-history"}
      >{t`Detailed project history`}</a>
      {view === "full" ? null : <a href="/werner">{t`Full profile`}</a>}
      <a
        download={summary.pdfs[lang].downloadName}
        href={summary.pdfs[lang].href}
      >{t`Executive summary (PDF)`}</a>
      <a
        download={history.pdfs[lang].downloadName}
        href={history.pdfs[lang].href}
      >{t`Project history (PDF)`}</a>
    </nav>
  )
}

function DocumentSections({
  copy,
  photo,
  view,
}: {
  copy: ProfileCopy
  photo?: Portrait
  view: ProfileView
}): ReactNode {
  return (
    <>
      {view === "project_history" ? null : (
        <section
          aria-label={t`Executive summary`}
          className={styles.documentSection}
          id="werner-summary"
        >
          {photo === undefined ? null : (
            <div className={styles.photoFrame}>
              <BunnyImage
                alt=""
                className={summaryStyles.portrait}
                crop={photo.crop}
                height={SHEET_PHOTO.height}
                priority
                sizes="114px"
                src={photo.src}
                width={SHEET_PHOTO.width}
                widths={[SHEET_PHOTO.width]}
              />
            </div>
          )}
          <MarkdownContent markdown={copy.executiveSummary} />
        </section>
      )}
      {view === "executive_summary" ? null : (
        <section
          aria-label={t`Detailed project history`}
          className={view === "full" ? styles.history : styles.documentSection}
          id="werner-history"
        >
          <MarkdownContent
            markdown={copy.projectHistory}
            title={view === "full" ? t`Detailed project history` : undefined}
          />
        </section>
      )}
    </>
  )
}

export function WernerProfile({
  consultant,
  lang,
  view = "full",
}: {
  consultant: Consultant
  lang: Locale
  view?: ProfileView
}): ReactNode {
  const copy = getWernerProfileCopy()
  const other = getOtherProfile(consultant.id)
  const document = view === "full" ? undefined : getProfileDocument(view, consultant.id)
  return (
    <div className={cn(stage.canvas, print.printBody, lang === "de" ? print.langDe : print.langEn)}>
      <RunningHeads consultant={consultant} />
      <div className={stage.stage}>
        <article
          aria-label={consultant.name}
          className={cn(print.document, stage.sheet)}
          data-werner-profile={view}
        >
          <div className={print.page}>
            <DocumentNavigation lang={lang} view={view} />
            <DocumentSections copy={copy} photo={consultant.photo} view={view} />
            <div className={styles.footer}>
              <CompanyContact colophon lang={lang} />
            </div>
          </div>
        </article>
        <ProfileRail
          bookingUrl={consultant.bookingUrl}
          consultant={consultant.id}
          lang={lang}
          other={other}
          pdf={document === undefined ? PROFILE_PDFS[consultant.id][lang] : document.pdfs[lang]}
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
