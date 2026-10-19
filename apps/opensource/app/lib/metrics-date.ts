/**
 * Formats recent publications in UTC calendar days, preserving absolute dates after 99 days.
 * @param value - The publication timestamp.
 * @param now - The shared rendering clock, also used during hydration.
 * @param locale - The page locale.
 * @returns The visible label and exact UTC timestamp for the time element.
 */
export function publicationDate(
  value: string,
  now: number,
  locale: string
): { exact: string; label: string } {
  const published = new Date(value)
  const exact = `${new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(published)} UTC`
  const day = 86_400_000
  const relativeDayLimit = 100
  const age = Math.floor(now / day) - Math.floor(published.getTime() / day)
  const label =
    age >= 0 && age < relativeDayLimit
      ? new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(age === 0 ? 0 : -age, "day")
      : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(published)
  return { exact, label }
}
