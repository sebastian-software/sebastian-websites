import { useCallback, useEffect, useRef, useState } from "react"

import type { Snapshot } from "./metrics-model"

import { fetchMetrics, METRICS_TIMEOUT_MS } from "./metrics"

const METRICS_REFRESH_MS = 300_000

/**
 * Keeps the build snapshot until a successful refresh, and cancels work on navigation.
 * @param initial - The build-time snapshot.
 * @returns The current snapshot and refresh state.
 */
export function useMetrics(initial: Snapshot): {
  failed: boolean
  loading: boolean
  now: number
  refresh: () => Promise<void>
  snapshot: Snapshot
} {
  const [snapshot, setSnapshot] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [now, setNow] = useState(Date.parse(initial.generatedAt))
  const requestRef = useRef<AbortController | null>(null)
  const refresh = useCallback(async () => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true)
    setFailed(false)
    setNow(Date.now())
    try {
      const next = await fetchMetrics(
        AbortSignal.any([controller.signal, AbortSignal.timeout(METRICS_TIMEOUT_MS)])
      )
      if (!controller.signal.aborted) setSnapshot(next)
    } catch {
      if (!controller.signal.aborted) setFailed(true)
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setLoading(false)
      }
    }
  }, [])
  useEffect(() => {
    void refresh()
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh()
    }, METRICS_REFRESH_MS)
    return () => {
      clearInterval(timer)
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [refresh])
  return { failed, loading, now, refresh, snapshot }
}
