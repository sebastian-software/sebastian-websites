import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import * as styles from "~/components/Metrics.css"
import { MetricsDashboard } from "~/components/MetricsDashboard"

import type { Route } from "./+types/metrics"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads route metadata.
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Open Source Metrics – Sebastian Software` },
    {
      content: t`Public project activity, releases, package downloads, and source status from Sebastian Software.`,
      name: "description",
    },
  ]
}

export default function Metrics({ loaderData }: Route.ComponentProps): ReactElement {
  return (
    <main className={styles.page} id="main">
      <div className={styles.intro}>
        <ArrowLink href="/">{t`Open Source`}</ArrowLink>
        <h1 className={styles.title}>{t`Open source, in numbers.`}</h1>
        <p
          className={styles.lead}
        >{t`Projects, packages, and the activity behind them. One public snapshot, with each source and time window kept in view.`}</p>
      </div>
      <MetricsDashboard initial={loaderData} />
    </main>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- React Router runs this loader during prerendering.
export { loadMetrics as loader } from "~/lib/metrics"
