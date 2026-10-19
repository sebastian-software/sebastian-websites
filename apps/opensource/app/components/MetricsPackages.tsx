import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { editorial } from "@sebastian-websites/ui"
import { useState } from "react"

import { type Package, packageUrl, repoUrl, type Snapshot } from "~/lib/metrics-model"
import { variant } from "~/lib/site"

import * as styles from "./Metrics.css"
import { MetricNumber } from "./MetricsSummary"
import { DateValue } from "./MetricsValues"

type Registry = "all" | "crates" | "npm"
function PackageRow({ pkg }: { readonly pkg: Package }): ReactElement {
  return (
    <tr>
      <td>
        <a href={packageUrl(pkg)}>{pkg.name}</a>
      </td>
      <td>{pkg.registry === "npm" ? "npm" : "crates.io"}</td>
      <td>{pkg.repo === undefined ? "—" : <a href={repoUrl(pkg.repo)}>{pkg.repo}</a>}</td>
      <td>v{pkg.version}</td>
      <td className={styles.numeric}>
        <MetricNumber exact value={pkg.registry === "npm" ? pkg.downloads : null} />
      </td>
      <td className={styles.numeric}>
        <MetricNumber exact value={pkg.downloads30Days?.count ?? null} />
      </td>
      <td className={styles.numeric}>
        <MetricNumber exact value={pkg.registry === "crates" ? pkg.downloads : null} />
      </td>
      <td className={styles.numeric}>
        <MetricNumber exact value={pkg.recentDownloads ?? null} />
      </td>
      <td>
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
  readonly onRegistry: (value: Registry) => void
  readonly query: string
  readonly registry: Registry
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
            onRegistry(
              event.target.value === "npm" || event.target.value === "crates"
                ? event.target.value
                : "all"
            )
          }}
          value={registry}
        >
          <option value="all">{t`All registries`}</option>
          <option value="npm">npm</option>
          <option value="crates">crates.io</option>
        </select>
      </label>
    </div>
  )
}
export function Packages({ snapshot }: { readonly snapshot: Snapshot }): ReactElement {
  const [query, setQuery] = useState("")
  const [registry, setRegistry] = useState<Registry>("all")
  const packages = snapshot.packages
    .filter(
      (pkg) =>
        (registry === "all" || pkg.registry === registry) &&
        [pkg.name, pkg.repo ?? ""].some((name) =>
          name
            .toLocaleLowerCase(variant.locale)
            .includes(query.trim().toLocaleLowerCase(variant.locale))
        )
    )
    .sort((a, b) => a.name.localeCompare(b.name, variant.locale))
  const unavailable =
    registry === "all"
      ? snapshot.sources.npm !== "ok" || snapshot.sources.crates !== "ok"
      : snapshot.sources[registry] !== "ok"
  return (
    <section aria-labelledby="packages-title" className={styles.section} id="packages">
      <div className={styles.directoryHeader}>
        <h2 className={styles.heading} id="packages-title">{t`Packages`}</h2>
        <PackageControls
          onQuery={setQuery}
          onRegistry={setRegistry}
          query={query}
          registry={registry}
        />
      </div>
      <p className={styles.note} role="status">
        {t`Packages found`}: {packages.length}
        {unavailable ? <> · {t`Registry data is unavailable.`}</> : null}
      </p>
      <p
        className={styles.scrollHint}
        id="package-scroll-hint"
      >{t`Scroll horizontally to see every column. The name column stays in view.`}</p>
      <div
        aria-describedby="package-scroll-hint"
        aria-label={t`Package metrics`}
        className={styles.tableScroll}
        role="region"
        tabIndex={0}
      >
        <table className={`${styles.table} ${styles.packageTable}`}>
          <caption className={editorial.visuallyHidden}>{t`Package metrics`}</caption>
          <thead>
            <tr>
              <th aria-sort="ascending" scope="col">{t`Package`}</th>
              <th scope="col">{t`Registry`}</th>
              <th scope="col">{t`Project`}</th>
              <th scope="col">{t`Version`}</th>
              <th className={styles.numeric} scope="col">{t`npm / month`}</th>
              <th className={styles.numeric} scope="col">{t`crates.io / 30 days`}</th>
              <th className={styles.numeric} scope="col">{t`crates.io / all time`}</th>
              <th className={styles.numeric} scope="col">{t`crates.io / 90 days`}</th>
              <th scope="col">{t`Published`}</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <PackageRow key={`${pkg.registry}/${pkg.name}`} pkg={pkg} />
            ))}
          </tbody>
        </table>
      </div>

      {packages.length === 0 ? (
        <p className={styles.notice}>
          {unavailable
            ? t`Registry data is unavailable.`
            : t`No matching packages. Try another search or registry.`}
        </p>
      ) : null}
    </section>
  )
}
