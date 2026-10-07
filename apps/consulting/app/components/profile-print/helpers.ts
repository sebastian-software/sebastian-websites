import { t } from "@palamedes/core/macro"

import type { Project } from "./types"

const MONTHS_PER_QUARTER = 3
const DEFAULT_TIER1_COUNT = 3
export const MAX_DISPLAY_TECHNOLOGIES = 4
export function getCurrentQuarterYear(): string {
  const now = new Date()
  const quarter = Math.ceil((now.getMonth() + 1) / MONTHS_PER_QUARTER)
  const year = now.getFullYear()
  return `Q${String(quarter)}/${String(year)}`
}

export function formatDateRange(startDate: Date, endDate: Date | null): string {
  const startMonth = String(startDate.getMonth() + 1).padStart(2, "0")
  const startYear = String(startDate.getFullYear())

  if (endDate === null) {
    const present = t`present`
    return `${startMonth}/${startYear} – ${present}`
  }

  const endMonth = String(endDate.getMonth() + 1).padStart(2, "0")
  const endYear = String(endDate.getFullYear())

  return t`${startMonth}/${startYear} – ${endMonth}/${endYear}`
}

export function formatPeriod(startDate: Date, endDate: Date | null): string {
  const startYear = startDate.getFullYear()
  if (endDate === null) {
    const present = t`present`
    return `${String(startYear)}–${present}`
  }

  const endYear = endDate.getFullYear()
  return startYear === endYear ? String(startYear) : `${String(startYear)}–${String(endYear)}`
}

export function formatList(items: string[], lang: "de" | "en"): string {
  return new Intl.ListFormat(lang, { style: "long", type: "conjunction" }).format(items)
}

export function groupProjectsByTier(projects: Project[]): {
  additionalProjects: Project[]
  tier1Projects: Project[]
} {
  const tier1Projects = projects.filter(
    (p) => p.tier === 1 || (!p.tier && projects.indexOf(p) < DEFAULT_TIER1_COUNT)
  )
  const tier2Projects = projects.filter((p) => p.tier === 2)
  const tier3Projects = projects.filter(
    (p) =>
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- tier literal
      p.tier === 3 ||
      (!p.tier && projects.indexOf(p) >= DEFAULT_TIER1_COUNT && !tier2Projects.includes(p))
  )
  return { additionalProjects: [...tier2Projects, ...tier3Projects], tier1Projects }
}
