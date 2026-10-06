import { FERRAMENTA_REPOSITORIES } from "./data/families.ts"

/** Where the metrics service publishes its hourly snapshot. */
export const METRICS_URL = "https://metrics.sebastian-software.com/v1/metrics.json"

/** The parts of the metrics snapshot the sites read. */
export type MetricsSnapshot = {
  readonly generatedAt: string
  readonly github: Readonly<Record<string, { readonly stars: number }>>
  readonly npm: Readonly<Record<string, { readonly monthlyDownloads: number }>>
  readonly skills: {
    readonly instructionPacks: number
    readonly skills: Readonly<Record<string, { readonly references: number }>>
  }
}

/** The live numbers a page shows. */
export type MetricsSummary = {
  readonly ferramentaProjects: number
  readonly generatedAt: string
  readonly npmMonthlyDownloads: number
  readonly repositories: number
  readonly skillReferences: number
  readonly skills: number
}

function sum(values: Iterable<number>): number {
  let total = 0
  for (const value of values) {
    total += value
  }
  return total
}

/**
 * Reduces a metrics snapshot to the numbers the sites display. Ferramenta is
 * counted against the curated family list, so a repository the service no
 * longer lists drops out of the count.
 *
 * @param snapshot - The metrics service's JSON document.
 * @returns The live numbers.
 */
export function summarizeMetrics(snapshot: MetricsSnapshot): MetricsSummary {
  const repositories = Object.keys(snapshot.github)
  return {
    ferramentaProjects: FERRAMENTA_REPOSITORIES.filter((name) => repositories.includes(name))
      .length,
    generatedAt: snapshot.generatedAt,
    npmMonthlyDownloads: sum(Object.values(snapshot.npm).map((entry) => entry.monthlyDownloads)),
    repositories: repositories.length,
    skillReferences: sum(Object.values(snapshot.skills.skills).map((entry) => entry.references)),
    skills: Object.keys(snapshot.skills.skills).length,
  }
}

function isMetricsSnapshot(value: unknown): value is MetricsSnapshot {
  if (typeof value !== "object" || value === null) {
    return false
  }
  return "generatedAt" in value && "github" in value && "npm" in value && "skills" in value
}

/**
 * Fetches the live snapshot and summarizes it. Callers run this at build time;
 * a failing fetch throws so that a build never publishes stale or empty numbers.
 *
 * @param fetchImpl - The fetch function, injectable for tests.
 * @returns The live numbers.
 */
export async function fetchMetricsSummary(
  fetchImpl: typeof fetch = fetch
): Promise<MetricsSummary> {
  const response = await fetchImpl(METRICS_URL)
  if (!response.ok) {
    throw new Error(`Metrics service answered ${response.status}.`)
  }
  const snapshot: unknown = await response.json()
  if (!isMetricsSnapshot(snapshot)) {
    throw new Error("Metrics service answered with an unexpected document.")
  }
  return summarizeMetrics(snapshot)
}
