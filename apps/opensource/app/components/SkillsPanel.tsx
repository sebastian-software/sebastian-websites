import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import * as styles from "./SkillsPanel.css.ts"

/**
 * The seven skills with the discipline they cover.
 *
 * @returns One entry per skill, in the order of the collection, with the translated discipline.
 */
function getSkills(): ReadonlyArray<{ readonly discipline: string; readonly id: string }> {
  return [
    { discipline: t`Product`, id: "effective-product" },
    { discipline: t`Web`, id: "effective-web" },
    { discipline: t`Engineering`, id: "effective-engineering" },
    { discipline: t`Delivery`, id: "effective-delivery" },
    { discipline: t`Writing`, id: "effective-writing" },
    { discipline: t`Marketing`, id: "effective-marketing" },
    { discipline: t`Image`, id: "effective-image" },
  ]
}

/**
 * The Effective Agent catalog as a typographic panel: one line per skill with
 * its discipline and install name. It takes the place of a drawing until the
 * collection has one.
 *
 * @returns The tinted panel with the numbered skill list.
 */
export function SkillsPanel(): ReactElement {
  return (
    <div className={styles.panel}>
      <p className={styles.label}>{t`Seven skills, one install each`}</p>
      <ol className={styles.list}>
        {getSkills().map((skill, index) => (
          <li className={styles.item} key={skill.id}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.name}>{skill.discipline}</span>
            <code className={styles.slug}>{skill.id}</code>
          </li>
        ))}
      </ol>
      <p className={styles.foot}>{t`Works with every agent that supports Agent Skills.`}</p>
    </div>
  )
}
