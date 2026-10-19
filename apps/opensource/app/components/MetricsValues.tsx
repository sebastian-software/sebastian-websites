import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import {
  type Package,
  packageUrl,
  type Project,
  repoUrl,
  type Snapshot,
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
  return <MetricNumber value={usage?.window.count ?? null} />
}

function PackageInfo({ pkg }: { readonly pkg: Package }): ReactElement {
  return (
    <li>
      <a href={packageUrl(pkg)}>{pkg.name}</a>
      <span>v{pkg.version}</span>
      <span>
        {new Intl.NumberFormat(variant.locale).format(pkg.downloads)}{" "}
        {pkg.registry === "npm" ? t`monthly downloads` : t`all-time downloads`}
      </span>
      {pkg.recentDownloads === undefined ? null : (
        <span>
          {new Intl.NumberFormat(variant.locale).format(pkg.recentDownloads)} {t`recent downloads`}
        </span>
      )}
      <span>
        <DateValue value={pkg.publishedAt} />
      </span>
    </li>
  )
}

export function ProjectDetails({
  now,
  project,
  snapshot,
}: {
  readonly now: number
  readonly project: Project
  readonly snapshot: Snapshot
}): ReactElement {
  return (
    <details className={styles.details}>
      <summary>
        {t`Details`} {project.packages.length > 0 ? `(${project.packages.length})` : ""}
      </summary>
      <dl>
        <dt>{t`Forks`}</dt>
        <dd>{project.forks}</dd>
        <dt>{t`Last push`}</dt>
        <dd>
          <DateValue value={project.pushedAt} />
        </dd>
        {project.release ? (
          <>
            <dt>{t`GitHub release`}</dt>
            <dd>
              <a
                href={`${repoUrl(project.name)}/releases/tag/${encodeURIComponent(project.release.tag)}`}
              >
                {project.release.version}
              </a>
            </dd>
          </>
        ) : null}
        {snapshot.usage[project.name] ? (
          <>
            <dt>{t`Active users*`}</dt>
            <dd>
              <UsageValue now={now} usage={snapshot.usage[project.name]} />
            </dd>
          </>
        ) : null}
      </dl>
      {project.packages.length > 0 ? (
        <ul>
          {project.packages.map((pkg) => (
            <PackageInfo key={`${pkg.registry}/${pkg.name}`} pkg={pkg} />
          ))}
        </ul>
      ) : (
        <p>
          {snapshot.sources.npm === "ok" && snapshot.sources.crates === "ok"
            ? t`No linked registry packages.`
            : t`Registry data is unavailable.`}
        </p>
      )}
    </details>
  )
}

export function ProjectVersion({ project }: { readonly project: Project }): ReactElement {
  const latest = [...project.packages]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .at(0)
  if (project.release)
    return (
      <>
        <a
          href={`${repoUrl(project.name)}/releases/tag/${encodeURIComponent(project.release.tag)}`}
        >
          v{project.release.version}
        </a>
        <span className={styles.small}>{t`GitHub release`}</span>
      </>
    )
  return latest ? (
    <>
      <a href={packageUrl(latest)}>v{latest.version}</a>
      <span className={styles.small}>{latest.registry === "npm" ? "npm" : "crates.io"}</span>
    </>
  ) : (
    <span>—</span>
  )
}

export function ProjectDownloads({ project }: { readonly project: Project }): ReactElement {
  return (
    <>
      {(["npm", "crates"] as const).map((registry) => {
        const packages = project.packages.filter((pkg) => pkg.registry === registry)
        return packages.length > 0 ? (
          <div key={registry}>
            <MetricNumber value={packages.reduce((sum, pkg) => sum + pkg.downloads, 0)} />
            <span className={styles.small}>
              {registry === "npm" ? t`npm / month` : t`crates.io / all time`}
            </span>
          </div>
        ) : null
      })}
      {project.packages.length === 0 ? "—" : null}
    </>
  )
}
