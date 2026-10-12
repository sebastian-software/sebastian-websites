import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { RecommendationQuote } from "~/components/RecommendationQuote"
import { getFeaturedRecommendation, getRecommendations } from "~/data/recommendations"

import type { Route } from "./+types/references"

import * as page from "./contentPage.css.ts"
import * as styles from "./references.css.ts"

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
 * Complete recommendations on our own site, organized around the work.
 *
 * @returns Fifteen attributed originals, including the full joint-project account.
 */
export default function ReferencesPage(): ReactElement {
  const recommendations = getRecommendations()
  const groups = [
    {
      description: t`Language support, product judgment, and attention to the people using the software.`,
      id: "product",
      title: t`Internationalization & product`,
    },
    {
      description: t`Making difficult decisions together and helping a team build on what it learns.`,
      id: "collaboration",
      title: t`Architecture & teamwork`,
    },
    {
      description: t`Perspectives from coaching, reusable interfaces, and years of frontend work.`,
      id: "practice",
      title: t`Engineering over time`,
    },
  ] as const
  return (
    <main className={page.main} id="main">
      <header className={page.intro}>
        <p className={page.eyebrow}>{t`References`}</p>
        <h1 className={page.title}>{t`Perspectives from working together.`}</h1>
        <div className={page.introCopy}>
          <p>{t`Fifteen complete recommendations from people we have worked with. Read them here, without a LinkedIn account.`}</p>
          <p>{t`The recommendations were received by Werner; Chris Lewis also describes our joint work. Each appears in the original English wording, with its author and date.`}</p>
          <nav aria-label={t`Recommendation topics`} className={styles.topics}>
            {groups.map((group) => (
              <a href={`#${group.id}`} key={group.id}>
                {group.title} <span aria-hidden="true">↘</span>
              </a>
            ))}
          </nav>
        </div>
      </header>
      {groups.map((group) => (
        <section
          aria-labelledby={`${group.id}-title`}
          className={styles.group}
          id={group.id}
          key={group.id}
        >
          <header className={styles.groupHeading}>
            <h2 className={styles.heading} id={`${group.id}-title`}>
              {group.title}
            </h2>
            <p className={styles.description}>{group.description}</p>
          </header>
          {group.id === "product" ? (
            <div className={styles.featured}>
              <RecommendationQuote featured recommendation={getFeaturedRecommendation()} />
            </div>
          ) : null}
          <ul className={styles.recommendations}>
            {recommendations
              .filter(
                (recommendation) =>
                  recommendation.group === group.id && recommendation.id !== "chris-lewis"
              )
              .map((recommendation) => (
                <li className={styles.recommendation} key={recommendation.id}>
                  <RecommendationQuote recommendation={recommendation} />
                </li>
              ))}
          </ul>
        </section>
      ))}
      <div className={page.closing}>
        <p
          className={page.source}
        >{t`Selected from received LinkedIn recommendations. The dates record when each recommendation was written; the wording is reproduced in full.`}</p>
        <div className={page.actions}>
          <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
          <ArrowLink href="/services">{t`Explore our services`}</ArrowLink>
        </div>
      </div>
    </main>
  )
}
