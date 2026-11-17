import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink, editorial } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import * as page from "~/routes/contentPage.css.ts"

import * as styles from "./ServicePage.css.ts"

export type CaseStudyData = {
  readonly description: string
  readonly lead: string
  readonly period: string
  readonly sections: ReadonlyArray<{
    readonly id: string
    readonly paragraphs: readonly string[]
    readonly title: string
  }>
  readonly service: { readonly href: string; readonly label: string }
  readonly sources: ReadonlyArray<{ readonly href: string; readonly label: string }>
  readonly title: string
}

/**
 * A public project account using the existing Consulting grid and type scale.
 * @param props - The evidence-led account and relevant next step.
 * @param props.study - Localized context, individual contributions, and sources.
 * @returns The complete static case-study page.
 */
export function CaseStudy({ study }: { readonly study: CaseStudyData }): ReactElement {
  return (
    <main className={page.main} id="main">
      <header className={page.intro}>
        <p className={page.eyebrow}>{t`Case study`}</p>
        <h1 className={styles.title}>{study.title}</h1>
        <div className={page.introCopy}>
          <p>{study.lead}</p>
          <p className={editorial.caption}>{study.period}</p>
        </div>
      </header>
      {study.sections.map((section) => (
        <section aria-labelledby={`${section.id}-title`} className={page.service} key={section.id}>
          <h2 className={page.heading} id={`${section.id}-title`}>
            {section.title}
          </h2>
          <div className={page.copy}>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
      <section aria-labelledby="sources-title" className={page.service}>
        <h2 className={page.heading} id="sources-title">{t`Public sources and profiles`}</h2>
        <div className={page.copy}>
          <p>{t`This account draws on the public project accounts linked below. Individual contributions are attributed to the consultant responsible; customer assessments remain attributed to their authors.`}</p>
          <ul className={page.list}>
            {study.sources.map((source) => (
              <li key={source.href}>
                <ArrowLink href={source.href}>{source.label}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className={page.closing}>
        <h2 className={page.heading}>{t`Discuss your situation`}</h2>
        <div className={page.actions}>
          <ArrowLink href={study.service.href}>{study.service.label}</ArrowLink>
          <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
        </div>
      </div>
    </main>
  )
}
