import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import { companyLogos } from "~/assets/company"

import * as styles from "./CompanyBand.css.ts"

/** Selected companies documented in the two published consultant profiles. */
const COMPANIES = [
  { height: 401, id: "1und1", name: "1&1", width: 401 },
  { height: 500, id: "deutschetelekom", name: "Deutsche Telekom", width: 417 },
  { height: 323, id: "dws", name: "DWS", width: 900 },
  { height: 671, id: "morgenfund", name: "MorgenFund", width: 2500 },
  { height: 17.83, id: "enbw", name: "EnBW", width: 101.53 },
  { height: 141.732, id: "witt-weiden", name: "Witt Weiden", width: 283.464 },
  { height: 333, id: "regrello", name: "Regrello", width: 1305 },
  { height: 283.5, id: "heidelberg-materials", name: "Heidelberg Materials", width: 986.5 },
] as const

/**
 * Recognizable project experience, with the original vector artwork.
 *
 * @returns A static client-logo band with links to the underlying project histories.
 */
export function CompanyBand(): ReactElement {
  return (
    <section aria-label={t`Selected project experience`} className={styles.section}>
      <div className={styles.intro}>
        <p className={styles.label}>{t`Selected project experience`}</p>
        <p
          className={styles.note}
        >{t`Companies from our consultants' project histories, including work through delivery partners.`}</p>
      </div>
      <ul className={styles.logos}>
        {COMPANIES.map((company) => (
          <li className={styles.cell} key={company.id}>
            <img
              alt={company.name}
              className={styles.logo}
              height={company.height}
              loading="lazy"
              src={companyLogos[company.id]}
              width={company.width}
            />
          </li>
        ))}
      </ul>
      <div className={styles.links}>
        <ArrowLink href="/werner">{t`Werner's project history`}</ArrowLink>
        <ArrowLink href="/fastner">{t`Fastner's project history`}</ArrowLink>
      </div>
    </section>
  )
}
