import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { Skills } from "./types"

import * as styles from "../ProfilePrintV2.css"
import { getCurrentQuarterYear } from "./helpers"

export function SkillStack({ skills }: { skills: Skills }): ReactNode {
  const quarterYear = getCurrentQuarterYear()
  return (
    <section>
      <h2 className={styles.sectionHeading}>
        <Trans>My Stack ({quarterYear})</Trans>
      </h2>
      <div className={styles.stackGrid}>
        <div className={styles.stackCategory}>
          <h3 className={styles.stackCategoryHeading}>
            <Trans>Frontend</Trans>
          </h3>
          <ul className={styles.stackCategoryList}>
            {skills.frontend.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        {skills.backend && skills.backend.length > 0 ? (
          <div className={styles.stackCategory}>
            <h3 className={styles.stackCategoryHeading}>
              <Trans>Backend</Trans>
            </h3>
            <ul className={styles.stackCategoryList}>
              {skills.backend.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {skills.tools && skills.tools.length > 0 ? (
          <div className={styles.stackCategory}>
            <h3 className={styles.stackCategoryHeading}>
              <Trans>Tools</Trans>
            </h3>
            <ul className={styles.stackCategoryList}>
              {skills.tools.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
