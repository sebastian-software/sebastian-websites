import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

import * as styles from "./OpenFoundations.css.ts"

/**
 * The open-source foundations under the products, with the two flagship
 * projects and the way to the Open Source site.
 *
 * @returns The open foundations panel.
 */
export function OpenFoundations(): ReactElement {
  const projects = [
    {
      href: "https://github.com/sebastian-software/palamedes",
      name: "Palamedes",
      text: t`Internationalization for TypeScript applications: message extraction, catalogs, and framework adapters.`,
    },
    {
      href: "https://github.com/sebastian-software/ferramenta",
      name: "Ferramenta",
      text: t`A family of Rust-native engines and applications for documents and text.`,
    },
  ]
  return (
    <section aria-labelledby="open-foundations" className={styles.panel}>
      <div className={`${styles.column} ${styles.intro}`}>
        <h2 className={styles.title} id="open-foundations">
          {t`Open foundations`}
        </h2>
        <p className={styles.text}>
          {t`We share the tools behind our work as open source: Rust engines, TypeScript libraries, and skills for coding agents.`}
        </p>
        <p className={styles.action}>
          <ArrowLink href={`${getSiteOrigin("opensource", variant.locale)}/`}>
            {t`Explore our open source projects`}
          </ArrowLink>
        </p>
      </div>
      {projects.map((project) => (
        <div className={styles.column} key={project.name}>
          <h3 className={styles.project}>{project.name}</h3>
          <p className={styles.text}>{project.text}</p>
          <p className={styles.action}>
            <ArrowLink href={project.href}>{t`View on GitHub`}</ArrowLink>
          </p>
        </div>
      ))}
    </section>
  )
}
