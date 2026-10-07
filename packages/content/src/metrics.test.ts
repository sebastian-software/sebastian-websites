import { describe, expect, it } from "vitest"

import { type MetricsSnapshot, projectActivity, summarizeMetrics } from "./metrics.ts"

const snapshot: MetricsSnapshot = {
  generatedAt: "2026-10-06T16:36:03Z",
  github: {
    ardo: { stars: 1 },
    ferromark: { stars: 9 },
    ferroni: { stars: 8 },
    "xlsx-format": { stars: 2 },
  },
  npm: {
    ardo: { monthlyDownloads: 6822 },
    "pofile-ts": { monthlyDownloads: 1_848_337 },
  },
  skills: {
    instructionPacks: 2,
    skills: {
      "effective-web": { references: 137 },
      "effective-writing": { references: 31 },
    },
  },
}

describe("summarizeMetrics", () => {
  it("counts repositories, the curated Ferramenta members, downloads, and skill references", () => {
    expect(summarizeMetrics(snapshot)).toStrictEqual({
      ferramentaProjects: 3,
      generatedAt: "2026-10-06T16:36:03Z",
      npmMonthlyDownloads: 1_855_159,
      repositories: 4,
      skillReferences: 168,
      skills: 2,
    })
  })
})

describe("projectActivity", () => {
  it("joins registry packages to their repository without adding repositories", () => {
    const projection = projectActivity({
      ...snapshot,
      crates: {
        ferralk: { repo: "ferralk", version: "1.1.0" },
        "ferralk-glob": { repo: "ferralk", version: "1.1.0" },
        orphan: { version: "0.1.0" },
      },
      github: {
        ferralk: { pushedAt: "2026-09-25T08:10:53Z", stars: 3 },
        "xlsx-format": { stars: 2 },
      },
      npm: {
        "pofile-ts": { monthlyDownloads: 1, repo: "pofile-ts" },
        "xlsx-format": { monthlyDownloads: 13_924, repo: "xlsx-format" },
      },
    })
    expect(Object.keys(projection.repositories)).toStrictEqual(["ferralk", "xlsx-format"])
    expect(projection.repositories.ferralk).toStrictEqual({
      packages: [
        { name: "ferralk", registry: "crates" },
        { name: "ferralk-glob", registry: "crates" },
      ],
      pushedAt: "2026-09-25T08:10:53Z",
      stars: 3,
    })
    expect(projection.repositories["xlsx-format"]).toStrictEqual({
      packages: [{ name: "xlsx-format", registry: "npm" }],
      stars: 2,
    })
  })
})
