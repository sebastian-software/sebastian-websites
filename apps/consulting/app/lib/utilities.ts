/**
 * Utility function to conditionally join class names.
 * Filters out falsy values and joins the rest with spaces.
 * @param inputs - Class name values to conditionally join.
 * @returns The joined class name string.
 */
export function cn(...inputs: Array<false | null | string | undefined>): string {
  return inputs.filter(Boolean).join(" ")
}
