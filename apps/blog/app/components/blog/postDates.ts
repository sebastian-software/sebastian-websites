import { variant } from "~/lib/site"

/** Posts are dated in the company's time zone, as the page's `data-palamedes-time-zone`. */
const TIME_ZONE = "Europe/Berlin"

/**
 * The calendar day of a post timestamp in the page's language, such as
 * "November 8, 2026" or "8. November 2026". Server and client format it in the
 * same time zone, so hydration sees the same text.
 * @param timestamp - An ISO timestamp from the publication.
 * @returns The formatted day.
 */
export function formatPostDay(timestamp: string): string {
  return new Intl.DateTimeFormat(variant.locale, { dateStyle: "long", timeZone: TIME_ZONE }).format(
    new Date(timestamp)
  )
}

/**
 * Whether an update falls on a later day than the publication, so it is
 * worth showing.
 * @param publishedAt - The post's publication timestamp.
 * @param updatedAt - The post's update timestamp, if any.
 * @returns Whether the update shows as its own date.
 */
export function showsUpdate(publishedAt: string, updatedAt: string | undefined): boolean {
  return updatedAt !== undefined && formatPostDay(updatedAt) !== formatPostDay(publishedAt)
}
