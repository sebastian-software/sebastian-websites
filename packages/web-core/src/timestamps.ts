/**
 * Timestamp checks shared by the blog index, social metadata, and the hosting
 * gate. Deliberately free of imports, so `hosting/` can load it as a relative
 * source file.
 */

const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/v
const DATE_TIME_LENGTH = 19
const FRACTION = /^\.\d+$/v
const OFFSET = /^[+\-]\d{2}:\d{2}$/v
const OFFSET_LENGTH = 6

/**
 * Tells whether a value is an RFC 3339 timestamp with seconds and a time zone,
 * the form the publication accepts for post dates.
 *
 * @param value - A frontmatter or metadata value.
 * @returns Whether the value is such a timestamp.
 */
export function isZonedTimestamp(value: string): boolean {
  const zone = value.endsWith("Z") ? "Z" : value.slice(-OFFSET_LENGTH)
  const fraction = value.slice(DATE_TIME_LENGTH, value.length - zone.length)
  return (
    DATE_TIME.test(value.slice(0, DATE_TIME_LENGTH)) &&
    (fraction === "" || FRACTION.test(fraction)) &&
    (zone === "Z" || OFFSET.test(zone)) &&
    Number.isFinite(Date.parse(value))
  )
}
