import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, editorial, editorialSizes, Illustration } from "@sebastian-websites/ui"

import counter from "~/assets/illustrations/counter.image.mdx"
import { crateDownloads30Days, type Snapshot } from "~/lib/metrics-model"
import { variant } from "~/lib/site"
import { useMetrics } from "~/lib/use-metrics"

import { MetricIcon } from "./MetricIcon"
import * as styles from "./Metrics.css"

const COUNTER_WIDTH = 504

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
        <dt>
          <MetricIcon name="projects" />
          {t`Public projects`}
        </dt>
        <dd>
          <MetricNumber
            value={snapshot.sources.github === "ok" ? snapshot.projects.length : null}
          />
        </dd>
      </div>
      <div>
        <dt>
          <MetricIcon name="stars" />
          {t`GitHub stars`}
        </dt>
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
        <dt>
          <MetricIcon name="downloads" />
          <span aria-hidden="true">{t`npm / month`}</span>
          <span className={editorial.visuallyHidden}>{t`npm downloads / month`}</span>
        </dt>
        <dd>
          <MetricNumber value={sums("npm")} />
        </dd>
      </div>
      <div>
        <dt>
          <MetricIcon name="downloads" />
          <span aria-hidden="true">{t`crates.io / month`}</span>
          <span className={editorial.visuallyHidden}>{t`crates.io downloads / month`}</span>
        </dt>
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
      <div className={styles.homeIntro}>
        <div>
          <h2
            className={styles.heading}
            id="metrics-overview-title"
          >{t`Open source, in numbers.`}</h2>
          <p
            className={styles.introText}
          >{t`Some of the tools we build for our own projects find their way into other codebases. Here you can see the projects we publish, their stars on GitHub and how often their packages are downloaded from npm and crates.io.`}</p>
        </div>
        <Illustration
          alt=""
          className={styles.counter}
          height={252}
          sizes={editorialSizes(COUNTER_WIDTH)}
          src={counter}
          width={COUNTER_WIDTH}
        />
      </div>
      <div className={styles.overviewCard}>
        <MetricsSummary snapshot={snapshot} />
        {failed ? (
          <p
            className={styles.note}
          >{t`Live refresh unavailable; the previous snapshot is shown.`}</p>
        ) : null}
        <div className={styles.toolbar}>
          <ArrowLink href="/metrics">{t`Explore all metrics`}</ArrowLink>
        </div>
      </div>
    </section>
  )
}
