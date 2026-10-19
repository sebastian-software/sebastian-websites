// cspell:words ferroni rybbit
import assert from "node:assert/strict"
import { describe, test } from "vitest"

import {
  filterProjects,
  packageUrl,
  parseSnapshot,
  type Usage,
  usageLabel,
} from "./metrics-model.ts"

function fixture() {
  return {
    crates: {
      ferroni: {
        downloads: 1000,
        publishedAt: "2026-10-17T00:00:00Z",
        recentDownloads: 200,
        repo: "ferroni",
        version: "3.0.0",
      },
    },
    generatedAt: "2026-10-19T09:00:00Z",
    github: {
      ferroni: { forks: 2, pushedAt: "2026-10-17T09:00:00Z", stars: 7 },
      palamedes: { forks: 1, pushedAt: "2026-10-18T09:00:00Z", stars: 20 },
      tooling: { forks: 0, pushedAt: "2026-10-16T09:00:00Z", stars: 0 },
    },
    npm: {
      "@palamedes/cli": {
        monthlyDownloads: 100,
        publishedAt: "2026-10-18T00:00:00Z",
        repo: "palamedes",
        version: "1.0.0",
      },
      "unlinked-package": {
        monthlyDownloads: 250,
        publishedAt: "2026-10-01T00:00:00Z",
        version: "2.0.0",
      },
    },
    schema: 1,
    skills: { instructionPacks: 3, skills: { "effective-web": { references: 146 } } },
    sources: { crates: "ok", github: "ok", npm: "ok", releases: "skipped", skills: "ok" },
  }
}

describe("public metrics", () => {
  test("the current snapshot works without optional analytics and joins packages only through their declared repository", () => {
    const snapshot = parseSnapshot(fixture())
    assert.equal(snapshot.sources.rybbit, "skipped")
    assert.equal(Object.keys(snapshot.usage).length, 0)
    assert.equal(
      snapshot.projects.find((project) => project.name === "palamedes")?.packages[0].name,
      "@palamedes/cli"
    )
    assert.equal(
      snapshot.projects.find((project) => project.name === "ferroni")?.packages[0].downloads,
      1000
    )
    assert.equal(
      snapshot.packages.length,
      3,
      "unlinked packages remain in the package directory and totals"
    )
    assert.equal(snapshot.projects.flatMap((project) => project.packages).length, 2)
    assert.equal(snapshot.packages.find((pkg) => pkg.registry === "crates")?.recentDownloads, 200)
    assert.equal(snapshot.projects[0].release, undefined)
    assert.deepEqual(snapshot.skills, [{ name: "effective-web", references: 146 }])
  })

  test("failed sources remain unavailable even if their payload contains numbers", () => {
    const input = fixture()
    input.sources.npm = "error"
    input.sources.github = "error"
    const snapshot = parseSnapshot(input)
    assert.equal(snapshot.sources.npm, "error")
    assert.equal(snapshot.projects.length, 0)
    assert.equal(
      snapshot.packages.some((pkg) => pkg.registry === "npm"),
      false
    )
    assert.equal(snapshot.packages[0].registry, "crates")
  })

  test("project search includes package names, filters registries, and sorts without changing source order", () => {
    const { projects } = parseSnapshot(fixture())
    assert.deepEqual(
      filterProjects(projects, { filter: "all", query: " @PALAMEDES/CLI ", sort: "stars" }).map(
        (project) => project.name
      ),
      ["palamedes"]
    )
    assert.deepEqual(
      filterProjects(projects, { filter: "crates", query: "", sort: "stars" }).map(
        (project) => project.name
      ),
      ["ferroni"]
    )
    assert.deepEqual(
      filterProjects(projects, { filter: "github", query: "", sort: "name" }).map(
        (project) => project.name
      ),
      ["tooling"]
    )
    assert.deepEqual(
      filterProjects(projects, { filter: "all", query: "", sort: "activity" }).map(
        (project) => project.name
      ),
      ["palamedes", "ferroni", "tooling"]
    )
    assert.deepEqual(
      projects.map((project) => project.name),
      ["ferroni", "palamedes", "tooling"]
    )
    assert.equal(
      filterProjects(projects, { filter: "all", query: "nothing-matches", sort: "name" }).length,
      0
    )
  })

  test("repository joins honor GitHub's case-insensitive names", () => {
    const input = fixture()
    input.crates.ferroni.repo = "FERRONI"
    assert.equal(
      parseSnapshot(input).projects.find((project) => project.name === "ferroni")?.packages.length,
      1
    )
  })

  test("malformed optional usage does not hide valid GitHub or registry data", () => {
    const snapshot = parseSnapshot({
      ...fixture(),
      sources: { ...fixture().sources, rybbit: "ok" },
      usage: { palamedes: { unit: "users", verified: true } },
    })
    assert.equal(snapshot.sources.rybbit, "error")
    assert.equal(Object.keys(snapshot.usage).length, 0)
    assert.equal(snapshot.projects.length, 3)
    assert.equal(snapshot.packages.length, 3)
  })

  test("invalid schemas, counts, dates and path-shaped repository names are rejected instead of rendered", () => {
    for (const input of [
      { ...fixture(), schema: 2 },
      { ...fixture(), generatedAt: "not a date" },
      { ...fixture(), github: { "../outside": fixture().github.ferroni } },
      { ...fixture(), github: { ferroni: { ...fixture().github.ferroni, stars: -1 } } },
      { ...fixture(), npm: { "../outside": fixture().npm["unlinked-package"] } },
      { ...fixture(), npm: null },
    ])
      assert.throws(() => parseSnapshot(input))
  })

  test("usage never presents unverified, incomplete or stale observations as an active-user number", () => {
    const now = Date.parse("2026-10-19T10:00:00Z")
    const usage: Usage = {
      collectedAt: "2026-10-19T09:00:00Z",
      verified: true,
      window: {
        count: 172,
        coverage: "complete",
        end: "2026-10-19T00:00:00Z",
        observedCount: 172,
        start: "2026-09-19T00:00:00Z",
      },
    }
    assert.equal(usageLabel(usage, now).text, "172")
    assert.equal(usageLabel({ ...usage, verified: false }, now).text, "Unverified")
    assert.equal(
      usageLabel(
        { ...usage, window: { ...usage.window, count: null, coverage: "unverified" } },
        now
      ).text,
      "Unverified"
    )
    assert.equal(
      usageLabel({ ...usage, window: { ...usage.window, count: null, coverage: "partial" } }, now)
        .text,
      "Partial data"
    )
    assert.equal(usageLabel(usage, now + 3 * 60 * 60 * 1000).text, "Stale")
    assert.equal(
      usageLabel({ ...usage, window: { ...usage.window, count: 0, observedCount: 0 } }, now).text,
      "0"
    )
    assert.equal(usageLabel(undefined, now).text, "—")
  })

  test("registry links use fixed public hosts and encoded package path segments", () => {
    const { packages } = parseSnapshot(fixture())
    assert.equal(packageUrl(packages[0]), "https://www.npmjs.com/package/%40palamedes/cli")
    assert.equal(packageUrl(packages[2]), "https://crates.io/crates/ferroni")
  })
})
