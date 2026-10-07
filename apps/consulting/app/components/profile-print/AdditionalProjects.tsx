import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { Project } from "./types"

import * as styles from "../ProfilePrintV2.css"
import { formatList, formatPeriod, MAX_DISPLAY_TECHNOLOGIES } from "./helpers"
import { LogoStrip } from "./LogoStrip"

export function AdditionalProjects({
  additionalProjects,
  lang,
  tier1Projects,
}: {
  additionalProjects: Project[]
  lang: "de" | "en"
  tier1Projects: Project[]
}): ReactNode {
  return (
    <section className={styles.projectTier2}>
      <h2 className={styles.sectionHeading}>
        <Trans>Additional Projects</Trans>
      </h2>

      <LogoStrip additionalProjects={additionalProjects} tier1Projects={tier1Projects} />

      <table className={styles.projectTier2Table}>
        <thead>
          <tr>
            <th className={styles.projectTier2Th}>
              <Trans>Period</Trans>
            </th>
            <th className={styles.projectTier2Th}>
              <Trans>Client</Trans>
            </th>
            <th className={styles.projectTier2Th}>
              <Trans>Role</Trans>
            </th>
            <th className={styles.projectTier2Th}>
              <Trans>Technologies</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {additionalProjects.map((project) => (
            <tr key={project.id}>
              <td className={styles.projectTier2TdPeriod}>
                {formatPeriod(project.startDate, project.endDate)}
              </td>
              <td className={styles.projectTier2TdCustomer}>{project.customer}</td>
              <td className={styles.projectTier2Td}>{project.role}</td>
              <td className={styles.projectTier2Td}>
                {formatList(project.technologies.slice(0, MAX_DISPLAY_TECHNOLOGIES), lang)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
