import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { editorial } from "@sebastian-websites/ui"

import * as styles from "./Services.css.ts"

/**
 * The three recurring kinds of work, each explained as a situation and how
 * we help with it.
 *
 * @returns The services section.
 */
export function Services(): ReactElement {
  const services = [
    {
      text: t`When a web application has become hard to change, we review the architecture with your team, make tradeoffs visible, and help implement the next step in React and TypeScript. You get a target picture, a reasoned decision, and a migration path the team can carry.`,
      title: t`Make the next change easier.`,
    },
    {
      text: t`We help turn internationalization into a maintainable product capability, from code and catalogs to context, translation workflows, and delivery, so new languages stop being a project of their own.`,
      title: t`Bring the product into more languages.`,
    },
    {
      text: t`Pairing, reviews, and practical standards help teams build shared judgment, including clear guardrails for AI-assisted delivery. Knowledge, tools, and standards stay when we leave.`,
      title: t`Leave the team stronger.`,
    },
  ]
  return (
    <section aria-labelledby="services-title" id="services">
      <h2 className={editorial.visuallyHidden} id="services-title">
        {t`Services`}
      </h2>
      <ul className={styles.list}>
        {services.map((service) => (
          <li className={styles.item} key={service.title}>
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.text}>{service.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
