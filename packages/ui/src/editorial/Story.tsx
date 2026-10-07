import type { ReactElement, ReactNode } from "react"

import * as styles from "./editorial.css.ts"

export type StoryProps = {
  readonly "aria-labelledby"?: string
  readonly children: ReactNode
  /** The illustration; it reaches slightly beyond the page edge on its side. */
  readonly media: ReactNode
  /** Which side the illustration takes. Lists alternate by index. */
  readonly mediaPosition: "end" | "start"
}

/**
 * One illustrated editorial story on the shared grid: five or six columns of
 * text beside a larger illustration. Any number of stories can follow each other
 * by alternating `mediaPosition`.
 *
 * @param props - The text content, the illustration, and its side.
 * @returns The story as an article.
 */
export function Story(props: StoryProps): ReactElement {
  const { "aria-labelledby": labelledBy, children, media, mediaPosition } = props
  return (
    <article aria-labelledby={labelledBy} className={styles.story}>
      <div className={styles.storyContent[mediaPosition]}>{children}</div>
      <div className={styles.storyMedia[mediaPosition]}>{media}</div>
    </article>
  )
}
