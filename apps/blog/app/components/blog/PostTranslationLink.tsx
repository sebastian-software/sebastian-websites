import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { canonicalUrl, otherLocale } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

import * as styles from "./post.css.ts"

/**
 * A link to the post's translation on the other language's domain, for posts
 * that have one in the publication at the shared build time.
 * @param props - The translation's path.
 * @param props.counterpart - The other language's path, or undefined.
 * @returns The link, or nothing for a single-language post.
 */
export function PostTranslationLink({
  counterpart,
}: {
  readonly counterpart: string | undefined
}): null | ReactElement {
  if (counterpart === undefined) return null
  const other = otherLocale(variant.locale)
  const label = { de: t`Read this post in German`, en: t`Read this post in English` }[other]
  return (
    <p className={styles.translation}>
      <ArrowLink
        direction="outward"
        href={canonicalUrl(variant.site, other, counterpart)}
        hrefLang={other}
      >
        {label}
      </ArrowLink>
    </p>
  )
}
