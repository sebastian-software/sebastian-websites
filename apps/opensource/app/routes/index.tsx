import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { ArrowLink, frameImageSizes, Illustration } from "@sebastian-websites/ui"
import { metrics } from "virtual:opensource-build-data"

import workshop from "~/assets/illustrations/open-workshop.image.mdx"
import { FeaturedStory } from "~/components/FeaturedStory"
import { MetricsOverview } from "~/components/MetricsSummary"
import { getFeatured } from "~/data/featured"
import { variant } from "~/lib/site"

import * as styles from "./home.css.ts"

const BANNER_WIDTH = 1040

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/", [
    { title: t`Open Source – Sebastian Software` },
    {
      content: t`Open projects by Sebastian Software: Palamedes, Ferramenta, Dalo, Ardo, and the tools and libraries around them.`,
      name: "description",
    },
  ])
}

export default function Home(): ReactElement {
  return (
    <main className={styles.main} id="main">
      <section aria-labelledby="home-title" className={styles.hero}>
        <Illustration
          alt={t`At an open workbench, a maker passes on the plans for an adjustable lamp.`}
          className={styles.banner}
          height={520}
          priority
          sizes={frameImageSizes}
          src={workshop}
          width={BANNER_WIDTH}
        />
        <h1 className={styles.heroTitle} id="home-title">
          {t`Open software you can build on.`}
        </h1>
        <p className={styles.heroLead}>
          {t`Documentation, internationalization, document engines, and tools for coding agents. Open projects with practical uses and foundations you can inspect.`}
        </p>
        <p className={styles.heroAction}>
          <ArrowLink href="#projects" underline>
            {t`Explore the projects`}
          </ArrowLink>
        </p>
      </section>
      <MetricsOverview initial={metrics} />
      <div className={styles.stories} id="projects">
        {getFeatured().map((project, index) => (
          <FeaturedStory index={index} key={project.id} project={project} />
        ))}
      </div>
      <div className={styles.moreProjects}>
        <ArrowLink href="/projects">{t`More open projects.`}</ArrowLink>
      </div>
    </main>
  )
}
