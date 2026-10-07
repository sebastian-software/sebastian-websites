import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"
import { Link } from "react-router"

import { ButtonLink } from "~/components/profile-screen/ButtonLink"
import { trackBookingClick } from "~/lib/analytics"
import { REL_EXTERNAL, unlocalized } from "~/lib/untranslated"

import type { OtherProfile } from "./otherProfile"

import { PROFILE_OUTRO_ID } from "./profileAnchors"
import * as styles from "./profileScreen.css"

// Screen-only closing section: after the full document, the reader gets a
// designed ending — a booking invitation instead of register-court data.
export function ProfileOutro({
  bookingUrl,
  consultant,
  other,
}: {
  bookingUrl: string
  consultant: string
  other: OtherProfile
}): ReactNode {
  return (
    <section className={styles.outro} id={PROFILE_OUTRO_ID}>
      <h2 className={styles.outroHeading}>
        <Trans>Does the profile fit?</Trans>
      </h2>
      <p className={styles.outroText}>
        <Trans>
          Let's get to know each other — 15 minutes, no obligation, straight into the calendar.
        </Trans>
      </p>
      <ButtonLink
        href={bookingUrl}
        onClick={() => {
          trackBookingClick("profile_outro", consultant)
        }}
        rel={REL_EXTERNAL}
        size="lg"
        target={unlocalized("_blank")}
      >
        <Trans>Book a call</Trans>
      </ButtonLink>
      <p className={styles.outroSecondary}>
        <Trans>Or meet the second consultant:</Trans>{" "}
        <Link className={styles.outroOtherLink} to={`/${other.slug}`}>
          {other.name}
        </Link>
      </p>
    </section>
  )
}
