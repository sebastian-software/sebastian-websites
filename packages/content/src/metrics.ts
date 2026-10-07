import { FERRAMENTA_REPOSITORIES } from "./data/families.ts"

/** Where the metrics service publishes its hourly snapshot. */
export const METRICS_URL = "https://metrics.sebastian-software.com/v1/metrics.json"

/** A package on a registry; `repo` names the GitHub repository it is built from. */
export type RegistryPackage = {
  readonly monthlyDownloads?: number
  readonly repo?: string
  readonly version?: string
}

/** The parts of the metrics snapshot the sites read. */
export type MetricsSnapshot = {
  readonly crates?: Readonly<Record<string, RegistryPackage>>
  readonly generatedAt: string
  readonly github: Readonly<Record<string, { readonly pushedAt?: string; readonly stars: number }>>
  readonly npm: Readonly<Record<string, { readonly monthlyDownloads: number } & RegistryPackage>>
  readonly skills: {
    readonly instructionPacks: number
    readonly skills: Readonly<Record<string, { readonly references: number }>>
  }
}

/** The activity of one repository, with the registry packages built from it. */
export type RepositoryActivity = {
  readonly packages: ReadonlyArray<{ readonly name: string; readonly registry: "crates" | "npm" }>
  /** The last push; absent when the service did not report it, which means unknown. */
  readonly pushedAt?: string
  readonly stars?: number
}

/** Repository activity keyed by repository name, as of one snapshot. */
export type ActivityProjection = {
  readonly generatedAt: string
  /** A repository the snapshot does not list is unknown, not inactive. */
  readonly repositories: Readonly<Record<string, RepositoryActivity | undefined>>
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

function registryPackages(
  registry: "crates" | "npm",
  entries: Readonly<Record<string, RegistryPackage>> | undefined
): ReadonlyArray<{
  readonly name: string
  readonly registry: "crates" | "npm"
  readonly repo: string
}> {
  return Object.entries(entries ?? {}).flatMap(([name, entry]) =>
    entry.repo === undefined ? [] : [{ name, registry, repo: entry.repo }]
  )
}

/**
 * Projects the snapshot onto repositories: each GitHub repository keeps its push
 * date and stars, and npm or crates packages join it through their `repo`
 * field. Packages never create repositories of their own, so one repository
 * stays one entry however many packages it publishes.
 *
 * @param snapshot - The metrics service's JSON document.
 * @returns Activity per repository.
 */
export function projectActivity(snapshot: MetricsSnapshot): ActivityProjection {
  const packages = [
    ...registryPackages("npm", snapshot.npm),
    ...registryPackages("crates", snapshot.crates),
  ]
  const repositories = Object.fromEntries(
    Object.entries(snapshot.github).map(([repo, entry]) => [
      repo,
      {
        packages: packages
          .filter((item) => item.repo === repo)
          .map(({ name, registry }) => ({ name, registry })),
        ...(entry.pushedAt === undefined ? {} : { pushedAt: entry.pushedAt }),
        stars: entry.stars,
      },
    ])
  )
  return { generatedAt: snapshot.generatedAt, repositories }
}

/**
 * Fetches the live snapshot and projects repository activity.
 *
 * @param fetchImpl - The fetch function, injectable for tests.
 * @returns Activity per repository.
 */
export async function fetchActivity(fetchImpl: typeof fetch = fetch): Promise<ActivityProjection> {
  return projectActivity(await fetchSnapshot(fetchImpl))
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
  return summarizeMetrics(await fetchSnapshot(fetchImpl))
}

async function fetchSnapshot(fetchImpl: typeof fetch): Promise<MetricsSnapshot> {
  const response = await fetchImpl(METRICS_URL)
  if (!response.ok) {
    throw new Error(`Metrics service answered ${response.status}.`)
  }
  const snapshot: unknown = await response.json()
  if (!isMetricsSnapshot(snapshot)) {
    throw new Error("Metrics service answered with an unexpected document.")
  }
  return snapshot
}
