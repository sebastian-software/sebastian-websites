import type { PublicationIndexMetaArgs, PublicationIndexProps } from "ardo/config"
import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { canonicalPath } from "@sebastian-websites/web-core"

import { seoMeta } from "~/lib/seo"

import { BlogEmpty } from "./BlogEmpty"
import { blogRobots, feedLinks } from "./blogMeta"
import { FeedLinks } from "./FeedLinks"
import * as styles from "./listing.css.ts"
import { PostList } from "./PostList"

/**
 * What the blog is about, for the overview's lead and its description.
 * @returns The sentence in the page's language.
 */
function overviewLead(): string {
  return t`Notes from the two founders: how we build our products, what we learn in client projects, and the tools behind both.`
}

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
  return [
    ...seoMeta({
      description: overviewLead(),
      path: canonicalPath(publication.path),
      title: `${publication.name} – Sebastian Software`,
    }),
    ...feedLinks(defaults),
    ...blogRobots(__BLOG_INDEXED__),
  ]
}

/**
 * The blog overview: what the blog is about, the subscribe links, and the
 * published posts, newest first, or the empty state while there are none.
 * @param props - The publication, as Ardo renders the overview.
 * @param props.publication - The publication with its published posts.
 * @returns The overview page.
 */
export default function BlogIndex({ publication }: PublicationIndexProps): ReactElement {
  return (
    <main className={styles.main} id="main">
      <div className={styles.head}>
        <p className={styles.eyebrow}>{publication.name}</p>
        <h1 className={styles.title}>{t`What we learn while building software.`}</h1>
        <p className={styles.lead}>{overviewLead()}</p>
        <FeedLinks publication={publication} />
      </div>
      <div className={styles.body}>
        {publication.posts.length === 0 ? <BlogEmpty /> : <PostList posts={publication.posts} />}
      </div>
    </main>
  )
}
