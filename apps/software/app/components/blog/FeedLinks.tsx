import type { Publication } from "ardo/config"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import * as styles from "./listing.css.ts"

/**
 * The path of a feed URL, so previews and origin hosts serve their own feed.
 * @param url - The absolute feed URL from the publication.
 * @returns The path on the current domain.
 */
function feedPath(url: string): string {
  return new URL(url).pathname
}

/**
 * Visible subscribe links to the publication's RSS and Atom feeds. Each link
 * names its format, and the list names what it is for.
 * @param props - The publication whose feeds the links lead to.
 * @param props.publication - The publication of the page.
 * @returns The list of both subscribe links.
 */
export function FeedLinks({ publication }: { readonly publication: Publication }): ReactElement {
  return (
    <ul aria-label={t`Subscribe to the blog`} className={styles.feeds}>
      <li>
        <a
          className={styles.feedLink}
          href={feedPath(publication.rssUrl)}
          type="application/rss+xml"
        >
          {t`Subscribe via RSS`}
        </a>
      </li>
      <li>
        <a
          className={styles.feedLink}
          href={feedPath(publication.atomUrl)}
          type="application/atom+xml"
        >
          {t`Subscribe via Atom`}
        </a>
      </li>
    </ul>
  )
}
