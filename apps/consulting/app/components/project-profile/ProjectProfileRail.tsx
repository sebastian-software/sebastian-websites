import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { Link } from "react-router"

import type { Locale } from "~/lib/i18n"
import type { ProfileDocumentDescriptor } from "~/lib/untranslated"

import { ButtonLink } from "~/components/profile-screen/ButtonLink"
import { trackBookingClick, trackProfilePdfDownload } from "~/lib/analytics"
import { appBuildDate } from "~/lib/buildInfo"
import { REL_EXTERNAL, unlocalized } from "~/lib/untranslated"

import * as styles from "./projectProfileRail.css"

export function ProjectProfileRail({
  bookingUrl,
  consultantId,
  document,
  lang,
}: {
  bookingUrl?: string
  consultantId: string
  document: ProfileDocumentDescriptor
  lang: Locale
}): ReactNode {
  const pdf = document.pdfs[lang]
  const standDate = new Intl.DateTimeFormat(lang, {
    month: "long",
    timeZone: unlocalized("UTC"),
    year: "numeric",
  }).format(appBuildDate)

  return (
    <aside aria-label={t`Project Profile Actions`} className={styles.rail}>
      <div className={styles.railModule}>
        <p className={styles.railHeading}>
          <Trans>Share Project Profile</Trans>
        </p>
        <p className={styles.railText}>
          <Trans>Download the concise five-page profile as a PDF.</Trans>
        </p>
        <div className={styles.railActions}>
          <ButtonLink
            download={pdf.downloadName}
            href={pdf.href}
            onClick={() => {
              trackProfilePdfDownload(consultantId, "project_profile")
            }}
            size="sm"
          >
            <Trans>Project Profile PDF</Trans>
          </ButtonLink>
          <Link className={styles.railLink} to="/fastner">
            <Trans>Full Consultant Profile</Trans>
          </Link>
        </div>
        <p className={styles.railStand}>
          <Trans>As of:</Trans> {standDate}
        </p>
      </div>

      {bookingUrl === undefined ? null : (
        <div className={styles.railModule}>
          <p className={styles.railHeading}>
            <Trans>Discuss Availability</Trans>
          </p>
          <p className={styles.railText}>
            <Trans>15 minutes, no obligation — straight into the calendar.</Trans>
          </p>
          <ButtonLink
            href={bookingUrl}
            onClick={() => {
              trackBookingClick("profile_rail", consultantId)
            }}
            rel={REL_EXTERNAL}
            size="sm"
            target={unlocalized("_blank")}
            variant="outline"
          >
            <Trans>Book a call</Trans>
          </ButtonLink>
        </div>
      )}
    </aside>
  )
}
