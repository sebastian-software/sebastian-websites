import type { BrandId } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import { useId } from "react"

import type { InvitationCopy } from "./copy.ts"

import consultingArt from "../assets/invitation-consulting.png?bunny"
import softwareArt from "../assets/invitation-software.png?bunny"
import { BunnyImage } from "../BunnyImage.tsx"
import { Arrow } from "../editorial/Arrow.tsx"
import { outboundArrow, outboundLink } from "../editorial/editorial.css.ts"
import { scaledSizes } from "../responsive.ts"
import * as styles from "./PageEnding.css.ts"

/** A small drawing per destination: a considered route for Consulting, the desk of a product company for Software. */
const ART = {
  consulting: { height: 309, src: consultingArt, width: 464 },
  software: { height: 348, src: softwareArt, width: 464 },
} as const

export type SiblingInvitationProps = {
  /** The brand the invitation leads to. */
  readonly brand: BrandId
  readonly copy: InvitationCopy
  readonly href: string
}

/**
 * The editorial invitation to the other brand: a question, one explanatory
 * sentence, and one plain outward link, beside a small drawing. It shows no
 * logo and no index of the other site.
 *
 * @param props - The destination brand, its home in the current language, and the copy.
 * @returns The invitation section.
 */
export function SiblingInvitation(props: SiblingInvitationProps): ReactElement {
  const { brand, copy, href } = props
  const id = useId()
  const art = ART[brand]
  return (
    <section
      aria-labelledby={id}
      className={`${styles.invitation} ${styles.invitationAccent[brand]}`}
    >
      <div className={styles.invitationCopy}>
        <h2 className={styles.invitationTitle} id={id}>
          {copy.heading}
        </h2>
        <p className={styles.invitationText}>{copy.text}</p>
        <p className={styles.invitationAction}>
          <a className={outboundLink} href={href}>
            {copy.action}
            <Arrow className={outboundArrow} direction="outward" />
          </a>
        </p>
      </div>
      <div className={styles.invitationArt}>
        <BunnyImage
          alt={copy.illustrationAlt}
          className={styles.invitationImage}
          height={art.height}
          sizes={`(max-width: 959px) min(420px, 100vw - 40px), ${scaledSizes(art.width)}`}
          src={art.src}
          width={art.width}
        />
      </div>
    </section>
  )
}
