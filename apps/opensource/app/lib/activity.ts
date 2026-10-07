import {
  type ActivityProjection,
  fetchActivity,
  type RepositoryActivity,
} from "@sebastian-websites/content"

import snapshot from "~/data/activity-snapshot.json"

/** Where the numbers on the page came from. */
export type ActivitySource = "live" | "snapshot"

export type LoadedActivity = {
  readonly activity: ActivityProjection
  readonly source: ActivitySource
}

function fromJson(document: typeof snapshot): ActivityProjection {
  const repositories: Record<string, RepositoryActivity> = {}
  for (const [repo, entry] of Object.entries(document.repositories)) {
    repositories[repo] = {
      ...entry,
      packages: entry.packages.map((item) => ({
        name: item.name,
        registry: item.registry === "crates" ? "crates" : "npm",
      })),
    }
  }
  return { generatedAt: document.generatedAt, repositories }
}

/** The last complete projection, committed with the site (ADR-0005). */
export const ACTIVITY_SNAPSHOT: ActivityProjection = fromJson(snapshot)

/**
 * Loads repository activity at build time. When the metrics service fails, the
 * page keeps its last complete display from the committed snapshot instead of
 * hiding projects. A live answer that misses a repository keeps that
 * repository's last known activity; dates nobody reported stay unknown.
 *
 * @param load - The live loader, injectable for tests.
 * @param fallback - The last complete projection.
 * @returns The activity and whether it is live or the fallback snapshot.
 */
export async function loadActivity(
  load: () => Promise<ActivityProjection> = fetchActivity,
  fallback: ActivityProjection = ACTIVITY_SNAPSHOT
): Promise<LoadedActivity> {
  try {
    const live = await load()
    return {
      activity: {
        generatedAt: live.generatedAt,
        repositories: { ...fallback.repositories, ...live.repositories },
      },
      source: "live",
    }
  } catch (error) {
    console.warn(
      `Metrics refresh failed; rendering the snapshot of ${fallback.generatedAt}.`,
      error
    )
    return { activity: fallback, source: "snapshot" }
  }
}
