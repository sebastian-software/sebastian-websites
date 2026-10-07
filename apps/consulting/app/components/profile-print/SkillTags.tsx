import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"
import { Fragment } from "react"

import { cn } from "~/lib/utilities"

import type { CompetencyFocus, Skills } from "./types"

import * as styles from "../ProfilePrintV2.css"

type SkillGroup = {
  id: string
  label: ReactNode
  tags: string[]
}

export function SkillTags({
  competencyFocus,
  skills,
}: {
  competencyFocus?: CompetencyFocus
  skills: Skills
}): ReactNode {
  // Signature competencies lead as their own labeled row (the visible legend
  // for the inverted tags); the remaining skills follow chunked by category
  // so the section reads as ~5 scannable groups instead of a flat tag cloud.
  const signature = competencyFocus?.signature ?? []
  const seen = new Set(signature)

  // Deduplicates against the signature row and across categories, which
  // would otherwise render a skill twice (and produce duplicate React keys).
  const remaining = (tags?: string[]): string[] => {
    const fresh = (tags ?? []).filter((skill) => !seen.has(skill))
    for (const skill of fresh) {
      seen.add(skill)
    }
    return fresh
  }

  const groups: SkillGroup[] = [
    { id: "signature", label: <Trans>Signature skills</Trans>, tags: signature },
    { id: "frontend", label: <Trans>Frontend</Trans>, tags: remaining(skills.frontend) },
    { id: "backend", label: <Trans>Backend</Trans>, tags: remaining(skills.backend) },
    {
      id: "specialization",
      label: <Trans>Specialization</Trans>,
      tags: remaining(skills.specialization),
    },
    { id: "tools", label: <Trans>Tools</Trans>, tags: remaining(skills.tools) },
    { id: "additional", label: <Trans>More</Trans>, tags: remaining(skills.additional) },
  ].filter((group) => group.tags.length > 0)

  return (
    <section>
      <h2 className={styles.sectionHeading}>
        <Trans>Core Competencies</Trans>
      </h2>
      {competencyFocus ? (
        <p className={styles.competencyStatement}>{competencyFocus.statement}</p>
      ) : null}
      <dl className={styles.skillGroups}>
        {groups.map((group) => (
          <Fragment key={group.id}>
            <dt className={styles.skillGroupLabel}>{group.label}</dt>
            <dd className={styles.skillGroupTags}>
              {group.tags.map((skill) => (
                <span
                  className={cn(
                    styles.skillTag,
                    group.id === "signature" && styles.skillTagPrimary
                  )}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  )
}
