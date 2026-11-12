import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"
import { BLOG_PATH } from "@sebastian-websites/web-core"
import publication from "virtual:ardo/publication"

import { BlogEmpty } from "~/components/blog/BlogEmpty"
import { blogLead } from "~/components/blog/blogLead"
import { FeedLinks } from "~/components/blog/FeedLinks"
import * as styles from "~/components/blog/listing.css.ts"
import { PostList } from "~/components/blog/PostList"
import { seoMeta } from "~/lib/seo"

/** The home page shows the newest posts; the overview below `/posts` lists them all. */
const LATEST_POSTS = 5

/**
 * The home page's head metadata: the shared SEO set and the same feed
 * discovery links the publication pages carry.
 * @returns The meta descriptors of the home page.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return [
    ...seoMeta({ description: blogLead(), path: "/", title: publication.name }),
    ...[
      { format: "RSS", href: publication.rssUrl, type: "application/rss+xml" },
      { format: "Atom", href: publication.atomUrl, type: "application/atom+xml" },
    ].map(({ format, href, type }) => ({
      href,
      rel: "alternate",
      tagName: "link" as const,
      title: `${publication.name} (${format})`,
      type,
    })),
  ]
}

/**
 * The tech blog's home: what it is about, the subscribe links, and the newest
 * posts with the way to all of them, or the empty state while there are none.
 * @returns The home page.
 */
export default function Home(): ReactElement {
  const posts = publication.posts.slice(0, LATEST_POSTS)
  return (
    <main className={styles.main} id="main">
      <div className={styles.head}>
        <p className={styles.eyebrow}>{publication.name}</p>
        <h1 className={styles.title}>{t`What we learn while building software.`}</h1>
        <p className={styles.lead}>{blogLead()}</p>
        <FeedLinks publication={publication} />
      </div>
      <div className={styles.body}>
        {posts.length === 0 ? (
          <BlogEmpty />
        ) : (
          <>
            <PostList posts={posts} />
            <p className={styles.back}>
              <ArrowLink href={BLOG_PATH}>{t`All posts`}</ArrowLink>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
