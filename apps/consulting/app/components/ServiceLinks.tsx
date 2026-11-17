import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"

import { SERVICE_PATHS } from "~/data/services"

import * as styles from "./profile-screen/profileScreen.css.ts"

/**
 * Relevant service destinations beside the profiles, outside the printed document.
 * @param props - The consultant whose project evidence is relevant.
 * @param props.consultant - The consultant's public profile key.
 * @returns Links to the focused services and relevant case studies.
 */
export function ServiceLinks({ consultant }: { readonly consultant: string }): ReactElement {
  return (
    <div className={styles.railModule}>
      <p className={styles.railHeading}>{t`Work with us`}</p>
      <ul>
        <li>
          <a
            className={styles.railHomeLink}
            href={SERVICE_PATHS.architecture}
          >{t`Architecture reviews`}</a>
        </li>
        <li>
          <a
            className={styles.railHomeLink}
            href={SERVICE_PATHS.modernization}
          >{t`React and TypeScript modernization`}</a>
        </li>
        <li>
          <a
            className={styles.railHomeLink}
            href={SERVICE_PATHS.internationalization}
          >{t`Internationalization consulting`}</a>
        </li>
        <li>
          <a
            className={styles.railHomeLink}
            href="/case-studies/regrello"
          >{t`Regrello case study`}</a>
        </li>
        {consultant === "werner" ? (
          <li>
            <a className={styles.railHomeLink} href="/case-studies/enbw">{t`EnBW case study`}</a>
          </li>
        ) : null}
        {consultant === "fastner" ? (
          <li>
            <a className={styles.railHomeLink} href="/case-studies/witt">{t`Witt case study`}</a>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
