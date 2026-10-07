import type { ComponentPropsWithRef, ReactElement } from "react"

import { Arrow } from "./Arrow.tsx"
import * as styles from "./editorial.css.ts"

export type ArrowLinkProps = {
  readonly direction?: "forward" | "outward"
  /** Draws a thin underline in the link color, as on the project pages. */
  readonly underline?: boolean
} & ComponentPropsWithRef<"a">

/**
 * An inline editorial action such as "Explore Terminaro →". Native anchor
 * attributes, refs, and events pass through.
 *
 * @param props - The anchor attributes, the arrow direction, and the underline.
 * @returns The link with its trailing arrow.
 */
export function ArrowLink(props: ArrowLinkProps): ReactElement {
  const { children, className, direction = "forward", underline = false, ...rest } = props
  const classes = [styles.arrowLink, underline ? styles.arrowLinkUnderlined : "", className ?? ""]
  return (
    <a {...rest} className={classes.filter(Boolean).join(" ")}>
      <span>{children}</span>
      <Arrow className={styles.arrow} direction={direction} />
    </a>
  )
}
