// cspell:words rybbit
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink, editorial } from "@sebastian-websites/ui"

import {
  ENDPOINT,
  MAX_SNAPSHOT_AGE_MS,
  type Snapshot,
  SOURCE_KEYS,
  SOURCE_NAMES,
} from "~/lib/metrics-model"
import { useMetrics } from "~/lib/use-metrics"

import * as styles from "./Metrics.css"
import { Packages } from "./MetricsPackages"
import { Projects } from "./MetricsProjects"
import { MetricsSummary, SnapshotTime } from "./MetricsSummary"

function sourceLabel(status: string): string {
  if (status === "ok") return t`Connected`
  return status === "skipped" ? t`Not connected` : t`Unavailable`
}
function SourceList({ snapshot }: { readonly snapshot: Snapshot }): ReactElement {
  const names = {
    ...SOURCE_NAMES,
    releases: t`GitHub releases`,
    rybbit: t`CLI activity`,
    skills: t`Agent skills`,
  }
  return (
    <section aria-labelledby="sources-title" className={styles.section} id="sources">
      <h2 className={styles.heading} id="sources-title">{t`Data sources`}</h2>
      <ul className={styles.sources}>
        {SOURCE_KEYS.map((source) => (
          <li key={source}>
            {names[source]}
            <span className={styles.small}>{sourceLabel(snapshot.sources[source])}</span>
          </li>
        ))}
      </ul>
      <ArrowLink href={ENDPOINT}>{t`Open JSON snapshot`}</ArrowLink>
    </section>
  )
}

/**
 * The complete public snapshot, with source states and refreshes that preserve observations.
 * @param root0 - The input data.
 * @param root0.initial - The build-time snapshot.
 * @returns The metrics view.
 */
export function MetricsDashboard({ initial }: { readonly initial: Snapshot }): ReactElement {
  const { failed, loading, now, refresh, snapshot } = useMetrics(initial)
  const errors = Object.values(snapshot.sources).includes("error")
  const stale = now - Date.parse(snapshot.generatedAt) > MAX_SNAPSHOT_AGE_MS
  return (
    <>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.title}>{t`Open Source metrics`}</h1>
          <p className={styles.note}>{t`Projects, packages, and usage at a glance.`}</p>
        </div>
        <div className={styles.toolbar}>
          <p className={styles.note}>
            {t`Collected`}: <SnapshotTime snapshot={snapshot} />
          </p>
          <button
            className={styles.button}
            disabled={loading}
            onClick={() => {
              void refresh()
            }}
            type="button"
          >
            {loading ? t`Refreshing…` : t`Refresh data`}
          </button>
        </div>
      </header>
      <div aria-live="polite">
        {failed ? (
          <p
            className={styles.notice}
            role="alert"
          >{t`Live refresh unavailable; the previous snapshot is shown.`}</p>
        ) : null}
        {stale ? (
          <p
            className={styles.notice}
          >{t`This snapshot is more than two hours old. Its original collection time is shown above.`}</p>
        ) : null}
        {errors ? (
          <p
            className={styles.notice}
          >{t`Some sources are unavailable. Other metrics remain visible.`}</p>
        ) : null}
      </div>
      <MetricsSummary snapshot={snapshot} />

      <nav aria-label={t`Metrics sections`} className={styles.tools}>
        <ArrowLink href="#projects">{t`Projects`}</ArrowLink>
        <ArrowLink href="#packages">{t`Packages`}</ArrowLink>
        <ArrowLink href="#sources">{t`Data sources`}</ArrowLink>
      </nav>
      <Projects now={now} snapshot={snapshot} />
      <Packages snapshot={snapshot} />
      <section aria-labelledby="skills-title" className={styles.section}>
        <h2 className={styles.heading} id="skills-title">{t`Agent skills`}</h2>
        <ul className={styles.skills}>
          {snapshot.skills.map((skill) => (
            <li key={skill.name}>
              <a
                className={editorial.arrowLink}
                href={`https://github.com/sebastian-software/skills.sebastian-software.com/tree/main/skills/${encodeURIComponent(skill.name)}`}
              >
                {skill.name}
              </a>
              <span className={styles.small}>
                {skill.references} {t`references`}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          {snapshot.instructionPacks === null ? (
            t`Skills data is unavailable.`
          ) : (
            <>
              {t`Instruction packs`}: {snapshot.instructionPacks}
            </>
          )}
        </p>
      </section>
      <SourceList snapshot={snapshot} />
      <section aria-labelledby="notes-title" className={styles.section}>
        <h2 className={styles.heading} id="notes-title">{t`Reading the numbers`}</h2>
        <div className={styles.prose}>
          <p
            className={styles.note}
          >{t`All opted-in public projects and published packages, in one shared snapshot.`}</p>
          <p>{t`npm downloads cover a month. crates.io downloads cover the last 30 complete UTC days, summed across every version. Its lifetime and 90-day totals are also listed in the package table. Registry reporting can lag behind downloads. Package totals include packages without a listed project.`}</p>
          <p>{t`Primary languages come from GitHub. Node.js links identify published native bindings explicitly declared in npm package metadata.`}</p>
          <p>{t`The API is normally cached for an hour. This page checks for updates on opening and every five minutes while visible. Refreshing does not force a new upstream collection. Unavailable sources show a state instead of zero.`}</p>
          <p id="usage-note">{t`* Active users is an activity proxy based on update-check requests over 30 complete UTC days, including CI and repeat checks. It does not count deduplicated people or installations. Unverified, incomplete, or stale usage is labeled instead of shown as a user count.`}</p>
          <ArrowLink href="https://github.com/sebastian-software/oss-metrics#endpoint">{t`How the data is collected`}</ArrowLink>
        </div>
      </section>
    </>
  )
}
