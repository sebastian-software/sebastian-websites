import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import type { ServiceKind } from "~/components/ServiceIllustration"

import { CompanyBand } from "~/components/CompanyBand"
import { ServiceIllustration } from "~/components/ServiceIllustration"

import type { Route } from "./+types/services"

import * as page from "./contentPage.css.ts"
import * as styles from "./services.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Services – Sebastian Consulting` },
    {
      content: t`Architecture reviews, React and TypeScript modernization, internationalization, and hands-on engineering with two experienced consultants.`,
      name: "description",
    },
  ]
}

type Service = {
  readonly example: string
  readonly id: ServiceKind
  readonly items: readonly string[]
  readonly projectHref: string
  readonly text: string
  readonly title: string
}

/** @returns Concise service offers grounded in the published project histories. */
function getServices(): readonly Service[] {
  return [
    {
      example: t`EnBW: 21 months building white-label customer portals and reusable components. DWS: three years taking an international investment platform from prototype to production.`,
      id: "architecture",
      items: [
        t`Codebase and dependency review`,
        t`Prioritized modernization plan`,
        t`Implementation alongside your team`,
      ],
      projectHref: "/werner",
      text: t`When a small change touches too much code, we find the coupling and work out the next useful step with your team.`,
      title: t`Architecture that leaves room for change.`,
    },
    {
      example: t`Regrello: a year of interface internationalization and AI translation of user-generated content, including quality evaluation, reliable processing, and operational tooling.`,
      id: "internationalization",
      items: [
        t`Catalogs, terminology, and review workflows`,
        t`Translation pipelines for user content`,
        t`API, build, and release integration`,
      ],
      projectHref: "/fastner",
      text: t`Make language support part of the product, from the interface to the content people create and share.`,
      title: t`A product that works across languages.`,
    },
    {
      example: t`Witt: 18 months rebuilding the foundations of 17 online shops. DWS/MorgenFund: several years evolving an international investment platform and its delivery workflows.`,
      id: "enablement",
      items: [
        t`React, TypeScript, and backend development`,
        t`Pairing, code reviews, and workshops`,
        t`Testing and delivery workflows`,
      ],
      projectHref: "/team",
      text: t`We work in the code with the people maintaining it. Decisions become working software, and the reasoning stays with your team.`,
      title: t`Engineering that moves the team forward.`,
    },
  ]
}

/**
 * Three ways to work together, illustrated and grounded in published projects.
 *
 * @returns A scannable services page with diagrams, deliverables, and project evidence.
 */
export default function ServicesPage(): ReactElement {
  const services = getServices()
  return (
    <main className={page.main} id="main">
      <header className={page.intro}>
        <p className={page.eyebrow}>{t`Services`}</p>
        <h1 className={page.title}>{t`Software your team can keep changing.`}</h1>
        <div className={page.introCopy}>
          <p>{t`Architecture, internationalization, and hands-on engineering. You work directly with the two consultants who review and implement the work.`}</p>
          <nav aria-label={t`Service areas`} className={styles.jumpLinks}>
            <a href="#architecture">
              {t`Architecture`} <span aria-hidden="true">↘</span>
            </a>
            <a href="#internationalization">
              {t`Internationalization`} <span aria-hidden="true">↘</span>
            </a>
            <a href="#enablement">
              {t`Engineering & enablement`} <span aria-hidden="true">↘</span>
            </a>
          </nav>
        </div>
      </header>
      <CompanyBand />
      <div className={styles.services}>
        {services.map((service, index) => (
          <section
            aria-labelledby={`${service.id}-title`}
            className={styles.service}
            data-reverse={index === 1 ? "" : undefined}
            id={service.id}
            key={service.id}
          >
            <div className={styles.content}>
              <p aria-hidden="true" className={page.eyebrow}>
                0{index + 1}
              </p>
              <h2 className={styles.heading} id={`${service.id}-title`}>
                {service.title}
              </h2>
              <p className={styles.text}>{service.text}</p>
              <ul className={styles.deliverables}>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.visual}>
              <ServiceIllustration kind={service.id} />
            </div>
            <div className={styles.evidence}>
              <p className={styles.evidenceLabel}>{t`In practice`}</p>
              <p className={styles.example}>{service.example}</p>
              <p className={styles.evidenceLink}>
                <ArrowLink
                  href={service.projectHref}
                >{t`Explore the project experience`}</ArrowLink>
              </p>
            </div>
          </section>
        ))}
      </div>
      <section aria-labelledby="collaboration-title" className={page.service}>
        <h2 className={page.heading} id="collaboration-title">{t`Start with the situation.`}</h2>
        <div className={page.copy}>
          <p>{t`Tell us what has become difficult to change, ship, or explain. We can discuss whether an architecture review, focused implementation work, or support alongside your team is the useful next step.`}</p>
          <div className={page.actions}>
            <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
            <ArrowLink href="/references">{t`Read the references`}</ArrowLink>
            <ArrowLink href="/team">{t`Meet the consultants`}</ArrowLink>
          </div>
        </div>
      </section>
    </main>
  )
}
