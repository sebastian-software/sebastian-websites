import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { metrics } from "virtual:opensource-build-data"

import * as styles from "~/components/Metrics.css"
import { MetricsDashboard } from "~/components/MetricsDashboard"
import { variant } from "~/lib/site"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata.
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/metrics", [
    { title: t`Open Source Metrics – Sebastian Software` },
    {
      content: t`Public project activity, releases, package downloads, and source status from Sebastian Software.`,
      name: "description",
    },
  ])
}

export default function Metrics(): ReactElement {
  return (
    <main className={`${styles.page} ${styles.dashboard}`} id="main">
      <MetricsDashboard initial={metrics} />
    </main>
  )
}
