// @vitest-environment happy-dom
/* eslint testing-library/no-unnecessary-act: "off" -- React DOM createRoot requires act; no Testing Library wrapper is used. */
import type { Root } from "react-dom/client"

import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"

import document from "~/data/metrics-snapshot.json"

import { ENDPOINT, parseSnapshot } from "./metrics-model"
import { useMetrics } from "./use-metrics"

describe("live metrics lifecycle", () => {
  let root: Root | undefined
  let state: ReturnType<typeof useMetrics> | undefined
  const initial = parseSnapshot(document)

  function Probe() {
    state = useMetrics(initial)
    return null
  }

  afterEach(async () => {
    await act(async () => {
      root?.unmount()
      await Promise.resolve()
    })
    vi.useRealTimers()
    vi.unstubAllGlobals()
    state = undefined
  })

  it("refreshes public aggregates, retains the successful observation after failure, and polls visible pages", async () => {
    vi.useFakeTimers()
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
    const updated = { ...document, generatedAt: "2026-10-19T10:00:00Z" }
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(updated)))
      .mockResolvedValue(new Response("Unavailable", { status: 503 }))
    vi.stubGlobal("fetch", fetchImpl)
    root = createRoot(globalThis.document.createElement("div"))
    await act(async () => {
      root?.render(<Probe />)
      await Promise.resolve()
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      ENDPOINT,
      expect.objectContaining({ cache: "no-cache", credentials: "omit", redirect: "error" })
    )
    expect(state?.snapshot.generatedAt).toBe(updated.generatedAt)
    expect(state?.failed).toBe(false)
    await act(async () => {
      await state?.refresh()
    })
    expect(state?.failed).toBe(true)
    expect(state?.snapshot.generatedAt).toBe(updated.generatedAt)
    expect(state?.snapshot.projects).toHaveLength(initial.projects.length)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300_000)
    })
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it("keeps build data when the first refresh fails and aborts an outstanding request on navigation", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error("Offline"))
      .mockImplementation(
        async () =>
          new Promise(() => {
            /* The request stays pending until navigation aborts it. */
          })
      )
    vi.stubGlobal("fetch", fetchImpl)
    root = createRoot(globalThis.document.createElement("div"))
    await act(async () => {
      root?.render(<Probe />)
      await Promise.resolve()
    })
    expect(state?.failed).toBe(true)
    expect(state?.snapshot).toBe(initial)
    await act(async () => {
      void state?.refresh()
      await Promise.resolve()
    })
    const options: RequestInit = fetchImpl.mock.calls[1][1]
    await act(async () => {
      root?.unmount()
      await Promise.resolve()
    })
    root = undefined
    expect(options.signal?.aborted).toBe(true)
  })
})
