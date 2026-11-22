import type { ReactElement } from "ardo/react"

import agoros from "./assets/kerameikos/agoros.svg"
import palamedes from "./assets/kerameikos/palamedes.svg"
import terminaro from "./assets/kerameikos/terminaro.svg"
import styles from "./KerameikosLogo.module.css"

const marks = {
  Palamedes: palamedes,
  "Palamedes+": palamedes,
  Terminaro: terminaro,
  VorOrt: agoros,
}
export type KerameikosName = keyof typeof marks

/**
 * Combines the family's small-format emblem with its live wordmark.
 * @param props - The public product name.
 * @param props.name - The name paired with its emblem.
 * @returns The product identity at the surrounding text size.
 */
export function KerameikosLogo(props: { readonly name: KerameikosName }): ReactElement {
  return (
    <span className={styles.logo}>
      <img alt="" className={styles.mark} height={48} src={marks[props.name]} width={48} />
      {props.name}
    </span>
  )
}
