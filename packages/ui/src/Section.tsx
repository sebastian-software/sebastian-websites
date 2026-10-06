import type { ReactElement, ReactNode } from "react"

import * as layout from "./layout.css.ts"

export type SectionTone = keyof typeof layout.sectionTone

export type SectionProps = {
  readonly children: ReactNode
  /** Continues the previous section with a shorter top. */
  readonly follow?: boolean
  readonly id?: string
  readonly tone?: SectionTone
}

/**
 * A full-width page section with its tone and the page container inside.
 *
 * @param props - Content, tone, and whether it follows on from the previous section.
 * @returns The section element.
 */
export function Section(props: SectionProps): ReactElement {
  const { children, follow = false, id, tone = "paper" } = props
  const classes = [layout.section, layout.sectionTone[tone], follow ? layout.sectionFollow : ""]
  return (
    <section className={classes.join(" ").trim()} id={id}>
      <div className={layout.container}>{children}</div>
    </section>
  )
}
