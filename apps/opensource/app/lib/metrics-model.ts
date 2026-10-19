// cspell:words rybbit
/** Public schema 1 data only; no analytics credentials or raw events. */
export const ENDPOINT = "https://metrics.sebastian-software.com/v1/metrics.json"
export const SOURCE_NAMES = {
  crates: "crates.io",
  github: "GitHub",
  npm: "npm",
  releases: "GitHub releases",
  rybbit: "CLI activity",
  skills: "Agent skills",
} as const
export const SOURCE_KEYS = ["github", "releases", "npm", "crates", "skills", "rybbit"] as const
export const MAX_SNAPSHOT_AGE_MS = 7_200_000
const USAGE_WINDOW_MS = 2_592_000_000
export type Source = keyof typeof SOURCE_NAMES
export type Status = "error" | "ok" | "skipped"
export type Package = {
  downloads: number
  downloads30Days?: { count: null | number; end: string; start: string }
  name: string
  nodeBinding?: true
  publishedAt: string
  recentDownloads?: number
  registry: "crates" | "npm"
  repo?: string
  version: string
}
export type Project = {
  forks: number
  language: null | string
  name: string
  packages: Package[]
  pushedAt: string
  release?: { publishedAt: string; tag: string; version: string }
  stars: number
}
export type Usage = {
  collectedAt: string
  verified: boolean
  window: {
    count: null | number
    coverage: string
    end: string
    observedCount: null | number
    start: string
  }
}
export type Snapshot = {
  generatedAt: string
  instructionPacks: null | number
  packages: Package[]
  projects: Project[]
  skills: Array<{ name: string; references: number }>
  sources: Record<Source, Status>
  usage: Partial<Record<string, Usage>>
}
export type ProjectFilter = "all" | "crates" | "github" | "npm"
export type ProjectSort = "activity" | "name" | "stars"

type Row = Record<string, unknown>
const record = (value: unknown): value is Row =>
  typeof value === "object" && value !== null && !Array.isArray(value)
const slug = (value: string): boolean => /^(?!\.{1,2}$)[\w.\-]{1,100}$/iv.test(value)
function text(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) throw new Error("Invalid metric text")
  return value
}
function date(value: unknown): string {
  const result = text(value)
  if (!Number.isFinite(Date.parse(result))) throw new Error("Invalid metric timestamp")
  return result
}
function count(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new Error("Invalid metric count")
  return value
}
function rows(value: unknown): Array<[string, Row]> {
  if (!record(value)) throw new Error("Missing metric data")
  return Object.entries(value).map(([name, row]) => {
    if (!record(row)) throw new Error("Invalid metric row")
    return [name, row]
  })
}
function status(value: unknown, optional = false): Status {
  if (value === "ok" || value === "error" || value === "skipped") return value
  return optional ? "skipped" : "error"
}
function packageName(name: string): boolean {
  const parts = name.split("/")
  if (parts.length > 2) return false
  if (parts.length === 2 && !/^@[\w.~\-]+$/iv.test(parts[0])) return false
  const last = parts.at(-1) ?? ""
  return /^[\w.~\-]+$/iv.test(last) && last !== "." && last !== ".."
}
function crateWindow(value: unknown, generatedAt: string): Package["downloads30Days"] {
  if (!record(value)) return undefined
  try {
    const start = date(value.start)
    const end = date(value.end)
    if (
      Date.parse(end) - Date.parse(start) !== USAGE_WINDOW_MS ||
      end !== `${new Date(generatedAt).toISOString().split("T").at(0)}T00:00:00.000Z`
    )
      return undefined
    return { count: value.count === null ? null : count(value.count), end, start }
  } catch {
    return undefined
  }
}
function packagesFrom(value: unknown, registry: "crates" | "npm", generatedAt: string): Package[] {
  return rows(value).map(([name, row]) => {
    if (!packageName(name)) throw new Error("Invalid package name")
    return {
      downloads: count(registry === "npm" ? row.monthlyDownloads : row.downloads),
      ...(registry === "crates"
        ? { downloads30Days: crateWindow(row.downloads30Days, generatedAt) }
        : {}),
      name,
      ...(registry === "npm" && row.nodeBinding === true ? { nodeBinding: true as const } : {}),
      publishedAt: date(row.publishedAt),
      registry,
      version: text(row.version),
      ...(registry === "crates" ? { recentDownloads: count(row.recentDownloads) } : {}),
      ...(typeof row.repo === "string" && slug(row.repo) ? { repo: row.repo } : {}),
    }
  })
}
function projectsFrom(value: unknown, packages: Package[], releases: Status): Project[] {
  return rows(value).map(([name, row]) => {
    if (!slug(name)) throw new Error("Invalid project name")
    const release =
      releases === "ok" && record(row.release)
        ? {
            publishedAt: date(row.release.publishedAt),
            tag: text(row.release.tag),
            version: text(row.release.version),
          }
        : undefined
    return {
      forks: count(row.forks),
      language: typeof row.language === "string" && row.language.length > 0 ? row.language : null,
      name,
      packages: packages.filter((pkg) => pkg.repo?.toLowerCase() === name.toLowerCase()),
      pushedAt: date(row.pushedAt),
      stars: count(row.stars),
      ...(release === undefined ? {} : { release }),
    }
  })
}
function usageWindow(window: Row): Usage["window"] {
  const coverage = text(window.coverage)
  if (!["complete", "partial", "unavailable", "unverified"].includes(coverage))
    throw new Error("Invalid coverage")
  const start = date(window.start)
  const end = date(window.end)
  const completeCount = window.count === null ? null : count(window.count)
  const observedCount = window.observedCount === null ? null : count(window.observedCount)
  if (Date.parse(end) - Date.parse(start) !== USAGE_WINDOW_MS)
    throw new Error("Invalid usage window")
  if (
    coverage === "complete" &&
    (completeCount === null || completeCount !== observedCount || window.observedFrom !== start)
  )
    throw new Error("Incomplete usage window")
  return { count: completeCount, coverage, end, observedCount, start }
}
function usageFrom(item: unknown): Usage {
  if (!record(item) || item.unit !== "update_checks" || typeof item.verified !== "boolean")
    throw new Error("Invalid usage data")
  if (!record(item.windows) || !record(item.windows.days30)) throw new Error("Missing usage window")
  return {
    collectedAt: date(item.collectedAt),
    verified: item.verified,
    window: usageWindow(item.windows.days30),
  }
}
function optionalUsage(
  value: unknown,
  state: Status
): { status: Status; usage: Record<string, Usage> } {
  if (state !== "ok") return { status: state, usage: {} }
  try {
    if (!record(value)) throw new Error("Missing usage data")
    return {
      status: "ok",
      usage: Object.fromEntries(Object.entries(value).map(([name, row]) => [name, usageFrom(row)])),
    }
  } catch {
    return { status: "error", usage: {} }
  }
}
function skillsFrom(value: unknown, state: Status): Pick<Snapshot, "instructionPacks" | "skills"> {
  if (state !== "ok") return { instructionPacks: null, skills: [] }
  if (!record(value)) throw new Error("Missing skills data")
  return {
    instructionPacks: count(value.instructionPacks),
    skills: rows(value.skills).map(([name, row]) => ({ name, references: count(row.references) })),
  }
}
/**
 * Validates public source data before rendering; invalid optional usage stays isolated.
 * @param value - The public JSON document.
 * @returns A serializable snapshot with source-specific units.
 */
export function parseSnapshot(value: unknown): Snapshot {
  if (!record(value) || value.schema !== 1 || !record(value.sources))
    throw new Error("Unsupported metrics snapshot")
  const input = value.sources
  const generatedAt = date(value.generatedAt)
  const sources = {
    crates: status(input.crates),
    github: status(input.github),
    npm: status(input.npm),
    releases: status(input.releases, true),
    rybbit: status(input.rybbit, true),
    skills: status(input.skills),
  }
  const packages = [
    ...(sources.npm === "ok" ? packagesFrom(value.npm, "npm", generatedAt) : []),
    ...(sources.crates === "ok" ? packagesFrom(value.crates, "crates", generatedAt) : []),
  ]
  const usage = optionalUsage(value.usage, sources.rybbit)
  return {
    generatedAt,
    packages,
    projects: sources.github === "ok" ? projectsFrom(value.github, packages, sources.releases) : [],
    ...skillsFrom(value.skills, sources.skills),
    sources: { ...sources, rybbit: usage.status },
    usage: usage.usage,
  }
}
/**
 * Sums the complete set of crate counts; a missing observation keeps the total unknown.
 * @param packages - Packages in the project or public snapshot.
 * @returns The 30-day crate total, or null when any crate has no eligible count.
 */
export function crateDownloads30Days(packages: Package[]): null | number {
  const crates = packages.filter((pkg) => pkg.registry === "crates")
  if (crates.some((pkg) => typeof pkg.downloads30Days?.count !== "number")) return null
  return crates.reduce((sum, pkg) => sum + (pkg.downloads30Days?.count ?? 0), 0)
}
/**
 * Searches package aliases and sorts a copy of the project directory.
 * @param projects - The complete directory.
 * @param options - Search text, registry filter, and sort order.
 * @param options.query - The search text.
 * @param options.filter - The registry filter.
 * @param options.sort - The ordering of matching projects.
 * @returns Matching projects without changing the source order.
 */
export function filterProjects(
  projects: Project[],
  options: { filter: ProjectFilter; query: string; sort: ProjectSort }
): Project[] {
  const search = options.query.trim().toLowerCase()
  return projects
    .filter(
      (project) =>
        (!search ||
          [project.name, ...project.packages.map((pkg) => pkg.name)].some((name) =>
            name.toLowerCase().includes(search)
          )) &&
        (options.filter === "all" ||
          (options.filter === "github"
            ? project.packages.length === 0
            : project.packages.some((pkg) => pkg.registry === options.filter)))
    )
    .sort((a, b) => {
      if (options.sort === "stars" && a.stars !== b.stars) return b.stars - a.stars
      if (options.sort === "activity") {
        const delta = Date.parse(b.pushedAt) - Date.parse(a.pushedAt)
        if (delta !== 0) return delta
      }
      return a.name.localeCompare(b.name, "en", { numeric: true })
    })
}
/**
 * Gates the activity proxy on verification, full coverage, and freshness.
 * @param usage - The optional project observation.
 * @param now - The current check time in milliseconds.
 * @returns A status or the eligible number, with its actual unit.
 */
export function usageLabel(
  usage: undefined | Usage,
  now = Date.now()
): { note: string; text: string } {
  if (usage === undefined) return { note: "No usage data", text: "—" }
  if (!usage.verified || usage.window.coverage === "unverified")
    return { note: "Verification pending", text: "Unverified" }
  if (usage.window.coverage !== "complete" || usage.window.count === null)
    return {
      note: "No complete 30-day window",
      text: usage.window.coverage === "partial" ? "Partial data" : "Unavailable",
    }
  if (now - Date.parse(usage.collectedAt) > MAX_SNAPSHOT_AGE_MS)
    return { note: "Usage snapshot is over two hours old", text: "Stale" }
  return { note: "Update checks over 30 complete UTC days", text: String(usage.window.count) }
}
/**
 * Builds a fixed-host repository link from a validated name.
 * @param name - The repository slug.
 * @returns The public repository URL.
 */
export const repoUrl = (name: string): string =>
  `https://github.com/sebastian-software/${encodeURIComponent(name)}`
/**
 * Builds a fixed-host registry URL with encoded path segments.
 * @param pkg - The validated package.
 * @returns The package's registry URL.
 */
export const packageUrl = (pkg: Package): string =>
  pkg.registry === "crates"
    ? `https://crates.io/crates/${encodeURIComponent(pkg.name)}`
    : `https://www.npmjs.com/package/${pkg.name
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/")}`
