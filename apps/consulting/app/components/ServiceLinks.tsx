import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"

import { SERVICE_PATHS } from "~/data/services"

import * as styles from "./profile-screen/profileScreen.css.ts"

/**
 * Relevant service destinations beside the profiles, outside the printed document.
 * @returns Links to the three focused services.
 */
export function ServiceLinks(): ReactElement {
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
      </ul>
    </div>
  )
}
