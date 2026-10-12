import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import type { Recommendation } from "~/data/recommendations"

import { activeLocale } from "~/lib/i18n"

import * as styles from "./RecommendationQuote.css.ts"

type Props = {
  readonly excerpt?: boolean
  readonly featured?: boolean
  readonly recommendation: Recommendation
}

/**
 * Complete original wording, or the explicitly labeled homepage excerpt.
 *
 * @param props - The original text, attribution, and optional presentation.
 * @returns A quotation with readable paragraphs and the original recommendation date.
 */
export function RecommendationQuote(props: Props): ReactElement {
  const { excerpt = false, featured = false, recommendation } = props
  const date = new Intl.DateTimeFormat(activeLocale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${recommendation.date}T12:00:00Z`)
  )
  const text = excerpt ? (recommendation.excerpt ?? recommendation.quote) : recommendation.quote
  const excerptLabel = activeLocale === "de" ? t`Translated excerpt` : t`Excerpt`
  const sourceLabel = excerpt ? excerptLabel : t`Full recommendation · English original`
  return (
    <figure
      className={`${styles.figure} ${featured ? styles.featured : ""}`}
      id={`recommendation-${recommendation.id}`}
    >
      <span aria-hidden="true" className={styles.mark}>
        “
      </span>
      <p className={styles.topic}>{recommendation.topic}</p>
      <blockquote className={styles.quote} lang={excerpt ? activeLocale : "en"}>
        {text.split(/ {2,}|\n{2}/v).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </blockquote>
      <figcaption className={styles.caption}>
        <cite className={styles.author}>
          {recommendation.authorHref === undefined ? (
            recommendation.author
          ) : (
            <a href={recommendation.authorHref}>{recommendation.author}</a>
          )}
        </cite>
        <time dateTime={recommendation.date}>{date}</time>
        <span>{sourceLabel}</span>
      </figcaption>
    </figure>
  )
}
