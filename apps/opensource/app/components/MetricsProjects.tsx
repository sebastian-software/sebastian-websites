import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { editorial } from "@sebastian-websites/ui"
import { useState } from "react"

import {
  filterProjects,
  packageUrl,
  type Project,
  type ProjectFilter,
  type ProjectSort,
  repoUrl,
  type Snapshot,
} from "~/lib/metrics-model"

import * as styles from "./Metrics.css"
import { MetricNumber } from "./MetricsSummary"
import { DateValue, ProjectDownloads, ProjectVersionCells, UsageValue } from "./MetricsValues"

function projectFilter(value: string): ProjectFilter {
  return value === "npm" || value === "crates" || value === "github" ? value : "all"
}
function projectSort(value: string): ProjectSort {
  return value === "activity" || value === "name" ? value : "stars"
}
function ProjectName({ project }: { readonly project: Project }): ReactElement {
  const bindings = project.packages
    .filter((pkg) => pkg.registry === "npm" && pkg.nodeBinding === true)
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
  return (
    <>
      <a href={repoUrl(project.name)}>{project.name}</a>
      {bindings.map((pkg) => (
        <span className={styles.small} key={pkg.name}>
          Node.js: <a href={packageUrl(pkg)}>{pkg.name}</a>
        </span>
      ))}
    </>
  )
}
function ProjectRow({
  hasUsage,
  now,
  project,
  snapshot,
}: {
  readonly hasUsage: boolean
  readonly now: number
  readonly project: Project
  readonly snapshot: Snapshot
}): ReactElement {
  return (
    <tr>
      <td>
        <ProjectName project={project} />
      </td>
      <ProjectVersionCells now={now} project={project} />
      <td className={styles.languageColumn}>{project.language ?? "—"}</td>
      <td className={styles.numeric}>
        <MetricNumber exact value={project.stars} />
      </td>
      <td className={styles.numeric}>
        <ProjectDownloads project={project} registry="npm" status={snapshot.sources.npm} />
      </td>
      <td className={styles.numeric}>
        <ProjectDownloads project={project} registry="crates" status={snapshot.sources.crates} />
      </td>
      {hasUsage ? (
        <td className={`${styles.numeric} ${styles.usageColumn}`}>
          <UsageValue now={now} usage={snapshot.usage[project.name]} />
        </td>
      ) : null}
      <td>
        <DateValue value={project.pushedAt} />
      </td>
    </tr>
  )
}
function ProjectControls({
  filter,
  onFilter,
  onQuery,
  onSort,
  query,
  sort,
  unavailable,
}: {
  readonly filter: ProjectFilter
  readonly onFilter: (value: ProjectFilter) => void
  readonly onQuery: (value: string) => void
  readonly onSort: (value: ProjectSort) => void
  readonly query: string
  readonly sort: ProjectSort
  readonly unavailable: boolean
}): ReactElement {
  return (
    <div className={styles.tools}>
      <label className={styles.search}>
        {t`Find a project`}
        <input
          className={styles.control}
          onChange={(event) => {
            onQuery(event.target.value)
          }}
          type="search"
          value={query}
        />
      </label>
      <label className={styles.field}>
        {t`Registry`}
        <select
          className={styles.control}
          onChange={(event) => {
            onFilter(projectFilter(event.target.value))
          }}
          value={unavailable && filter === "github" ? "all" : filter}
        >
          <option value="all">{t`All projects`}</option>
          <option value="npm">npm</option>
          <option value="crates">crates.io</option>
          <option disabled={unavailable} value="github">{t`GitHub only`}</option>
        </select>
      </label>
      <label className={styles.field}>
        {t`Sort by`}
        <select
          className={styles.control}
          onChange={(event) => {
            onSort(projectSort(event.target.value))
          }}
          value={sort}
        >
          <option value="stars">{t`Most stars`}</option>
          <option value="activity">{t`Latest push`}</option>
          <option value="name">{t`Name`}</option>
        </select>
      </label>
    </div>
  )
}
function ProjectHead({
  hasUsage,
  sort,
}: {
  readonly hasUsage: boolean
  readonly sort: ProjectSort
}): ReactElement {
  return (
    <thead>
      <tr>
        <th aria-sort={sort === "name" ? "ascending" : undefined} scope="col">{t`Project`}</th>
        <th scope="col">{t`Latest version`}</th>
        <th scope="col">{t`Version source`}</th>
        <th className={styles.languageColumn} scope="col">{t`Primary language`}</th>
        <th
          aria-sort={sort === "stars" ? "descending" : undefined}
          className={styles.numeric}
          scope="col"
        >{t`Stars`}</th>
        <th className={styles.numeric} scope="col">{t`npm / month`}</th>
        <th className={styles.numeric} scope="col">{t`crates.io / month`}</th>
        {hasUsage ? (
          <th className={`${styles.numeric} ${styles.usageColumn}`} scope="col">
            <a href="#usage-note">{t`Active users*`}</a>
          </th>
        ) : null}
        <th
          aria-sort={sort === "activity" ? "descending" : undefined}
          scope="col"
        >{t`Last push`}</th>
      </tr>
    </thead>
  )
}
export function Projects({
  now,
  snapshot,
}: {
  readonly now: number
  readonly snapshot: Snapshot
}): ReactElement {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<ProjectFilter>("all")
  const [sort, setSort] = useState<ProjectSort>("stars")
  const unavailable = [snapshot.sources.npm, snapshot.sources.crates].some(
    (status) => status !== "ok"
  )
  const projects = filterProjects(snapshot.projects, {
    filter: unavailable && filter === "github" ? "all" : filter,
    query,
    sort,
  })
  const hasUsage = Object.keys(snapshot.usage).length > 0
  return (
    <section aria-labelledby="projects-title" className={styles.section} id="projects">
      <div className={styles.directoryHeader}>
        <h2 className={styles.heading} id="projects-title">{t`Projects`}</h2>
        <ProjectControls
          filter={filter}
          onFilter={setFilter}
          onQuery={setQuery}
          onSort={setSort}
          query={query}
          sort={sort}
          unavailable={unavailable}
        />
      </div>
      <p className={styles.note} role="status">
        {snapshot.sources.github === "ok" ? (
          <>
            {t`Projects shown`}: {projects.length} / {snapshot.projects.length}
          </>
        ) : (
          t`GitHub data is unavailable.`
        )}
      </p>
      <p
        className={styles.scrollHint}
        id="project-scroll-hint"
      >{t`Scroll horizontally to see every column. The name column stays in view.`}</p>
      <div
        aria-describedby="project-scroll-hint"
        aria-label={t`Project metrics`}
        className={styles.tableScroll}
        role="region"
        tabIndex={0}
      >
        <table className={`${styles.table} ${styles.projectTable}`}>
          <caption className={editorial.visuallyHidden}>{t`Project metrics`}</caption>
          <ProjectHead hasUsage={hasUsage} sort={sort} />
          <tbody>
            {projects.map((project) => (
              <ProjectRow
                hasUsage={hasUsage}
                key={project.name}
                now={now}
                project={project}
                snapshot={snapshot}
              />
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 ? (
        <p className={styles.notice}>
          {snapshot.sources.github === "ok"
            ? t`No matching projects. Try another search or registry.`
            : t`Project data is unavailable. Other sources may still be connected.`}
        </p>
      ) : null}
    </section>
  )
}
