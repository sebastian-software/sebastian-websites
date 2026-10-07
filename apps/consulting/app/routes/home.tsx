import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ButtonLink } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { Closing } from "~/components/Closing"
import { Founders } from "~/components/Founders"
import { Judgment } from "~/components/Judgment"
import { Services } from "~/components/Services"

import type { Route } from "./+types/home"

import * as styles from "./home.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Sebastian Consulting – Architecture and engineering for complex web applications` },
    {
      content: t`Software architecture, engineering, and technical direction for complex web applications: React and TypeScript modernization, internationalization, and team enablement, directly with two senior architects.`,
      name: "description",
    },
  ]
}

export default function Home(): ReactElement {
  return (
    <main className={styles.main} id="main">
      <section aria-labelledby="home-title" className={styles.hero}>
        <h1 className={styles.heroTitle} id="home-title">
          {t`Architecture and engineering for complex web applications.`}
        </h1>
        <div className={styles.heroAside}>
          <p className={styles.heroText}>
            {t`We help engineering teams modernize React and TypeScript applications, bring products into more languages, and build a delivery process the team can maintain.`}
          </p>
          <p className={styles.heroMore}>
            {t`Architecture reviews, hands-on development, and knowledge that stays.`}
          </p>
          <p className={styles.heroAction}>
            <ButtonLink href={BOOKING_URL}>{t`Book an intro call`}</ButtonLink>
          </p>
        </div>
      </section>
      <div className={styles.block}>
        <Founders />
      </div>
      <div className={styles.passage}>
        <Judgment />
      </div>
      <div className={styles.block}>
        <Services />
      </div>
      <div className={styles.block}>
        <Closing />
      </div>
    </main>
  )
}
