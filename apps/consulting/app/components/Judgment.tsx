import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import * as styles from "./Judgment.css.ts"

/**
 * Why judgment matters more as delivery accelerates: the page's single
 * contained accent passage.
 *
 * @returns The judgment passage.
 */
export function Judgment(): ReactElement {
  return (
    <section aria-labelledby="judgment-title" className={styles.passage}>
      <h2 className={styles.title} id="judgment-title">
        {t`More speed needs better judgment.`}
      </h2>
      <div className={styles.aside}>
        <p className={styles.text}>
          {t`AI accelerates implementation. What matters is what gets built, how it fits the architecture, and what quality looks like. That is where we take responsibility.`}
        </p>
      </div>
    </section>
  )
}
