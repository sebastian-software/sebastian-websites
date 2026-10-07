import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { Consultant } from "./types"

import * as styles from "../ProfilePrintV2.css"
import { formatList } from "./helpers"

function detail(label: ReactNode, value: ReactNode): ReactNode {
  return (
    <>
      <dt className={styles.detailsLabel}>{label}</dt>
      <dd className={styles.detailsValue}>{value}</dd>
    </>
  )
}

export function PersonalDetails({
  consultant,
  lang,
}: {
  consultant: Consultant
  lang: "de" | "en"
}): ReactNode {
  return (
    <section>
      <h2 className={styles.sectionHeading}>
        <Trans>Personal Details</Trans>
      </h2>
      <dl className={styles.detailsGrid}>
        {detail(<Trans>Location</Trans>, consultant.location)}
        {consultant.workPreferences?.preferredRegion === undefined
          ? null
          : detail(<Trans>Work Model</Trans>, consultant.workPreferences.preferredRegion)}
        {detail(<Trans>Languages</Trans>, formatList(consultant.languages, lang))}
        {consultant.citizenship === undefined
          ? null
          : detail(<Trans>Citizenship</Trans>, consultant.citizenship)}
        {detail(
          <Trans>Contact</Trans>,
          <a className={styles.link} href={`mailto:${consultant.email}`}>
            {consultant.email}
          </a>
        )}
        {consultant.phone === undefined
          ? null
          : detail(
              <Trans>Phone</Trans>,
              <a className={styles.link} href={`tel:${consultant.phone.replaceAll(/\s/gv, "")}`}>
                {consultant.phone}
              </a>
            )}
      </dl>
    </section>
  )
}
