import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, editorial, StoryIllustration } from "@sebastian-websites/ui"

import regionMap from "~/assets/illustrations/mainz-heidelberg.webp?bunny"

import * as styles from "./RegionStory.css.ts"

/**
 * The company and its region: Mainz and Heidelberg in Rhine-Main and
 * Rhine-Neckar, beside the year of founding and the three values.
 *
 * @returns The regional story.
 */
export function RegionStory(): ReactElement {
  return (
    <section aria-labelledby="company-story" className={styles.region}>
      <figure className={styles.map}>
        <StoryIllustration
          alt={t`A paper map shows Mainz Cathedral, the Worms bridge tower and Mannheim Palace along the Rhine, and Heidelberg Castle on the Neckar.`}
          src={regionMap}
        />
      </figure>
      <div className={styles.aside}>
        <h2 className={styles.since} id="company-story">
          {t`Independent since 2014.`}
        </h2>
        <p className={editorial.bodySerif}>
          {t`Based in Mainz and Heidelberg, rooted in the Rhine-Main and Rhine-Neckar regions. Two founders run the company themselves.`}
        </p>
        <hr className={styles.rule} />
        <p className={styles.values}>
          {t`Experience.`}
          <br />
          {t`Clarity.`}
          <br />
          {t`Enthusiasm.`}
        </p>
        <hr className={styles.rule} />
        <ArrowLink href="/company">{t`About our company`}</ArrowLink>
      </div>
    </section>
  )
}
