import { type ReactElement, useActionState, useId } from "react"

import type { NewsletterCopy } from "./copy.ts"

import { visuallyHidden } from "../editorial/editorial.css.ts"
import * as styles from "./PageEnding.css.ts"
import { type NewsletterStatus, type SubscribeAction, subscribeUnavailable } from "./subscribe.ts"

type NewsletterState = {
  readonly email: string
  readonly status: "idle" | NewsletterStatus
}

const INITIAL: NewsletterState = { email: "", status: "idle" }

// Deliberately permissive: one @, a dot in the domain, no spaces.
const EMAIL = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/v

export type NewsletterProps = {
  readonly copy: NewsletterCopy
  readonly subscribe?: SubscribeAction
}

/**
 * The shared newsletter passage: a quiet heading and description beside an email
 * field. Pending, success, and failure states are announced in a live region.
 *
 * @param props - The translated labels and the subscribe action.
 * @returns The newsletter section.
 */
export function Newsletter(props: NewsletterProps): ReactElement {
  const { copy, subscribe = subscribeUnavailable } = props
  const id = useId()
  const [state, formAction, pending] = useActionState(
    async (_previous: NewsletterState, data: FormData): Promise<NewsletterState> => {
      const value = data.get("email")
      const email = typeof value === "string" ? value.trim() : ""
      if (!EMAIL.test(email)) {
        return { email, status: "invalid" }
      }
      try {
        const status = await subscribe(email)
        return { email: status === "success" ? "" : email, status }
      } catch {
        return { email, status: "failure" }
      }
    },
    INITIAL
  )
  const message = pending
    ? copy.pending
    : {
        failure: copy.failure,
        idle: "",
        invalid: copy.invalid,
        success: copy.success,
        unavailable: copy.unavailable,
      }[state.status]
  const problem = state.status === "invalid" || state.status === "failure"

  return (
    <section aria-labelledby={`${id}-title`} className={styles.newsletter}>
      <h2 className={styles.newsletterTitle} id={`${id}-title`}>
        {copy.title}
      </h2>
      <p className={styles.newsletterText}>{copy.description}</p>
      <form action={formAction} aria-busy={pending} className={styles.form} noValidate>
        <label className={visuallyHidden} htmlFor={`${id}-email`}>
          {copy.emailLabel}
        </label>
        <input
          aria-describedby={`${id}-status`}
          aria-invalid={state.status === "invalid"}
          autoComplete="email"
          className={styles.field}
          defaultValue={state.email}
          id={`${id}-email`}
          name="email"
          placeholder={copy.emailLabel}
          required
          type="email"
        />
        <button className={styles.submit} disabled={pending} type="submit">
          {copy.action}
        </button>
      </form>
      <p
        aria-live="polite"
        className={problem ? `${styles.status} ${styles.statusProblem}` : styles.status}
        id={`${id}-status`}
        role="status"
      >
        {message}
      </p>
    </section>
  )
}
