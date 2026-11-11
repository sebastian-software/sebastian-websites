import type { ProfileMarkdown } from "~/components/werner-profile/MarkdownContent"

import SummaryDe from "~/content/werner/de/executive-summary.mdx"
import HistoryDe from "~/content/werner/de/project-history.mdx"
import SummaryEn from "~/content/werner/en/executive-summary.mdx"
import HistoryEn from "~/content/werner/en/project-history.mdx"

/**
 * Select one domain language before bundling; the other documents are removed.
 * @returns The profile documents compiled by Ardo.
 */
export function getWernerProfileContent(): {
  executiveSummary: ProfileMarkdown
  projectHistory: ProfileMarkdown
} {
  return __SITE_VARIANT__ === "consulting-de"
    ? { executiveSummary: SummaryDe, projectHistory: HistoryDe }
    : { executiveSummary: SummaryEn, projectHistory: HistoryEn }
}
