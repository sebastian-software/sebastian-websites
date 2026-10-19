import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import {
  packageUrl,
  type Project,
  repoUrl,
  type Status,
  type Usage,
  usageLabel,
} from "~/lib/metrics-model"
import { variant } from "~/lib/site"

import * as styles from "./Metrics.css"
import { MetricNumber } from "./MetricsSummary"

export function DateValue({ value }: { readonly value: string }): ReactElement {
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat(variant.locale, { dateStyle: "medium", timeZone: "UTC" }).format(
        new Date(value)
      )}
    </time>
  )
}

export function UsageValue({
  now,
  usage,
}: {
  readonly now: number
  readonly usage: undefined | Usage
}): ReactElement {
  const state = usageLabel(usage, now).text
  if (state === "Unverified") return <span>{t`Unverified`}</span>
  if (state === "Partial data") return <span>{t`Partial data`}</span>
  if (state === "Unavailable") return <span>{t`Unavailable`}</span>
  if (state === "Stale") return <span>{t`Stale`}</span>
  return <MetricNumber exact value={usage?.window.count ?? null} />
}

export function ProjectVersion({ project }: { readonly project: Project }): ReactElement {
  const latest = [...project.packages]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .at(0)
  if (project.release)
    return (
      <>
        <span className={styles.versionCell}>
          <a
            href={`${repoUrl(project.name)}/releases/tag/${encodeURIComponent(project.release.tag)}`}
          >
            v{project.release.version}
          </a>
          <span className={styles.registryName}>GitHub</span>
        </span>
        <span className={styles.small}>
          <DateValue value={project.release.publishedAt} />
        </span>
      </>
    )
  return latest === undefined ? (
    <span>—</span>
  ) : (
    <span className={styles.versionCell}>
      <a href={packageUrl(latest)}>v{latest.version}</a>
      <span className={styles.registryName}>{latest.registry === "npm" ? "npm" : "crates.io"}</span>
    </span>
  )
}

export function ProjectDownloads({
  project,
  registry,
  status,
}: {
  readonly project: Project
  readonly registry: "crates" | "npm"
  readonly status: Status
}): ReactElement {
  const packages = project.packages.filter((pkg) => pkg.registry === registry)
  return (
    <MetricNumber
      exact
      value={
        status === "ok" && packages.length > 0
          ? packages.reduce((sum, pkg) => sum + pkg.downloads, 0)
          : null
      }
    />
  )
}
