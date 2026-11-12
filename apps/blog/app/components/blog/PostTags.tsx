import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { SiteLink } from "@sebastian-websites/ui"
import { useArdoPublicationTags } from "ardo/ui"
import { useId } from "react"

import * as styles from "./post.css.ts"

/**
 * The post's tags with their translated labels, each linking to its archive.
 * @param props - What the list shows.
 * @param props.tags - The registry keys the post carries.
 * @returns The labelled tag list, or nothing for a post without tags.
 */
export function PostTags({ tags }: { readonly tags: readonly string[] }): null | ReactElement {
  const { label, path } = useArdoPublicationTags()
  const labelId = useId()
  if (tags.length === 0) return null
  return (
    <div className={styles.tags}>
      <p className={styles.tagsLabel} id={labelId}>
        {t`Topics`}
      </p>
      <ul aria-labelledby={labelId} className={styles.tagList}>
        {tags.map((tag) => (
          <li key={tag}>
            {path === undefined ? (
              <span className={styles.tag}>{label(tag)}</span>
            ) : (
              <SiteLink className={styles.tagLink} href={path(tag)}>
                {label(tag)}
              </SiteLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
