import type { ComponentPropsWithRef, ReactElement } from "react"

import * as styles from "./button.css.ts"

export type ButtonLinkProps = {
  readonly size?: keyof typeof styles.size
  readonly variant?: keyof typeof styles.variant
} & ComponentPropsWithRef<"a">

/**
 * A link styled as a button for the profile rail, outro, and mobile bar, in the
 * Consulting frame's berry. Screen only; the print documents contain no buttons.
 *
 * @param props - Anchor attributes, size, and variant.
 * @returns The styled link.
 */
export function ButtonLink(props: ButtonLinkProps): ReactElement {
  const { children, className, size = "default", variant = "default", ...rest } = props
  const classes = [styles.size[size], styles.variant[variant], className ?? ""]
  return (
    <a {...rest} className={classes.filter(Boolean).join(" ")}>
      {children}
    </a>
  )
}
