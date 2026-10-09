import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import { cn } from "~/lib/utilities"

import type { Project } from "./types"

import * as editorial from "./editorial.css"
import { formatPeriod } from "./helpers"
import * as styles from "./reports.css"

// Earlier engagements as a compact archive: period, client, role and project, newest first.
export function EarlierExperience({ projects }: { projects: readonly Project[] }): ReactNode {
  const entries = projects.toSorted(
    (left, right) => right.startDate.getTime() - left.startDate.getTime()
  )
  return (
    <section
      aria-labelledby="profile-archive"
      className={cn(editorial.documentSection, styles.archive)}
      data-profile-section="archive"
    >
      <h2 className={editorial.sectionTitle} id="profile-archive">
        <Trans>Additional Projects</Trans>
      </h2>
      <ol className={styles.archiveList}>
        {entries.map((project) => (
          <li className={styles.archiveEntry} key={project.id}>
            <span className={styles.archivePeriod}>
              {formatPeriod(project.startDate, project.endDate)}
            </span>
            <div>
              <h3 className={styles.archiveHeading}>
                {project.customer} <span className={styles.archiveRole}>· {project.role}</span>
              </h3>
              <p className={styles.archiveText}>{project.title}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
