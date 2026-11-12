import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { isNextStep, nextStepHref } from "@sebastian-websites/web-core"
import { useId } from "react"

import { variant } from "~/lib/site"

import { nextStepCopy } from "./nextStepCopy.ts"
import * as styles from "./post.css.ts"

/**
 * The post's one primary next step, at the end of the article. `none` marks a
 * development report and shows no box. The build has validated every value,
 * so an unknown one only leaves the box out.
 * @param props - The post's next step.
 * @param props.step - The `nextStep` field of the post frontmatter.
 * @returns The box, or nothing.
 */
export function NextStep({ step }: { readonly step: unknown }): null | ReactElement {
  const titleId = useId()
  if (!isNextStep(step) || step === "none") return null
  const href = nextStepHref(step, variant)
  if (href === undefined) return null
  const copy = nextStepCopy(step)
  return (
    <section aria-labelledby={titleId} className={styles.nextStep} data-next-step={step}>
      <p className={styles.nextStepEyebrow}>{t`Next step`}</p>
      <p className={styles.nextStepTitle} id={titleId}>
        {copy.title}
      </p>
      <p className={styles.nextStepText}>{copy.text}</p>
      <ArrowLink direction={href.startsWith("/") ? "forward" : "outward"} href={href}>
        {copy.action}
      </ArrowLink>
    </section>
  )
}
