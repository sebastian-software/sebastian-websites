import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { BLOG_PATH, canonicalUrl, otherLocale } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

import * as styles from "./listing.css.ts"

/**
 * The overview of a language without published posts: a short note and the
 * way to the other language's blog.
 * @returns The empty state.
 */
export function BlogEmpty(): ReactElement {
  const other = otherLocale(variant.locale)
  const label = { de: t`Read the German blog`, en: t`Read the English blog` }[other]
  return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>
        {t`There are no posts in this language yet. New posts appear here and in the feeds as soon as they are published.`}
      </p>
      <p>
        <ArrowLink
          direction="outward"
          href={canonicalUrl(variant.site, other, BLOG_PATH)}
          hrefLang={other}
        >
          {label}
        </ArrowLink>
      </p>
    </div>
  )
}
