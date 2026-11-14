import type { Post } from "ardo/config"
import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"

import { getFounder } from "~/lib/founders"

import * as styles from "./post.css.ts"
import { formatPostDay, showsUpdate } from "./postDates.ts"

/**
 * The day of a later update, as its own date.
 * @param props - The update.
 * @param props.updatedAt - The post's update timestamp.
 * @returns The labelled date.
 */
function UpdatedOn({ updatedAt }: { readonly updatedAt: string }): ReactElement {
  const day = formatPostDay(updatedAt)
  return <time dateTime={updatedAt}>{t`Updated on ${day}`}</time>
}

/**
 * The post's dates and its author line. Founders show their name and role
 * from the shared founder module; any other author shows the name Ardo has.
 * @param props - What the line shows.
 * @param props.post - The post whose dates and authors it shows.
 * @returns The dates and authors below the post title.
 */
export function PostMeta({ post }: { readonly post: Post }): ReactElement {
  const { authors, publishedAt, updatedAt } = post
  return (
    <div className={styles.meta}>
      <p className={styles.dates}>
        <time dateTime={publishedAt}>{formatPostDay(publishedAt)}</time>
        {updatedAt !== undefined && showsUpdate(publishedAt, updatedAt) ? (
          <UpdatedOn updatedAt={updatedAt} />
        ) : null}
      </p>
      <ul aria-label={t`Authors`} className={styles.authors}>
        {authors.map((author) => {
          const founder = getFounder(author.id)
          return (
            <li className={styles.author} key={author.id ?? author.name}>
              <span className={styles.authorName}>{founder?.name ?? author.name}</span>
              {founder === undefined ? null : (
                <span className={styles.authorRole}>{founder.role}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
