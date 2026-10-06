import type { ReactElement, ReactNode } from "react"

import * as layout from "./layout.css.ts"
import * as typography from "./typography.css.ts"

export type SectionHeadProps = {
  readonly eyebrow: string
  readonly intro?: ReactNode
  readonly title: ReactNode
  /** The page title is an h1; every other section head is an h2. */
  readonly titleAs?: "h1" | "h2"
}

/**
 * The head of a section: the eyebrow above, the headline on the left, and the
 * introduction on the right, offset so their first lines meet.
 *
 * @param props - Eyebrow, headline, and optional introduction.
 * @returns The eyebrow and the two-column head.
 */
export function SectionHead(props: SectionHeadProps): ReactElement {
  const { eyebrow, intro, title, titleAs: Title = "h2" } = props
  return (
    <>
      <p className={layout.eyebrow}>{eyebrow}</p>
      <div className={layout.sectionHead}>
        <Title className={typography.h2}>{title}</Title>
        {intro === undefined ? null : <p className={layout.intro}>{intro}</p>}
      </div>
    </>
  )
}
