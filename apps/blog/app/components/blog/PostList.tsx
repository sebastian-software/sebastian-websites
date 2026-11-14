import type { Post } from "ardo/config"
import type { ReactElement } from "ardo/react"

import { SiteLink } from "@sebastian-websites/ui"

import * as styles from "./listing.css.ts"
import { formatPostDay } from "./postDates.ts"

/**
 * The posts of a listing in Ardo's order, newest first: each with its linked
 * title, day, and description.
 * @param props - What the listing shows.
 * @param props.posts - Visible posts in Ardo's order, newest first.
 * @returns A list item per post.
 */
export function PostList({ posts }: { readonly posts: readonly Post[] }): ReactElement {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li className={styles.item} key={post.id}>
          <h2 className={styles.itemTitle}>
            <SiteLink className={styles.itemLink} href={post.path}>
              {post.title}
            </SiteLink>
          </h2>
          <time className={styles.itemDate} dateTime={post.publishedAt}>
            {formatPostDay(post.publishedAt)}
          </time>
          {post.description === undefined ? null : (
            <p className={styles.itemText}>{post.description}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
