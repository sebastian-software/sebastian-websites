import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, ButtonLink, editorial, editorialSizes } from "@sebastian-websites/ui"
import { BOOKING_URL } from "@sebastian-websites/web-core"

import { Closing } from "~/components/Closing"
import { Founders } from "~/components/Founders"
import { Judgment } from "~/components/Judgment"
import { Services } from "~/components/Services"
import { HOME_PHOTO } from "~/lib/photos"

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

/** The opening photograph spans the page: 1040 CSS pixels on desktop. */
const HOME_PHOTO_WIDTH = 1040

export default function Home(): ReactElement {
  return (
    <main className={styles.main} id="main">
      <figure className={styles.photoFrame}>
        <BunnyImage
          alt={t`Sebastian Fastner and Sebastian Werner in conversation at a table with coffee`}
          className={editorial.widePhoto}
          crop={HOME_PHOTO.crop}
          height={520}
          priority
          sizes={editorialSizes(HOME_PHOTO_WIDTH)}
          src={HOME_PHOTO.src}
          width={HOME_PHOTO_WIDTH}
        />
      </figure>
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
