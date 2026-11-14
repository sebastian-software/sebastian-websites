import type {
  PublicationTagFrontmatterArgs,
  PublicationTagMetaArgs,
  PublicationTagProps,
} from "ardo/config"
import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { BLOG_PATH, canonicalPath } from "@sebastian-websites/web-core"
import blogData from "virtual:blog-data"

import { seoMeta } from "~/lib/seo"

import { blogRobots, feedLinks } from "./blogMeta"
import { FeedLinks } from "./FeedLinks"
import * as styles from "./listing.css.ts"
import { PostList } from "./PostList"

/**
 * The other language's archive of the same tag, when it has one.
 * @param tag - The archive's tag.
 * @param tag.key - The registry key.
 * @param tag.path - The archive path.
 * @returns The counterpart path, or null.
 */
function counterpartOf(tag: { readonly key: string; readonly path: string }): null | string {
  return blogData.otherLanguage.includes(tag.key) ? canonicalPath(tag.path) : null
}

/**
 * The page data of a tag archive. Ardo has no per-tag source file, so the
 * module supplies its translation path for the shared page frame.
 * @param args - What Ardo passes to the tag module's `frontmatter`.
 * @param args.tag - The archive's tag.
 * @returns The page data, read by the root for the language switch.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads page data from the route module
export function frontmatter({ tag }: PublicationTagFrontmatterArgs): Record<string, unknown> {
  // The root reads it with useArdoPage().frontmatter for the language switch.
  return { counterpart: counterpartOf(tag) }
}

/**
 * A tag archive's head metadata: the shared SEO set, with language alternates
 * only when the other language has an archive for the tag, plus the feed links.
 * @param args - What Ardo passes to the tag route's `meta`.
 * @param args.defaults - The descriptors Ardo would render, which carry the feed links.
 * @param args.label - The tag's display label.
 * @param args.publication - The publication, for its name.
 * @param args.tag - The archive's tag.
 * @returns The meta descriptors of the archive.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta({
  defaults,
  label,
  publication,
  tag,
}: PublicationTagMetaArgs): ArdoMetaDescriptor[] {
  return [
    ...seoMeta({
      counterpart: counterpartOf(tag) !== null,
      description: t`Posts from Sebastian Software on ${label}, newest first.`,
      path: canonicalPath(tag.path),
      title: `${label} – ${publication.name}`,
    }),
    ...feedLinks(defaults),
    ...blogRobots(__BLOG_INDEXED__),
  ]
}

/**
 * The archive of one tag: its translated label as the title and the
 * published posts that carry it, newest first.
 * @param props - The tag, its label, and its posts.
 * @param props.label - The tag's display label.
 * @param props.posts - The published posts with the tag.
 * @param props.publication - The publication, for its feeds.
 * @returns The archive page.
 */
export default function TagArchive({
  label,
  posts,
  publication,
}: PublicationTagProps): ReactElement {
  return (
    <main className={styles.main} id="main">
      <div className={styles.head}>
        <p className={styles.eyebrow}>{t`Blog topic`}</p>
        <h1 className={styles.title}>{label}</h1>
        <p className={styles.lead}>{t`Posts from Sebastian Software on ${label}, newest first.`}</p>
        <FeedLinks publication={publication} />
      </div>
      <div className={styles.body}>
        <PostList posts={posts} />
        <p className={styles.back}>
          <ArrowLink href={BLOG_PATH}>{t`All posts`}</ArrowLink>
        </p>
      </div>
    </main>
  )
}
