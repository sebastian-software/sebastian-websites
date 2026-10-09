import type { ActivityProjection } from "@sebastian-websites/content"

import { describe, expect, it, vi } from "vitest"

import { CURATED, EXCLUSIONS } from "~/data/projects"

import { ACTIVITY_SNAPSHOT, loadActivity } from "./activity.ts"
import { buildCollection, type CuratedEntry, findUncurated } from "./collection.ts"

const curated: readonly CuratedEntry[] = [
  { group: "tools", name: "Paratix", repo: "paratix" },
  { group: "tools", name: "Antigraph", repo: "antigraph" },
  { group: "tools", name: "Zeta", repo: "zeta" },
  { group: "tools", name: "Alpha", repo: "alpha" },
  { group: "libraries", name: "xlsx-format", repo: "xlsx-format" },
  { group: "libraries", name: "Undated", repo: "undated" },
]

const activity: ActivityProjection = {
  generatedAt: "2026-10-07T00:00:00Z",
  repositories: {
    alpha: { packages: [], pushedAt: "2026-08-05T16:33:41Z" },
    antigraph: { packages: [], pushedAt: "2026-08-05T16:33:41Z" },
    dalo: { packages: [{ name: "dalo", registry: "crates" }], pushedAt: "2026-10-05T00:00:00Z" },
    "effective-flow": { packages: [] },
    ferromark: { packages: [], pushedAt: "2026-10-05T00:00:00Z" },
    newcomer: { packages: [], pushedAt: "2026-10-06T00:00:00Z" },
    paratix: { packages: [], pushedAt: "2026-10-06T19:48:06Z" },
    undated: { packages: [{ name: "undated", registry: "npm" }] },
    "xlsx-format": {
      packages: [
        { name: "xlsx-format", registry: "npm" },
        { name: "xlsx-format-cli", registry: "npm" },
      ],
      pushedAt: "2026-09-14T13:52:10Z",
    },
    zeta: { packages: [] },
  },
}

const names = (groups: ReturnType<typeof buildCollection>): string[][] =>
  groups.map((group) => group.projects.map((project) => project.name))

describe("buildCollection", () => {
  it("groups the curated projects and sorts each group by the latest push", () => {
    const groups = buildCollection(curated, activity)
    expect(groups.map((group) => group.id)).toStrictEqual(["tools", "libraries"])
    expect(names(groups)).toStrictEqual([
      ["Paratix", "Alpha", "Antigraph", "Zeta"],
      ["xlsx-format", "Undated"],
    ])
  })

  it("breaks ties by name, puts unknown dates last, and keeps them unknown", () => {
    const [tools] = buildCollection(curated, activity)
    expect(tools.projects.slice(1).map((project) => project.pushedAt)).toStrictEqual([
      "2026-08-05T16:33:41Z",
      "2026-08-05T16:33:41Z",
      undefined,
    ])
  })

  it("shows each repository once, however many packages it publishes", () => {
    const groups = buildCollection([...curated, curated[4]], activity)
    const repos = groups.flatMap((group) => group.projects.map((project) => project.repo))
    expect(repos.filter((repo) => repo === "xlsx-format")).toHaveLength(1)
    expect(repos).toHaveLength(curated.length)
  })

  it("keeps every curated project when the activity is empty", () => {
    const groups = buildCollection(curated, { generatedAt: "", repositories: {} })
    expect(groups.flatMap((group) => group.projects)).toHaveLength(curated.length)
  })
})

describe("findUncurated", () => {
  it("reports new repositories but not featured, family, or withheld ones", () => {
    const exclusions = { family: ["ferromark"], featured: ["dalo"], withheld: ["effective-flow"] }
    expect(findUncurated(curated, exclusions, activity)).toStrictEqual(["newcomer"])
  })
})

describe("loadActivity", () => {
  it("falls back to the last complete snapshot when the refresh fails", async () => {
    const warn = vi.spyOn(console, "warn").mockReturnValue(undefined)
    const loaded = await loadActivity(
      vi.fn<() => Promise<ActivityProjection>>().mockRejectedValue(new Error("offline"))
    )
    expect(loaded).toStrictEqual({ activity: ACTIVITY_SNAPSHOT, source: "snapshot" })
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it("keeps last known activity for repositories a live answer misses", async () => {
    const fallback = activity
    const loaded = await loadActivity(
      vi.fn<() => Promise<ActivityProjection>>().mockResolvedValue({
        generatedAt: "2026-10-08T00:00:00Z",
        repositories: { paratix: { packages: [], pushedAt: "2026-10-08T00:00:00Z" } },
      }),
      fallback
    )
    expect(loaded.source).toBe("live")
    expect(loaded.activity.repositories.paratix?.pushedAt).toBe("2026-10-08T00:00:00Z")
    expect(loaded.activity.repositories.antigraph?.pushedAt).toBe("2026-08-05T16:33:41Z")
  })

  it("ships a snapshot that covers every curated repository", () => {
    for (const repo of ["paratix", "relanto", "naos-ui", "pdfium-node"]) {
      expect(ACTIVITY_SNAPSHOT.repositories[repo]?.pushedAt).toBeTypeOf("string")
    }
  })
})

describe("the curated collection", () => {
  it("places nine tools and four libraries and accounts for every known repository", () => {
    const groups = buildCollection(CURATED, ACTIVITY_SNAPSHOT)
    expect(groups.map((group) => group.projects.length)).toStrictEqual([9, 4])
    expect(findUncurated(CURATED, EXCLUSIONS, ACTIVITY_SNAPSHOT)).toStrictEqual([])
  })

  it("keeps Ferramenta engines, featured projects, and withheld repositories off the tiles", () => {
    const tiles = new Set<string>(CURATED.map((project) => project.repo))
    for (const repo of [...EXCLUSIONS.family, ...EXCLUSIONS.featured, ...EXCLUSIONS.withheld]) {
      expect(tiles.has(repo)).toBe(false)
    }
    expect(EXCLUSIONS.family).toContain("ferromark")
    expect(EXCLUSIONS.featured).toStrictEqual([
      "palamedes",
      "ferramenta",
      "dalo",
      "ardo",
      "effective-agent",
    ])
  })
})
