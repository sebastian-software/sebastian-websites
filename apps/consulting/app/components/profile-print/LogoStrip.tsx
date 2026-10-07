import type { ReactNode } from "react"

import { companyLogos, HIDDEN_LOGO } from "~/assets/company"

import type { Project } from "./types"

import * as styles from "../ProfilePrintV2.css"

export function LogoStrip({
  additionalProjects,
  tier1Projects,
}: {
  additionalProjects: Project[]
  tier1Projects: Project[]
}): ReactNode {
  const tier1Logos = new Set(
    tier1Projects.map((p) => p.logo).filter((logo): logo is string => logo !== undefined)
  )
  const uniqueLogos = [
    ...new Map(
      additionalProjects
        .filter(
          (p): p is { logo: string } & Project => p.logo !== undefined && p.logo !== HIDDEN_LOGO
        )
        .filter((p) => !tier1Logos.has(p.logo))
        .map((p) => [p.logo, { customer: p.customer, logo: p.logo }])
    ).values(),
  ]

  if (uniqueLogos.length === 0) return null

  return (
    <div className={styles.logoStrip}>
      {uniqueLogos.map(({ customer, logo }) =>
        logo in companyLogos ? (
          <img
            alt={customer}
            className={styles.logoStripItem}
            key={logo}
            src={companyLogos[logo]}
          />
        ) : (
          <span className={styles.logoStripPlaceholder} key={logo}>
            {customer.split(" ")[0]}
          </span>
        )
      )}
    </div>
  )
}
