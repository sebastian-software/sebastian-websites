import fallback from "~/data/metrics-snapshot.json"

import { ENDPOINT, parseSnapshot, type Snapshot } from "./metrics-model"

export const METRICS_TIMEOUT_MS = 12_000

/**
 * Fetches only public aggregates. Credentials never cross this boundary.
 * @param signal - The input data.
 * @param fetchImpl - The fetch implementation.
 * @returns The validated public snapshot.
 */
export async function fetchMetrics(
  signal?: AbortSignal,
  fetchImpl: typeof fetch = fetch
): Promise<Snapshot> {
  const response = await fetchImpl(ENDPOINT, {
    cache: "no-cache",
    credentials: "omit",
    redirect: "error",
    signal: signal ?? AbortSignal.timeout(METRICS_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error("Metrics snapshot unavailable")
  return parseSnapshot(await response.json())
}

/**
 * Loads a build snapshot, retaining the committed observation on failure.
 * @returns The latest snapshot or committed fallback.
 */
export async function loadMetrics(): Promise<Snapshot> {
  try {
    return await fetchMetrics()
  } catch {
    return parseSnapshot(fallback)
  }
}
