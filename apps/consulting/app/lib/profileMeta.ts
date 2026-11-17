import { t } from "@palamedes/core/macro"

/**
 * Describe the two consultants in the active domain language.
 * @returns Distinct descriptions matching the visible professional profiles.
 */
export function profileDescriptions(): Readonly<Record<"fastner" | "werner", string>> {
  return {
    fastner: t`Full-stack development, frontend architecture, and internationalization with Sebastian Fastner. Experience in investment platforms, multi-brand commerce, and SaaS products.`,
    werner: t`Frontend architecture, developer experience, and code quality with Sebastian Werner. Project experience in enterprise platforms, internationalization, and shared frontend foundations.`,
  }
}
