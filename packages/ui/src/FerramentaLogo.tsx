import type { ReactElement } from "ardo/react"

import mark from "./assets/ferramenta-mark.webp?bunny"
import { BunnyImage } from "./BunnyImage.tsx"
import * as styles from "./FerramentaLogo.css.ts"

/**
 * Renders the Ferramenta family mark alongside its name.
 * @returns The project's logo.
 */
export function FerramentaLogo(): ReactElement {
  return (
    <span className={styles.logo}>
      <BunnyImage alt="" className={styles.mark} height={48} sizes="64px" src={mark} width={48} />
      Ferramenta
    </span>
  )
}
