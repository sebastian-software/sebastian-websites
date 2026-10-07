import type { ReactNode } from "react"

import { Plural, Trans } from "@palamedes/react/macro"

import type { Consultant } from "./types"

import * as styles from "../ProfilePrintV2.css"

export function IndustryExperience({ consultant }: { consultant: Consultant }): ReactNode {
  if (!consultant.industryExperience || consultant.industryExperience.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className={styles.sectionHeading}>
        <Trans>Industry Experience</Trans>
      </h2>
      <div className={styles.industryGrid}>
        {consultant.industryExperience.map((exp) => (
          <div className={styles.industryItem} key={exp.industry}>
            <div className={styles.industryYears}>
              {exp.years}
              <span className={styles.industryUnit}>
                {" "}
                <Plural one="year" other="years" value={exp.years} />
              </span>
            </div>
            <div className={styles.industryLabel}>{exp.industry}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
