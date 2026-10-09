import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, ButtonLink, scaledSizes } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { PORTRAITS } from "~/lib/photos"

import * as styles from "./Founders.css.ts"

/**
 * The two founders with equal portraits, comparable framing, and aligned
 * captions, after the offer has been explained.
 *
 * @returns The founders section.
 */
export function Founders(): ReactElement {
  const founders = [
    { id: "werner", name: "Sebastian Werner", portrait: PORTRAITS.werner },
    { id: "fastner", name: "Sebastian Fastner", portrait: PORTRAITS.fastner },
  ] as const
  return (
    <section aria-labelledby="profiles-title" id="profiles">
      <h2 className={styles.title} id="profiles-title">
        {t`Two architects.`} <span className={styles.titleIndent}>{t`Direct responsibility.`}</span>
      </h2>
      <div className={styles.row}>
        <div className={styles.intro}>
          <p className={styles.values}>
            {t`Experience.`}
            <br />
            {t`Clarity.`}
            <br />
            {t`Enthusiasm.`}
          </p>
          <p className={styles.text}>
            {t`You work directly with the two architects doing the work: no bench, no juniors, no handover to third parties.`}
          </p>
          <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
        </div>
        <ul className={styles.portraits}>
          {founders.map((founder) => (
            <li key={founder.id}>
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  <BunnyImage
                    alt={founder.name}
                    className={styles.photo}
                    crop={founder.portrait.crop}
                    height={529}
                    sizes={`(max-width: 639px) calc(50vw - 28px), (max-width: 959px) calc(50vw - 48px), ${scaledSizes("370px")}`}
                    src={founder.portrait.src}
                    width={370}
                  />
                </div>
                <figcaption>
                  <p className={styles.name}>{founder.name}</p>
                  <p className={styles.role}>{t`Co-founder`}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
