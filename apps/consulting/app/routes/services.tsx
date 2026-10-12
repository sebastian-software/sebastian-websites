import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import type { Route } from "./+types/services"

import * as styles from "./contentPage.css.ts"

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

/**
 * Concrete work, deliverables, and examples drawn from the consultant profiles.
 *
 * @returns Architecture, internationalization, and engineering offers with project examples.
 */
export default function ServicesPage(): ReactElement {
  const services = [
    {
      example: t`At SBB, our architecture work covered the ticket-booking frontend, targeted refactoring, a monorepo proof of concept, and shared development standards. At EnBW, it covered reusable components and the architecture of white-label customer portals.`,
      id: "architecture",
      items: [
        t`Review application boundaries, component structure, dependencies, and the build setup.`,
        t`Make architectural tradeoffs explicit and turn them into a prioritized migration plan.`,
        t`Implement the next steps in the codebase together with your team.`,
      ],
      text: t`When every change touches too many parts of the application, the first question is where the coupling comes from. We work through that with your team before choosing a new framework or committing to a rewrite.`,
      title: t`Architecture and modernization`,
    },
    {
      example: t`At Regrello, our work connected interface localization with an AI translation pipeline for user-generated content. It included frontend catalogs, backend integration, translation quality evaluation, queues, retries, and operational tooling.`,
      id: "internationalization",
      items: [
        t`Build maintainable extraction, catalog, terminology, and review workflows for interface text.`,
        t`Design translation pipelines for user-generated content, including quality checks and failure handling.`,
        t`Integrate language support into application APIs, builds, and releases.`,
      ],
      text: t`Supporting another language affects more than the translation files. We help with the application architecture and the workflow around it, from interface text to content that users create and share across languages.`,
      title: t`Internationalization and localization`,
    },
    {
      example: t`Our project experience spans investment platforms at DWS, the foundations of 17 online shops at Witt, and frontend workshops at GE Healthcare. Alongside client work, we build and operate our own software products.`,
      id: "enablement",
      items: [
        t`Work directly on React and TypeScript features, application backends, and their integration.`,
        t`Use pairing and code reviews to share decisions and make knowledge accessible to the team.`,
        t`Improve testing, CI/CD, and AI-assisted development practices around the existing delivery process.`,
      ],
      text: t`An architectural decision only helps when it survives implementation. We stay close to the code and to the people maintaining it, whether that means developing a feature, untangling a delivery problem, or working through a difficult decision together.`,
      title: t`Engineering and team enablement`,
    },
  ]

  return (
    <main className={styles.main} id="main">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t`Services`}</p>
        <h1 className={styles.title}>{t`Software your team can keep changing.`}</h1>
        <div className={styles.introCopy}>
          <p>{t`We help teams with the architecture of their web applications, internationalization, and the engineering work that makes those decisions hold up in practice.`}</p>
          <p>{t`You work directly with the two consultants who review and implement the work. Our focus is React and TypeScript, with experience across application backends, translation pipelines, and delivery infrastructure.`}</p>
        </div>
      </header>
      {services.map((service) => (
        <section
          aria-labelledby={`${service.id}-title`}
          className={styles.service}
          id={service.id}
          key={service.id}
        >
          <h2 className={styles.heading} id={`${service.id}-title`}>
            {service.title}
          </h2>
          <div className={styles.copy}>
            <p>{service.text}</p>
            <ul className={styles.list}>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{service.example}</p>
          </div>
        </section>
      ))}
      <section aria-labelledby="collaboration-title" className={styles.service}>
        <h2 className={styles.heading} id="collaboration-title">{t`Start with the situation.`}</h2>
        <div className={styles.copy}>
          <p>{t`Tell us what has become difficult to change, ship, or explain. We can discuss whether an architecture review, focused implementation work, or support alongside your team is the useful next step.`}</p>
          <div className={styles.actions}>
            <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
            <ArrowLink href="/references">{t`Read the references`}</ArrowLink>
            <ArrowLink href="/team">{t`Meet the consultants`}</ArrowLink>
          </div>
        </div>
      </section>
    </main>
  )
}
