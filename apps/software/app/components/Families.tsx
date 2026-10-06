import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button, layout, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

/**
 * The open-source families as three text columns: Ferramenta, Effective, and the skills.
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
      text: t`Libraries and skills for everyday work in TypeScript projects: colors, CSS, icons, favicons, shadows, setting up a new machine. Small tools we need in every project and therefore maintain instead of rewriting them each time.`,
      title: "Effective",
    },
    {
      href: `${getSiteOrigin("skills", variant.locale)}/`,
      link: t`To the Skills site →`,
      text: t`Six skills that put our way of working into verifiable instructions, so agents work the way we would expect in a review. Expertise you can read before you install it, with results that still depend on the model.`,
      title: t`Skills for coding agents`,
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
