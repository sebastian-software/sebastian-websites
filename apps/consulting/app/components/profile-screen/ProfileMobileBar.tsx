import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"
import { useEffect, useState } from "react"
import { Link } from "react-router"

import { ButtonLink } from "~/components/profile-screen/ButtonLink"
import { trackBookingClick } from "~/lib/analytics"
import { REL_EXTERNAL, unlocalized } from "~/lib/untranslated"
import { cn } from "~/lib/utilities"

import { PROFILE_OUTRO_ID } from "./profileAnchors"
import * as styles from "./profileMobileBar.css"

// Pixels scrolled before the bar appears — roughly once the intro section
// (photo, name, first bio lines) has passed and the reading journey begins.
const SCROLL_THRESHOLD = 360

// Profile twin of the home MobileBookingBar: keeps the one conversion in the
// thumb zone on narrow screens (where the header booking CTA is hidden) and
// steps aside while the closing CTA section is on screen.
export function ProfileMobileBar({
  bookingUrl,
  consultant,
}: {
  bookingUrl: string
  consultant: string
}): ReactNode {
  const [scrolled, setScrolled] = useState(false)
  const [outroInView, setOutroInView] = useState(false)

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(globalThis.scrollY > SCROLL_THRESHOLD)
    }
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state -- scroll position only exists in the browser after mount
    onScroll()
    globalThis.addEventListener("scroll", onScroll, { passive: true })

    const outro = document.querySelector(`#${PROFILE_OUTRO_ID}`)
    let observer: IntersectionObserver | undefined
    if (outro !== null) {
      observer = new IntersectionObserver(([entry]) => {
        setOutroInView(entry.isIntersecting)
      })
      observer.observe(outro)
    }

    return () => {
      globalThis.removeEventListener("scroll", onScroll)
      observer?.disconnect()
    }
  }, [])

  const show = scrolled && !outroInView

  return (
    <div className={cn(styles.mobileBar, show && styles.mobileBarVisible)} inert={!show}>
      <Link className={styles.mobileBarLink} to="/">
        <Trans>Home</Trans>
      </Link>
      <ButtonLink
        href={bookingUrl}
        onClick={() => {
          trackBookingClick("profile_mobile_bar", consultant)
        }}
        rel={REL_EXTERNAL}
        target={unlocalized("_blank")}
      >
        <Trans>Book a call</Trans>
      </ButtonLink>
    </div>
  )
}
