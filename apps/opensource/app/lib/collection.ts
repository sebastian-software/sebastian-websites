import type { ActivityProjection } from "@sebastian-websites/content"

/** The two inline groups of additional projects. */
export const GROUPS = ["tools", "libraries"] as const
export type GroupId = (typeof GROUPS)[number]

/** The fields the collection needs from a curated entry. */
export type CuratedEntry = {
  readonly group: GroupId
  readonly name: string
  /** The GitHub repository name: the identity metrics and registries join on. */
  readonly repo: string
}

/** A curated entry with its activity; `pushedAt` is absent when unknown. */
export type CollectionEntry<TEntry extends CuratedEntry> = { readonly pushedAt?: string } & TEntry

export type CollectionGroup<TEntry extends CuratedEntry> = {
  readonly id: GroupId
  readonly projects: ReadonlyArray<CollectionEntry<TEntry>>
}

/** Repositories that are on the page without a tile of their own, or withheld. */
export type Exclusions = {
  /** Family members presented through their family, such as the Ferramenta engines. */
  readonly family: readonly string[]
  /** Featured projects keep their editorial stories and order. */
  readonly featured: readonly string[]
  /** Repositories the owners have not released for the site yet. */
  readonly withheld: readonly string[]
}

function byActivity(
  left: CollectionEntry<CuratedEntry>,
  right: CollectionEntry<CuratedEntry>
): number {
  if (left.pushedAt !== right.pushedAt) {
    if (left.pushedAt === undefined) return 1
    if (right.pushedAt === undefined) return -1
    return right.pushedAt.localeCompare(left.pushedAt)
  }
  return left.name.localeCompare(right.name, "en") || left.repo.localeCompare(right.repo, "en")
}

/**
 * Groups the curated additional projects and orders each group by the most
 * recent push, newest first; ties fall back to name and repository, and unknown
 * dates go last. Membership comes from curation alone: activity only orders the
 * tiles and never adds, hides, or duplicates one.
 *
 * @param curated - The curated additional projects.
 * @param activity - Repository activity from the metrics snapshot.
 * @returns Both groups in display order, each project once.
 */
export function buildCollection<TEntry extends CuratedEntry>(
  curated: readonly TEntry[],
  activity: ActivityProjection
): ReadonlyArray<CollectionGroup<TEntry>> {
  const seen = new Set<string>()
  const entries = curated.flatMap((entry): Array<CollectionEntry<TEntry>> => {
    if (seen.has(entry.repo)) return []
    seen.add(entry.repo)
    const pushedAt = activity.repositories[entry.repo]?.pushedAt
    return [pushedAt === undefined ? entry : { ...entry, pushedAt }]
  })
  return GROUPS.map((id) => ({
    id,
    projects: entries.filter((entry) => entry.group === id).toSorted(byActivity),
  }))
}

/**
 * Lists repositories the metrics service knows that neither curation nor the
 * exclusions account for, so that new projects are reported instead of being
 * published with invented metadata.
 *
 * @param curated - The curated additional projects.
 * @param exclusions - Featured, family, and withheld repositories.
 * @param activity - Repository activity from the metrics snapshot.
 * @returns The unaccounted repository names, sorted.
 */
export function findUncurated(
  curated: readonly CuratedEntry[],
  exclusions: Exclusions,
  activity: ActivityProjection
): readonly string[] {
  const known = new Set([
    ...curated.map((entry) => entry.repo),
    ...exclusions.featured,
    ...exclusions.family,
    ...exclusions.withheld,
  ])
  return Object.keys(activity.repositories)
    .filter((repo) => !known.has(repo))
    .toSorted()
}
