import type { ReactElement } from "ardo/react"

import mark from "./assets/ferramenta-mark.image.mdx"
import * as styles from "./FerramentaLogo.css.ts"
import { Illustration } from "./Illustration.tsx"

/**
 * Renders the Ferramenta family mark alongside its name.
 * @returns The project's logo.
 */
export function FerramentaLogo(): ReactElement {
  return (
    <span className={styles.logo}>
      <Illustration alt="" className={styles.mark} height={48} sizes="64px" src={mark} width={48} />
      Ferramenta
    </span>
  )
}
