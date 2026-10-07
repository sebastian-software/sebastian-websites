import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import { FeaturedStory } from "~/components/FeaturedStory"
import { ProjectTiles } from "~/components/ProjectTiles"
import * as tiles from "~/components/ProjectTiles.css"
import { getFeatured } from "~/data/featured"
import { CURATED, EXCLUSIONS, getProjects } from "~/data/projects"
import { loadActivity } from "~/lib/activity"
import { buildCollection, findUncurated } from "~/lib/collection"

import type { Route } from "./+types/home"

import * as styles from "./home.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Open Source – Sebastian Software` },
    {
      content: t`Open projects by Sebastian Software: Palamedes, Ferramenta, Dalo, Ardo, and the tools and libraries around them.`,
      name: "description",
    },
  ]
}

/**
 * Runs at build time: loads repository activity, falling back to the committed
 * snapshot, and reports repositories that curation does not cover yet.
 *
 * @returns The push date per curated repository; absent dates are unknown.
 */
// eslint-disable-next-line react-refresh/only-export-components -- React Router runs the loader at build time
export async function loader(): Promise<{ readonly pushedAt: Readonly<Record<string, string>> }> {
  const { activity } = await loadActivity()
  const uncurated = findUncurated(CURATED, EXCLUSIONS, activity)
  if (uncurated.length > 0) {
    console.warn(`Repositories missing from curation: ${uncurated.join(", ")}`)
  }
  const pushedAt = Object.fromEntries(
    CURATED.flatMap((project) => {
      const date = activity.repositories[project.repo]?.pushedAt
      return date === undefined ? [] : [[project.repo, date]]
    })
  )
  return { pushedAt }
}

export default function Home({ loaderData }: Route.ComponentProps): ReactElement {
  const repositories = Object.fromEntries(
    Object.entries(loaderData.pushedAt).map(([repo, pushedAt]) => [
      repo,
      { packages: [], pushedAt },
    ])
  )
  const groups = buildCollection(getProjects(), { generatedAt: "", repositories })
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
