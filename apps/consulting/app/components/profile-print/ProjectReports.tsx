import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import { companyLogos, HIDDEN_LOGO } from "~/assets/company"

import type { Project } from "./types"

import * as editorial from "./editorial.css"
import { formatMonthRange } from "./helpers"
import * as styles from "./reports.css"

function ClientMark({ project }: { project: Project }): ReactNode {
  const logo =
    project.logo === undefined || project.logo === HIDDEN_LOGO
      ? undefined
      : companyLogos[project.logo]
  if (logo === undefined) return null
  return (
    <aside className={styles.reportAside}>
      <img alt="" className={styles.clientMark} src={logo} />
    </aside>
  )
}

function ProjectReport({ lang, project }: { lang: "de" | "en"; project: Project }): ReactNode {
  const [opening, ...rest] = project.description.split("\n\n")
  return (
    <article className={styles.report}>
      {/* Heading, client mark and first paragraph move together, so a report
          never starts with an orphaned heading at the foot of a page. The mark
          comes first in the source so the float sits beside the heading. */}
      <div className={styles.reportOpening}>
        <ClientMark project={project} />
        <header className={styles.reportHeader}>
          <h3 className={styles.reportName}>{project.title}</h3>
          <p className={styles.reportMeta}>
            {project.customer} · {project.location}
            <br />
            {project.role} · {formatMonthRange(project.startDate, project.endDate, lang)}
          </p>
        </header>
        <p className={styles.reportText}>{opening}</p>
      </div>
      {rest.map((paragraph) => (
        <p className={styles.reportText} key={paragraph}>
          {paragraph}
        </p>
      ))}
    </article>
  )
}

// Recent and selected work as project reports.
export function ProjectReports({
  lang,
  projects,
}: {
  lang: "de" | "en"
  projects: readonly Project[]
}): ReactNode {
  return (
    <section
      aria-labelledby="profile-reports"
      className={editorial.documentSection}
      data-profile-section="reports"
    >
      <h2 className={editorial.sectionTitle} id="profile-reports">
        <Trans>Project Experience</Trans>
      </h2>
      {projects.map((project) => (
        <ProjectReport key={project.id} lang={lang} project={project} />
      ))}
    </section>
  )
}
