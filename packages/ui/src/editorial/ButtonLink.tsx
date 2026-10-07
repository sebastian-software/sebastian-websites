import type { ComponentPropsWithRef, ReactElement } from "react"

import { Arrow } from "./Arrow.tsx"
import * as styles from "./editorial.css.ts"

/**
 * The page's primary action as a filled link with a trailing arrow, such as
 * "Book an intro call →". Native anchor attributes, refs, and events pass through.
 *
 * @param props - The anchor attributes.
 * @returns The filled link.
 */
export function ButtonLink(props: ComponentPropsWithRef<"a">): ReactElement {
  const { children, className, ...rest } = props
  return (
    <a
      {...rest}
      className={className === undefined ? styles.button : `${styles.button} ${className}`}
    >
      <span>{children}</span>
      <Arrow className={styles.arrow} />
    </a>
  )
}
