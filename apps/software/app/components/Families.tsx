import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button, layout, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

/**
 * The open-source families as three text columns: Ferramenta, the Effective
 * libraries, and Effective Agent, the skills for coding agents.
 *
 * @returns The column grid.
 */
export function Families(): ReactElement {
  const families = [
    {
      href: "https://ferramenta.dev",
      link: "ferramenta.dev →",
      text: t`Rust engines and applications for documents and text: parsing, rendering, and converting Markdown. Built because our products needed tools written in modern Rust, tested, and measurable. The family has its own site with benchmarks and comparisons.`,
      title: "Ferramenta",
    },
    {
      href: `${getSiteOrigin("opensource", variant.locale)}/`,
      link: t`To the Open Source site →`,
      text: t`Libraries for everyday work in TypeScript projects: colors, CSS, icons, favicons, shadows, setting up a new machine. Small tools we need in every project and therefore maintain instead of rewriting them each time.`,
      title: "Effective",
    },
    {
      // The Skills site is English only for now; every language links to it.
      href: `${getSiteOrigin("skills", "en")}/`,
      link: t`To the Effective Agent site →`,
      text: t`Seven skills that put our way of working into verifiable instructions for coding agents: product, web, engineering, delivery, writing, marketing, and image work. Expertise you can read before you install it, with results that still depend on the model.`,
      title: "Effective Agent",
    },
  ]
  return (
    <div className={layout.columns}>
      {families.map((family) => (
        <div className={blocks.column} key={family.title}>
          <h3 className={typography.h3}>{family.title}</h3>
          <p className={typography.textMuted}>{family.text}</p>
          <a className={`${button.ghost} ${blocks.columnLink}`} href={family.href}>
            {family.link}
          </a>
        </div>
      ))}
    </div>
  )
}
