import type { BrandId } from "@sebastian-websites/web-core"
import type { ReactElement } from "ardo/react"

import { useId } from "ardo/react"

import type { InvitationCopy } from "./copy.ts"

import softwareArt from "../assets/invitation-software.image.mdx"
import consultingArt from "../assets/mountain-trails.image.mdx"
import { Arrow } from "../editorial/Arrow.tsx"
import { outboundArrow, outboundLink } from "../editorial/editorial.css.ts"
import { StoryIllustration } from "../editorial/StoryIllustration.tsx"
import { Illustration } from "../Illustration.tsx"
import { scaledSizes } from "../responsive.ts"
import * as styles from "./PageEnding.css.ts"

const SOFTWARE_ART_WIDTH = 464

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
      {brand === "consulting" ? (
        <div className={styles.landscapeSlot}>
          <StoryIllustration alt={copy.illustrationAlt} src={consultingArt} />
        </div>
      ) : (
        <div className={styles.invitationArt}>
          <Illustration
            alt={copy.illustrationAlt}
            className={styles.invitationImage}
            height={348}
            sizes={`(max-width: 959px) min(420px, 100vw - 40px), ${scaledSizes(SOFTWARE_ART_WIDTH)}`}
            src={softwareArt}
            width={SOFTWARE_ART_WIDTH}
          />
        </div>
      )}
    </section>
  )
}
