import { isZonedTimestamp } from "@sebastian-websites/web-core"

/** Where the company sits; the footer year follows its calendar. */
export const BUILD_TIME_ZONE = "Europe/Berlin"

const MILLISECONDS = 1000

/**
 * The one build time of a run, shared by both language builds: the
 * `--build-time` option, or now to the second, as an RFC 3339 timestamp in UTC.
 *
 * @param option - The `--build-time` value, if given.
 * @param now - The current time in milliseconds, for a run without the option.
 * @returns The normalized build time.
 * @throws {TypeError} For an option that is no RFC 3339 timestamp with seconds and a zone.
 */
export function resolveBuildTime(option: string | undefined, now: number = Date.now()): string {
  if (option !== undefined && !isZonedTimestamp(option)) {
    throw new TypeError(
      `--build-time needs an RFC 3339 timestamp with seconds and a time zone: ${option}`
    )
  }
  const time =
    option === undefined
      ? new Date(Math.floor(now / MILLISECONDS) * MILLISECONDS)
      : new Date(option)
  return time.toISOString().replace(/\.000Z$/v, "Z")
}

/**
 * The calendar year of the build time where the company sits, for the footer.
 *
 * @param buildTime - The shared build time.
 * @returns The four-digit year.
 */
export function buildYear(buildTime: string): string {
  return new Intl.DateTimeFormat("en", { timeZone: BUILD_TIME_ZONE, year: "numeric" }).format(
    new Date(buildTime)
  )
}
