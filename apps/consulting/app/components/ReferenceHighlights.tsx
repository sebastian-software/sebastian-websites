import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import { getFeaturedRecommendation } from "~/data/recommendations"

import { RecommendationQuote } from "./RecommendationQuote"
import * as styles from "./ReferenceHighlights.css.ts"

/**
 * A real account of the joint project, followed by the full references page.
 *
 * @returns The homepage reference section.
 */
export function ReferenceHighlights(): ReactElement {
  return (
    <section aria-labelledby="references-title" className={styles.section} id="references">
      <h2
        className={styles.heading}
        id="references-title"
      >{t`What people say about working with us.`}</h2>
      <div className={styles.content}>
        <RecommendationQuote recommendation={getFeaturedRecommendation()} />
        <p className={styles.action}>
          <ArrowLink href="/references">{t`Read the references`}</ArrowLink>
        </p>
      </div>
    </section>
  )
}
