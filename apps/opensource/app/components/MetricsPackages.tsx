import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { editorial } from "@sebastian-websites/ui"
import { useState } from "react"

import { type Package, packageUrl, repoUrl, type Snapshot } from "~/lib/metrics-model"
import { variant } from "~/lib/site"

import * as styles from "./Metrics.css"
import { MetricNumber } from "./MetricsSummary"
import { DateValue } from "./MetricsValues"

const PACKAGE_PAGE_SIZE = 12
function PackageRow({ pkg }: { readonly pkg: Package }): ReactElement {
  return (
    <tr>
      <td>
        <a href={packageUrl(pkg)}>{pkg.name}</a>
        <span className={styles.small}>
          v{pkg.version}
          {pkg.repo === undefined ? null : (
            <>
              {" "}
              · <a href={repoUrl(pkg.repo)}>{pkg.repo}</a>
            </>
          )}
        </span>
      </td>
      <td className={styles.secondary}>v{pkg.version}</td>
      <td className={styles.numeric}>
        <MetricNumber value={pkg.downloads} />
      </td>
      <td className={styles.secondary}>
        <DateValue value={pkg.publishedAt} />
      </td>
    </tr>
  )
}
function PackageControls({
  onQuery,
  onRegistry,
  query,
  registry,
}: {
  readonly onQuery: (value: string) => void
  readonly onRegistry: (value: "crates" | "npm") => void
  readonly query: string
  readonly registry: "crates" | "npm"
}): ReactElement {
  return (
    <div className={styles.tools}>
      <label className={styles.search}>
        {t`Find a package`}
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
        {t`Package registry`}
        <select
          className={styles.control}
          onChange={(event) => {
            onRegistry(event.target.value === "crates" ? "crates" : "npm")
          }}
          value={registry}
        >
          <option value="npm">npm</option>
          <option value="crates">crates.io</option>
        </select>
      </label>
    </div>
  )
}
export function Packages({ snapshot }: { readonly snapshot: Snapshot }): ReactElement {
  const [query, setQuery] = useState("")
  const [registry, setRegistry] = useState<"crates" | "npm">("npm")
  const [page, setPage] = useState(0)
  const packages = snapshot.packages
    .filter(
      (pkg) =>
        pkg.registry === registry &&
        [pkg.name, pkg.repo ?? ""].some((name) =>
          name
            .toLocaleLowerCase(variant.locale)
            .includes(query.trim().toLocaleLowerCase(variant.locale))
        )
    )
    .sort((a, b) => b.downloads - a.downloads || a.name.localeCompare(b.name))
  const current = Math.min(page, Math.max(0, Math.ceil(packages.length / PACKAGE_PAGE_SIZE) - 1))
  return (
    <section aria-labelledby="packages-title" className={styles.section} id="packages">
      <h2 className={styles.heading} id="packages-title">{t`Package directory`}</h2>
      <p>{t`Every published package, including packages without a listed project.`}</p>
      <PackageControls
        onQuery={(value) => {
          setQuery(value)
          setPage(0)
        }}
        onRegistry={(value) => {
          setRegistry(value)
          setPage(0)
        }}
        query={query}
        registry={registry}
      />
      <p className={styles.note} role="status">
        {snapshot.sources[registry] === "ok" ? (
          <>
            {t`Packages found`}: {packages.length}
          </>
        ) : (
          t`Registry data is unavailable.`
        )}
      </p>
      <table className={styles.table}>
        <caption className={editorial.visuallyHidden}>{t`Package metrics`}</caption>
        <thead>
          <tr>
            <th scope="col">{t`Package`}</th>
            <th className={styles.secondary} scope="col">{t`Version`}</th>
            <th className={styles.numeric} scope="col">
              {registry === "npm" ? t`Monthly downloads` : t`All-time downloads`}
            </th>
            <th className={styles.secondary} scope="col">{t`Published`}</th>
          </tr>
        </thead>
        <tbody>
          {packages
            .slice(current * PACKAGE_PAGE_SIZE, current * PACKAGE_PAGE_SIZE + PACKAGE_PAGE_SIZE)
            .map((pkg) => (
              <PackageRow key={pkg.name} pkg={pkg} />
            ))}
        </tbody>
      </table>
      {packages.length === 0 ? (
        <p className={styles.notice}>
          {snapshot.sources[registry] === "ok"
            ? t`No matching packages. Try another search or registry.`
            : t`Registry data is unavailable.`}
        </p>
      ) : null}
      <div className={styles.toolbar}>
        <p className={styles.note}>
          {packages.length > 0
            ? `${current * PACKAGE_PAGE_SIZE + 1}–${Math.min(current * PACKAGE_PAGE_SIZE + PACKAGE_PAGE_SIZE, packages.length)} / ${packages.length}`
            : "0"}
        </p>
        <div className={styles.tools}>
          <button
            className={styles.button}
            disabled={current === 0}
            onClick={() => {
              setPage(current - 1)
            }}
            type="button"
          >{t`Previous`}</button>
          <button
            className={styles.button}
            disabled={(current + 1) * PACKAGE_PAGE_SIZE >= packages.length}
            onClick={() => {
              setPage(current + 1)
            }}
            type="button"
          >{t`Next`}</button>
        </div>
      </div>
    </section>
  )
}
