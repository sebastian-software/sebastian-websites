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
