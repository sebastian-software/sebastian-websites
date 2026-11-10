import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { ArrowLink } from "@sebastian-websites/ui"
import { activity, metrics } from "virtual:opensource-build-data"

import { FeaturedStory } from "~/components/FeaturedStory"
import { MetricsOverview } from "~/components/MetricsSummary"
import { ProjectTiles } from "~/components/ProjectTiles"
import * as tiles from "~/components/ProjectTiles.css"
import { getFeatured } from "~/data/featured"
import { CURATED, EXCLUSIONS, getProjects } from "~/data/projects"
import { buildCollection, findUncurated } from "~/lib/collection"
import { variant } from "~/lib/site"

import * as styles from "./home.css.ts"

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

// Report new repositories during prerendering; activity never adds uncurated tiles.
if (import.meta.env.SSR) {
  const uncurated = findUncurated(CURATED, EXCLUSIONS, activity)
  if (uncurated.length > 0) {
    console.warn(`Repositories missing from curation: ${uncurated.join(", ")}`)
  }
}

export default function Home(): ReactElement {
  const groups = buildCollection(getProjects(), activity)
  return (
    <main className={styles.main} id="main">
      <section aria-labelledby="home-title" className={styles.hero}>
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
      <div className={styles.stories}>
        {getFeatured().map((project, index) => (
          <FeaturedStory index={index} key={project.id} project={project} />
        ))}
      </div>
      <section aria-labelledby="projects-title" className={styles.projects} id="projects">
        <div className={tiles.head}>
          <h2 className={tiles.title} id="projects-title">
            {t`More open projects.`}
          </h2>
          <p
            className={tiles.subtitle}
          >{t`Tools, services and libraries for the next part of your work.`}</p>
        </div>
        <ProjectTiles groups={groups} />
      </section>
    </main>
  )
}
