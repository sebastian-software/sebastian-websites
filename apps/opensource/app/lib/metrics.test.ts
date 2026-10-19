import assert from "node:assert/strict"
import { describe, test, vi } from "vitest"

import fallback from "~/data/metrics-snapshot.json"

import { loadMetrics } from "./metrics"

describe("metrics build snapshot", () => {
  test("a slow cold collection falls back before the prerender request deadline", async () => {
    const controller = new AbortController()
    const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal)
    vi.stubGlobal(
      "fetch",
      async (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => {
            reject(new Error("Build timeout"))
          })
        })
    )
    try {
      const pending = loadMetrics()
      assert.equal(timeout.mock.calls[0][0], 8000)
      controller.abort()
      const snapshot = await pending
      assert.equal(snapshot.generatedAt, fallback.generatedAt)
      assert.equal(snapshot.projects.length, Object.keys(fallback.github).length)
      assert.equal(
        snapshot.packages.filter((pkg) => pkg.registry === "crates").length,
        Object.keys(fallback.crates).length
      )
    } finally {
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
    }
  })
})
