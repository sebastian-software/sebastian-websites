import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import type { Recommendation } from "~/data/recommendations"

import { activeLocale } from "~/lib/i18n"

import * as styles from "./RecommendationQuote.css.ts"

/**
 * An attributed excerpt; the author link refers to the person's verified
 * profile, while the date belongs to the recommendation rather than their job.
 *
 * @param props - The localized quote and its source metadata.
 * @param props.recommendation - The selected excerpt with its author, original date, and topic.
 * @returns An accessible quotation with author, date, and collaboration topic.
 */
export function RecommendationQuote(props: {
  readonly recommendation: Recommendation
}): ReactElement {
  const { recommendation } = props
  const date = new Intl.DateTimeFormat(activeLocale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${recommendation.date}T12:00:00Z`)
  )
  return (
    <figure className={styles.figure} id={`recommendation-${recommendation.id}`}>
      <p className={styles.topic}>{recommendation.topic}</p>
      <blockquote className={styles.quote}>
        <p>{recommendation.quote}</p>
      </blockquote>
      <figcaption className={styles.caption}>
        <cite className={styles.author}>
          <a href={recommendation.authorHref}>{recommendation.author}</a>
        </cite>
        <time dateTime={recommendation.date}>{date}</time>
        <span>{activeLocale === "de" ? t`Translated from English` : t`Excerpt`}</span>
      </figcaption>
    </figure>
  )
}
