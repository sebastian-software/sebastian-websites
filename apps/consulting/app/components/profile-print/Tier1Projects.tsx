import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import { companyLogos, HIDDEN_LOGO } from "~/assets/company"

import type { Project } from "./types"

import * as styles from "../ProfilePrintV2.css"
import { formatDateRange } from "./helpers"

function ProjectLogo({
  customer,
  logo,
}: {
  customer: string
  logo: string | undefined
}): ReactNode {
  if (logo === HIDDEN_LOGO) return null
  if (logo !== undefined && logo in companyLogos) {
    return <img alt={customer} className={styles.projectLogo} src={companyLogos[logo]} />
  }
  return (
    <div className={styles.projectLogoPlaceholder}>
      <Trans>Logo</Trans>
    </div>
  )
}

export function Tier1Projects({ projects }: { projects: Project[] }): ReactNode {
  return (
    <section className={styles.projectTier1}>
      <h2 className={styles.sectionHeading}>
        <Trans>Project Experience</Trans>
      </h2>

      {projects.map((project) => (
        <article className={styles.projectTier1Article} key={project.id}>
          <div className={styles.projectLogoCell}>
            <ProjectLogo customer={project.customer} logo={project.logo} />
          </div>
          <div className={styles.projectContent}>
            <div className={styles.projectMeta}>
              {project.customer} · {project.location}
            </div>
            <div className={styles.projectHeader}>
              <span className={styles.projectRole}>{project.role}</span>
              <span className={styles.projectPeriod}>
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>
            {project.description.split("\n\n").map((paragraph) => (
              <p className={styles.projectDescription} key={paragraph}>
                {paragraph}
              </p>
            ))}
            {project.results === undefined ? null : (
              <p className={styles.projectResults}>{project.results}</p>
            )}
            <div className={styles.projectTech}>
              {project.technologies.map((tech) => (
                <span className={styles.projectTechTag} key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
