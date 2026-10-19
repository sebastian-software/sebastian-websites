import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import { crateDownloads30Days, type Snapshot } from "~/lib/metrics-model"
import { variant } from "~/lib/site"
import { useMetrics } from "~/lib/use-metrics"

import * as styles from "./Metrics.css"

/**
 * Formats numbers in the variant's locale, with exact values available on hover.
 * @param root0 - The input data.
 * @param root0.value - The metric count, or null for unavailable data.
 * @param root0.exact - Whether to show the full number instead of compact notation.
 * @returns The formatted count.
 */
export function MetricNumber({
  exact = false,
  value,
}: {
  readonly exact?: boolean
  readonly value: null | number
}): ReactElement {
  return (
    <span title={value === null ? undefined : new Intl.NumberFormat(variant.locale).format(value)}>
      {value === null
        ? "—"
        : new Intl.NumberFormat(variant.locale, {
            maximumFractionDigits: 1,
            notation: exact ? "standard" : "compact",
          }).format(value)}
    </span>
  )
}

/**
 * Keeps each source's unit and time window in the summary.
 * @param root0 - The input data.
 * @param root0.snapshot - The public snapshot.
 * @returns The formatted metrics.
 */
export function MetricsSummary({ snapshot }: { readonly snapshot: Snapshot }): ReactElement {
  const sums = (registry: "crates" | "npm"): null | number =>
    snapshot.sources[registry] === "ok"
      ? snapshot.packages
          .filter((pkg) => pkg.registry === registry)
          .reduce((total, pkg) => total + pkg.downloads, 0)
      : null
  return (
    <dl className={styles.overview}>
      <div>
        <dt>{t`Public projects`}</dt>
        <dd>
          <MetricNumber
            value={snapshot.sources.github === "ok" ? snapshot.projects.length : null}
          />
        </dd>
      </div>
      <div>
        <dt>{t`GitHub stars`}</dt>
        <dd>
          <MetricNumber
            value={
              snapshot.sources.github === "ok"
                ? snapshot.projects.reduce((sum, project) => sum + project.stars, 0)
                : null
            }
          />
        </dd>
      </div>
      <div>
        <dt>{t`npm downloads / month`}</dt>
        <dd>
          <MetricNumber value={sums("npm")} />
        </dd>
      </div>
      <div>
        <dt>{t`crates.io downloads / month`}</dt>
        <dd>
          <MetricNumber
            value={
              snapshot.sources.crates === "ok" ? crateDownloads30Days(snapshot.packages) : null
            }
          />
        </dd>
      </div>
    </dl>
  )
}

/**
 * Uses the exact UTC collection date rather than implying a new collection on refresh.
 * @param root0 - The input data.
 * @param root0.snapshot - The public snapshot.
 * @returns The formatted metrics.
 */
export function SnapshotTime({ snapshot }: { readonly snapshot: Snapshot }): ReactElement {
  return (
    <time dateTime={snapshot.generatedAt}>
      {new Intl.DateTimeFormat(variant.locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(new Date(snapshot.generatedAt))}{" "}
      UTC
    </time>
  )
}

/**
 * A small live introduction to the complete metrics page.
 * @param root0 - The input data.
 * @param root0.initial - The build-time snapshot.
 * @returns The metrics view.
 */
export function MetricsOverview({ initial }: { readonly initial: Snapshot }): ReactElement {
  const { failed, snapshot } = useMetrics(initial)
  return (
    <section aria-labelledby="metrics-overview-title" className={styles.home}>
      <h2 className={styles.heading} id="metrics-overview-title">{t`Open source, in numbers.`}</h2>
      <p>{t`All opted-in public projects and published packages, in one shared snapshot.`}</p>
      <MetricsSummary snapshot={snapshot} />
      <p className={styles.note}>
        {t`Collected`}: <SnapshotTime snapshot={snapshot} />
        {failed ? (
          <span> · {t`Live refresh unavailable; the previous snapshot is shown.`}</span>
        ) : null}
      </p>
      <div className={styles.toolbar}>
        <ArrowLink href="/metrics">{t`Explore all metrics`}</ArrowLink>
      </div>
    </section>
  )
}
