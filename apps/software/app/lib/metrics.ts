import { fetchMetricsSummary, type MetricsSummary } from "@sebastian-websites/content"

/**
 * Loads the live numbers at build time. Every page is prerendered, so the
 * loader runs once per build and the numbers refresh with each deploy
 * (ADR-0005). A failing fetch fails the build instead of publishing gaps.
 *
 * @returns The live numbers.
 */
export async function loadMetrics(): Promise<MetricsSummary> {
  return fetchMetricsSummary()
}

/**
 * Formats a count in the site's language.
 *
 * @param value - The number.
 * @param locale - The variant's language.
 * @returns The formatted number.
 */
export function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value)
}
