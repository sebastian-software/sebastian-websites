import type { PublicationIndexMetaArgs, PublicationIndexProps } from "ardo/config"
import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { canonicalPath } from "@sebastian-websites/web-core"

import { seoMeta } from "~/lib/seo"

import { BlogEmpty } from "./BlogEmpty"
import { blogLead } from "./blogLead"
import { blogRobots, feedLinks } from "./blogMeta"
import { FeedLinks } from "./FeedLinks"
import * as styles from "./listing.css.ts"
import { PostList } from "./PostList"

/**
 * The overview's head metadata: the shared SEO set for the blog path, plus
 * Ardo's feed discovery links.
 * @param args - What Ardo passes to the index route's `meta`.
 * @param args.defaults - The descriptors Ardo would render, which carry the feed links.
 * @param args.publication - The publication, for its name and path.
 * @returns The meta descriptors of the overview.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta({ defaults, publication }: PublicationIndexMetaArgs): ArdoMetaDescriptor[] {
  const allPosts = t`All posts`
  return [
    ...seoMeta({
      description: blogLead(),
      path: canonicalPath(publication.path),
      title: `${allPosts} – ${publication.name}`,
    }),
    ...feedLinks(defaults),
    ...blogRobots(__BLOG_INDEXED__),
  ]
}

/**
 * The overview below `/posts`: every published post, newest first, with the
 * subscribe links, or the empty state while there are none. The home page
 * shows the newest posts only.
 * @param props - The publication, as Ardo renders the overview.
 * @param props.publication - The publication with its published posts.
 * @returns The overview page.
 */
export default function BlogIndex({ publication }: PublicationIndexProps): ReactElement {
  return (
    <main className={styles.main} id="main">
      <div className={styles.head}>
        <p className={styles.eyebrow}>{publication.name}</p>
        <h1 className={styles.title}>{t`All posts`}</h1>
        <p className={styles.lead}>{t`Every post on the blog, newest first.`}</p>
        <FeedLinks publication={publication} />
      </div>
      <div className={styles.body}>
        {publication.posts.length === 0 ? <BlogEmpty /> : <PostList posts={publication.posts} />}
      </div>
    </main>
  )
}
