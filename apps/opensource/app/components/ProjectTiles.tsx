import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Arrow } from "@sebastian-websites/ui"

import type { Kind, Project, Runtime, Technology } from "~/data/projects"
import type { CollectionGroup, GroupId } from "~/lib/collection"

import { variant } from "~/lib/site"

import * as styles from "./ProjectTiles.css.ts"

function labels(): {
  groups: Record<GroupId, string>
  kinds: Record<Kind, string>
  runtimes: Record<Runtime, string>
  technologies: Record<Technology, string>
} {
  return {
    groups: { libraries: t`Libraries & packages`, tools: t`Tools & services` },
    kinds: {
      cli: "CLI",
      "cli-library": t`CLI + library`,
      compiler: t`Compiler`,
      configuration: t`Configuration`,
      library: t`Library`,
      service: t`Service`,
    },
    runtimes: {
      "browser-node": t`Browser + Node.js`,
      build: t`Build tooling`,
      native: t`Native`,
      "native-node": t`Native · Node.js`,
      node: "Node.js",
      "self-hosted": t`Self-hosted`,
    },
    technologies: {
      "cpp-core": t`C++ core`,
      rust: "Rust",
      "rust-core": t`Rust core`,
      typescript: "TypeScript",
    },
  }
}

const DATE = new Intl.DateTimeFormat(variant.locale, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
})

function Updated({ pushedAt }: { readonly pushedAt: string | undefined }): ReactElement {
  if (pushedAt === undefined) {
    return <span>{t`Last update unknown`}</span>
  }
  const date = DATE.format(new Date(pushedAt))
  return (
    <span>
      {t`Updated`} <time dateTime={pushedAt}>{date}</time>
    </span>
  )
}

export type ProjectTilesProps = {
  readonly groups: ReadonlyArray<CollectionGroup<Project>>
}

/**
 * Every additional project, inline and grouped: tools and services, then
 * libraries and packages, three tiles per row. Rows may stay incomplete; there
 * are no placeholders, pagination, or overlays.
 *
 * @param props - The grouped projects in display order.
 * @returns One section per group.
 */
export function ProjectTiles(props: ProjectTilesProps): ReactElement {
  const { groups } = props
  const text = labels()
  return (
    <>
      {groups.map((group) => (
        <section
          aria-labelledby={`group-${group.id}`}
          className={`${styles.group} ${styles.groupTone[group.id]}`}
          key={group.id}
        >
          <h3 className={styles.groupTitle} id={`group-${group.id}`}>
            {text.groups[group.id]}
          </h3>
          <ul className={styles.grid}>
            {group.projects.map((project) => (
              <li key={project.repo}>
                <article className={styles.tile}>
                  <h4 className={styles.name}>
                    <a
                      className={styles.link}
                      href={`https://github.com/sebastian-software/${project.repo}`}
                    >
                      {project.name}
                    </a>
                  </h4>
                  <p className={styles.description}>{project.description}</p>
                  <ul className={styles.badges}>
                    <li className={styles.badge}>{text.technologies[project.technology]}</li>
                    <li className={styles.badge}>{text.kinds[project.kind]}</li>
                  </ul>
                  <p className={styles.runtime}>{text.runtimes[project.runtime]}</p>
                  <p className={styles.updated}>
                    <Updated pushedAt={project.pushedAt} />
                    <Arrow className={styles.arrow} />
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
