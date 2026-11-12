import { t } from "@palamedes/core/macro"

/**
 * What the tech blog is about, for the home page's lead and the descriptions
 * of the home page and the overview.
 * @returns The sentence in the page's language.
 */
export function blogLead(): string {
  return t`Notes from the two founders on how we build software: architecture, coding agents, and the open-source projects behind our products.`
}
