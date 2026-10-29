import type { ReactElement } from "react"

import * as styles from "./PageError.css.ts"

export type PageErrorCopy = {
  readonly home: string
  readonly reload: string
  readonly text: string
  readonly title: string
}

/**
 * Recovery markup shared by the route boundary and the document catalog probe.
 * It only consumes resolved text and needs no router or message catalog.
 *
 * @param props - The already translated recovery labels.
 * @param props.copy - Resolved labels for the recovery view.
 * @returns A complete recovery view with document navigation links.
 */
export function PageError(props: { readonly copy: PageErrorCopy }): ReactElement {
  const { copy } = props
  return (
    <main
      aria-labelledby="page-error-title"
      className={styles.main}
      data-palamedes-catalog-error=""
      id="main"
      role="alert"
    >
      <div className={styles.content}>
        <h1 className={styles.title} id="page-error-title">
          {copy.title}
        </h1>
        <p className={styles.text}>{copy.text}</p>
        <div className={styles.actions}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- An empty URL reloads the current document, including its query string, without JavaScript. */}
          <a className={styles.reload} href="" target="_self">
            {copy.reload}
          </a>
          <a className={styles.home} href="/" target="_self">
            {copy.home}
          </a>
        </div>
      </div>
    </main>
  )
}
