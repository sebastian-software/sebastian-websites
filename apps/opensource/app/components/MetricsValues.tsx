import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import {
  crateDownloads30Days,
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

export function ProjectVersionCells({ project }: { readonly project: Project }): ReactElement {
  const latest = [...project.packages]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .at(0)
  if (project.release)
    return (
      <>
        <td>
          <a
            href={`${repoUrl(project.name)}/releases/tag/${encodeURIComponent(project.release.tag)}`}
          >
            v{project.release.version}
          </a>
          <span className={styles.small}>
            <DateValue value={project.release.publishedAt} />
          </span>
        </td>
        <td>GitHub</td>
      </>
    )
  return latest === undefined ? (
    <>
      <td>—</td>
      <td>—</td>
    </>
  ) : (
    <>
      <td>
        <a href={packageUrl(latest)}>v{latest.version}</a>
      </td>
      <td>{latest.registry === "npm" ? "npm" : "crates.io"}</td>
    </>
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
  const downloads =
    registry === "crates"
      ? crateDownloads30Days(packages)
      : packages.reduce((sum, pkg) => sum + pkg.downloads, 0)
  return <MetricNumber exact value={status === "ok" && packages.length > 0 ? downloads : null} />
}
