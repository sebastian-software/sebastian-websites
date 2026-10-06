import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, layout } from "@sebastian-websites/ui"

import commerzbank from "~/assets/clients/commerzbank-ag.svg"
import deutscheBank from "~/assets/clients/deutsche-bank-ag.svg"
import telekom from "~/assets/clients/deutsche-telekom-ag.svg"
import dws from "~/assets/clients/dws-group-gmbh-co-kgaa.svg"
import enbw from "~/assets/clients/enbw.svg"
import sbb from "~/assets/clients/schweizerische-bundesbahnen-ag.svg"
import traton from "~/assets/clients/traton-volkswagen-ag.svg"

const LOGOS = [
  { name: "Deutsche Telekom", src: telekom },
  { name: "DWS", src: dws },
  { name: "Deutsche Bank", src: deutscheBank },
  { name: "EnBW", src: enbw },
  { name: "SBB", src: sbb },
  { name: "Traton", src: traton },
  { name: "Commerzbank", src: commerzbank },
] as const

/**
 * The white strip of client marks below the hero. The logos were cleared for
 * reuse by the owners on 2026-10-06 (packages/content).
 *
 * @returns The logo strip.
 */
export function LogoBand(): ReactElement {
  return (
    <section className={blocks.band}>
      <div className={`${layout.container} ${blocks.bandInner}`}>
        <p className={`${layout.eyebrow} ${blocks.bandLabel}`}>{t`Trusted by teams at`}</p>
        <ul className={blocks.logos}>
          {LOGOS.map((logo) => (
            <li key={logo.name}>
              <img alt={logo.name} className={blocks.logo} src={logo.src} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
