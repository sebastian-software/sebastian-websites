import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import * as styles from "./ServiceIllustration.css.ts"

export type ServiceKind = "architecture" | "enablement" | "internationalization"

type Props = { readonly kind: ServiceKind }

/**
 * Conceptual diagrams of the work, rather than simulated client screenshots.
 *
 * @param props - The service whose relationships should be illustrated.
 * @returns A labeled diagram of application boundaries, translation flow, or knowledge transfer.
 */
export function ServiceIllustration(props: Props): ReactElement {
  const { kind } = props
  if (kind === "architecture") {
    return (
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>{t`Make the boundaries visible.`}</figcaption>
        <div className={styles.architecture}>
          <p className={styles.productInterface}>{t`Product interface`}</p>
          <div className={styles.boundaries}>
            <p className={styles.node}>{t`Components`}</p>
            <p className={styles.node}>{t`Domain logic`}</p>
            <p className={styles.node}>{t`APIs`}</p>
          </div>
          <p className={styles.foundation}>{t`Build & delivery`}</p>
        </div>
        <p
          className={styles.footnote}
        >{t`Understand the dependencies. Change one part with confidence.`}</p>
      </figure>
    )
  }
  if (kind === "internationalization") {
    return (
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>{t`One product. Many languages.`}</figcaption>
        <div className={styles.translation}>
          <div className={styles.inputs}>
            <p className={styles.node}>{t`Interface text`}</p>
            <p className={styles.node}>{t`User content`}</p>
          </div>
          <p aria-hidden="true" className={styles.connector}>
            ↓
          </p>
          <p className={styles.engine}>{t`Translation workflow`}</p>
          <p aria-hidden="true" className={styles.connector}>
            ↓
          </p>
          <ul aria-label={t`Example languages`} className={styles.languages}>
            {["EN", "DE", "FR", "ES", "KO", "TH"].map((language) => (
              <li className={styles.language} key={language}>
                {language}
              </li>
            ))}
          </ul>
        </div>
        <p
          className={styles.footnote}
        >{t`From the first string to content people share across languages.`}</p>
      </figure>
    )
  }
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>{t`Knowledge stays with the team.`}</figcaption>
      <ol className={styles.cycle}>
        {[t`Review together`, t`Implement together`, t`Share the reasoning`, t`Keep improving`].map(
          (step, index) => (
            <li className={styles.cycleStep} key={step}>
              <span aria-hidden="true" className={styles.number}>
                0{index + 1}
              </span>
              <span>{step}</span>
            </li>
          )
        )}
      </ol>
      <p
        className={styles.footnote}
      >{t`Pairing, code reviews, and decisions your team can carry forward.`}</p>
    </figure>
  )
}
