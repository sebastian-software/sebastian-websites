import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { BunnyImage } from "@sebastian-websites/ui"
import { Link } from "react-router"

import type { Locale } from "~/lib/i18n"
import type { ProfileDocumentDescriptor, ProfilePdfDescriptor } from "~/lib/untranslated"

import { ButtonLink } from "~/components/profile-screen/ButtonLink"
import { trackBookingClick, trackProfilePdfDownload, trackProfilePrint } from "~/lib/analytics"
import { appBuildDate } from "~/lib/buildInfo"
import { REL_EXTERNAL, unlocalized } from "~/lib/untranslated"

import type { OtherProfile } from "./otherProfile"

import * as styles from "./profileScreen.css"

function printProfile(consultant: string): void {
  trackProfilePrint(consultant)
  globalThis.print()
}

// Print/PDF hand-off module of the rail. Owns the "as of" date, which is only
// relevant to this block. The browser performs the download natively from the
// anchor, so every trigger path — click, keyboard, middle-click, "save target
// as", and the state before hydration — uses the same file name.
function PdfActions({
  consultant,
  lang,
  pdf,
}: {
  consultant: string
  lang: Locale
  pdf?: ProfilePdfDescriptor
}): ReactNode {
  const standDate = new Intl.DateTimeFormat(lang, {
    month: "long",
    timeZone: unlocalized("UTC"),
    year: "numeric",
  }).format(appBuildDate)

  return (
    <div className={styles.railModule}>
      <p className={styles.railHeading}>
        <Trans>Printable profile</Trans>
      </p>
      <p className={styles.railText}>
        <Trans>Save or share this profile as a PDF.</Trans>
      </p>
      <div className={styles.railPdfActions}>
        {pdf === undefined ? null : (
          <ButtonLink
            download={pdf.downloadName}
            href={pdf.href}
            onClick={() => {
              trackProfilePdfDownload(consultant, "consultant_profile")
            }}
            size="sm"
            variant="outline"
          >
            <Trans>Download PDF</Trans>
          </ButtonLink>
        )}
        <button
          className={styles.railPrintLink}
          onClick={() => {
            printProfile(consultant)
          }}
          type="button"
        >
          <Trans>Or print directly</Trans>
        </button>
      </div>
      <p className={styles.railPdfStand}>
        <Trans>As of:</Trans> {standDate}
      </p>
    </div>
  )
}

// Sticky screen-only companion to the printable sheet: booking, PDF hand-off,
// the other consultant and the way back home. Rendered after the sheet in the
// DOM so keyboard and screen-reader users meet the profile before the actions.
export function ProfileRail({
  bookingUrl,
  consultant,
  lang,
  other,
  pdf,
  projectProfile,
}: {
  bookingUrl?: string
  consultant: string
  lang: Locale
  other: OtherProfile
  pdf?: ProfilePdfDescriptor
  projectProfile?: ProfileDocumentDescriptor
}): ReactNode {
  return (
    <aside aria-label={t`Profile actions`} className={styles.rail}>
      {bookingUrl === undefined ? null : (
        <div className={styles.railBooking}>
          <p className={styles.railHeading}>
            <Trans>Intro call</Trans>
          </p>
          <p className={styles.railText}>
            <Trans>15 minutes, no obligation — straight into the calendar.</Trans>
          </p>
          <ButtonLink
            className={styles.railBookingButton}
            href={bookingUrl}
            onClick={() => {
              trackBookingClick("profile_rail", consultant)
            }}
            rel={REL_EXTERNAL}
            target={unlocalized("_blank")}
          >
            <Trans>Book a call</Trans>
          </ButtonLink>
        </div>
      )}

      <PdfActions consultant={consultant} lang={lang} pdf={pdf} />

      {projectProfile === undefined ? null : (
        <div className={styles.railModule}>
          <p className={styles.railHeading}>
            <Trans>For Recruiters</Trans>
          </p>
          <p className={styles.railText}>
            <Trans>Five pages covering role, availability, skills, and project experience.</Trans>
          </p>
          <Link className={styles.railHomeLink} to={projectProfile.route}>
            <Trans>Concise Project Profile</Trans>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      <div className={styles.railModule}>
        <p className={styles.railHeading}>
          <Trans>The second consultant</Trans>
        </p>
        <Link className={styles.railOtherLink} to={`/${other.slug}`}>
          <BunnyImage
            alt=""
            className={styles.railOtherPhoto}
            crop={other.photo.crop}
            height={72}
            sizes="56px"
            src={other.photo.src}
            width={56}
          />
          <span className={styles.railOtherText}>
            <span className={styles.railOtherName}>{other.name}</span>
            <span className={styles.railOtherFocus}>{other.focus}</span>
          </span>
        </Link>
      </div>

      <div className={styles.railModule}>
        <Link className={styles.railHomeLink} to="/">
          <span aria-hidden>←</span>
          <Trans>Back to home</Trans>
        </Link>
      </div>
    </aside>
  )
}
