import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { getServicePage, SERVICE_IDS, SERVICE_PATHS, type ServiceId } from "~/data/services"
import * as page from "~/routes/contentPage.css.ts"

import * as styles from "./ServicePage.css.ts"

function BeforeStarting({
  questions,
}: {
  readonly questions: ReturnType<typeof getServicePage>["questions"]
}): ReactElement {
  return (
    <section aria-labelledby="questions-title" className={page.service}>
      <h2 className={page.heading} id="questions-title">{t`Before we start`}</h2>
      <div className={page.copy}>
        <div className={styles.sectionContent}>
          {questions.map((question) => (
            <div className={styles.block} key={question.title}>
              <h3 className={styles.subheading}>{question.title}</h3>
              {question.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * One readable service brief, with proof and a single booking goal.
 * @param props - The selected service.
 * @param props.id - The service identifier.
 * @returns The complete service page.
 */
export function ServicePage({ id }: { readonly id: ServiceId }): ReactElement {
  const service = getServicePage(id)
  return (
    <main className={page.main} id="main">
      <header className={page.intro}>
        <p className={page.eyebrow}>
          <ArrowLink href="/services">{t`Services`}</ArrowLink>
        </p>
        <h1 className={styles.title}>{service.title}</h1>
        <div className={page.introCopy}>
          <p>{service.lead}</p>
          <div className={page.actions}>
            <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
          </div>
        </div>
      </header>
      <section aria-labelledby="situations-title" className={page.service}>
        <h2 className={page.heading} id="situations-title">{t`When this helps`}</h2>
        <div className={page.copy}>
          <ul className={page.list}>
            {service.situations.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="approach-title" className={page.service}>
        <h2 className={page.heading} id="approach-title">{t`How we work with your team`}</h2>
        <div className={page.copy}>
          <div className={styles.sectionContent}>
            {service.approach.map((step) => (
              <div className={styles.block} key={step.title}>
                <h3 className={styles.subheading}>{step.title}</h3>
                {step.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="deliverables-title" className={page.service}>
        <h2 className={page.heading} id="deliverables-title">{t`What you take away`}</h2>
        <div className={page.copy}>
          <ul className={page.list}>
            {service.deliverables.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="evidence-title" className={page.service}>
        <h2 className={page.heading} id="evidence-title">{t`Experience behind the work`}</h2>
        <div className={page.copy}>
          <div className={styles.sectionContent}>
            {service.evidence.map((evidence) => (
              <div className={styles.block} key={evidence.href}>
                <p>{evidence.text}</p>
                <p>
                  <ArrowLink href={evidence.href}>{evidence.label}</ArrowLink>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="fit-title" className={page.service}>
        <h2 className={page.heading} id="fit-title">{t`Scope and fit`}</h2>
        <div className={page.copy}>
          {service.fit.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>
      <BeforeStarting questions={service.questions} />
      <section aria-labelledby="next-title" className={page.service}>
        <h2 className={page.heading} id="next-title">{t`Start with the situation`}</h2>
        <div className={page.copy}>
          <p>{t`Tell us what your team needs to decide or change. In an introductory conversation, we discuss whether and how we can help, before agreeing a scope.`}</p>
          <div className={page.actions}>
            <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
            <ArrowLink href="/team">{t`Meet the consultants`}</ArrowLink>
          </div>
        </div>
      </section>
      <nav aria-label={t`Related services`} className={styles.related}>
        {SERVICE_IDS.filter((other) => other !== id).map((other) => (
          <ArrowLink href={SERVICE_PATHS[other]} key={other}>
            {getServicePage(other).title}
          </ArrowLink>
        ))}
      </nav>
    </main>
  )
}
