import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { activity } from "virtual:opensource-build-data"

import { ProjectTiles } from "~/components/ProjectTiles"
import * as tiles from "~/components/ProjectTiles.css"
import { CURATED, EXCLUSIONS, getProjects } from "~/data/projects"
import { buildCollection, findUncurated } from "~/lib/collection"
import { variant } from "~/lib/site"

import * as styles from "./home.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/projects", [
    { title: t`More open projects.` },
    {
      content: t`Tools, services and libraries for the next part of your work.`,
      name: "description",
    },
  ])
}

// Report new repositories during prerendering so they can be described and translated.
if (import.meta.env.SSR) {
  const uncurated = findUncurated(CURATED, EXCLUSIONS, activity)
  if (uncurated.length > 0) {
    console.warn(`Repositories missing from curation: ${uncurated.join(", ")}`)
  }
}

export default function Projects(): ReactElement {
  const groups = buildCollection(getProjects(), activity)
  return (
    <main className={styles.main} id="main">
      <div className={tiles.head}>
        <h1 className={tiles.title}>{t`More open projects.`}</h1>
        <p
          className={tiles.subtitle}
        >{t`Tools, services and libraries for the next part of your work.`}</p>
      </div>
      <ProjectTiles groups={groups} />
    </main>
  )
}
