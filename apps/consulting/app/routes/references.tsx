import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { RecommendationQuote } from "~/components/RecommendationQuote"
import { getRecommendations, RECOMMENDATIONS_SOURCE } from "~/data/recommendations"
import { activeLocale } from "~/lib/i18n"

import type { Route } from "./+types/references"

import * as styles from "./contentPage.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`References – Sebastian Consulting` },
    {
      content: t`Recommendations from people we have worked with on software architecture, internationalization, frontend engineering, and team enablement.`,
      name: "description",
    },
  ]
}

/**
 * Genuine recommendations grouped by the work rather than by a consultant.
 *
 * @returns The references page with dated, attributed, source-linked excerpts.
 */
export default function ReferencesPage(): ReactElement {
  return (
    <main className={styles.main} id="main">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t`References`}</p>
        <h1 className={styles.title}>{t`Perspectives from working together.`}</h1>
        <div className={styles.introCopy}>
          <p>{t`Architecture and engineering are collaborative work. These recommendations describe what people experienced alongside us: technical judgment, attention to users, and knowledge shared with the team.`}</p>
          <p>{t`The excerpts come from LinkedIn recommendations, with authors and dates preserved. The dates refer to when the recommendations were written.`}</p>
        </div>
      </header>
      <ul className={styles.recommendations}>
        {getRecommendations().map((recommendation) => (
          <li
            className={
              recommendation.id === "chris-lewis" ? styles.featured : styles.recommendation
            }
            key={recommendation.id}
          >
            <RecommendationQuote recommendation={recommendation} />
          </li>
        ))}
      </ul>
      <p className={styles.source}>
        {activeLocale === "de"
          ? t`Translated excerpts. The original recommendations are in English.`
          : t`Selected excerpts from the original English recommendations.`}
      </p>
      <ArrowLink
        direction="outward"
        href={RECOMMENDATIONS_SOURCE}
      >{t`Original recommendations on LinkedIn`}</ArrowLink>
      <div className={styles.closing}>
        <div className={styles.actions}>
          <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
          <ArrowLink href="/services">{t`Explore our services`}</ArrowLink>
        </div>
      </div>
    </main>
  )
}
