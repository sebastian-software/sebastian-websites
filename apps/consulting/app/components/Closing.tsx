import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import ridgePath from "~/assets/photography/consulting-ridge-path.png?bunny"

import * as styles from "./Closing.css.ts"

// Keeps the cairn and the end of the path in the frame.
const OVERLOOK_X = 0.62
const OVERLOOK_Y = 0.5

/**
 * The invitation to talk, beside a ridge path that leads toward an overlook:
 * guidance toward a clearer view rather than one fixed route.
 *
 * @returns The closing section.
 */
export function Closing(): ReactElement {
  return (
    <section aria-labelledby="closing-title" className={styles.closing}>
      <div className={styles.copy}>
        <h2 className={styles.title} id="closing-title">
          {t`What needs to become clearer?`}
        </h2>
        <p className={styles.text}>
          {t`Tell us where architecture, delivery, or internationalization is getting in the way.`}
        </p>
        <p className={styles.note}>
          {t`15 minutes, no strings attached: you talk directly to one of the two Sebastians.`}
        </p>
        <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
      </div>
      <div className={styles.art}>
        <BunnyImage
          alt={t`A rocky ridge path at dusk leading toward a cairn on an overlook above layered hills.`}
          className={styles.image}
          crop={{ mode: "focus", point: [OVERLOOK_X, OVERLOOK_Y] }}
          height={474}
          sizes="569px"
          src={ridgePath}
          width={569}
        />
      </div>
    </section>
  )
}
