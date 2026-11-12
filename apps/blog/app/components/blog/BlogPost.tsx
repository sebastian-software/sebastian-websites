import type { PostImage, PublicationPostMetaArgs, PublicationPostProps } from "ardo/config"
import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { SiteLink } from "@sebastian-websites/ui"
import { BLOG_PATH, getSiteOrigin, type SocialImage } from "@sebastian-websites/web-core"
import { ArdoImage } from "ardo/ui"

import { postCounterpart } from "~/lib/blog"
import { seoMeta } from "~/lib/seo"
import { variant } from "~/lib/site"

import { blogRobots, feedLinks } from "./blogMeta"
import { main } from "./listing.css.ts"
import { NextStep } from "./NextStep"
import * as styles from "./post.css.ts"
import { PostMeta } from "./PostMeta"
import { PostTags } from "./PostTags"
import { PostTranslationLink } from "./PostTranslationLink"

/**
 * The social preview of a post: its cover's JPEG rendition, which Ardo also
 * puts into the feeds, at the site's canonical origin. A post without a
 * cover, or with an SVG or animated cover that has no JPEG, keeps the site's
 * default preview.
 * @param cover - The post's prepared cover image.
 * @returns The preview, or undefined for the default.
 */
function coverPreview(cover: PostImage | undefined): SocialImage | undefined {
  const jpeg = cover?.fallback
  if (jpeg === undefined) return undefined
  const origin = getSiteOrigin(variant.site, variant.locale)
  return { height: jpeg.height, url: new URL(jpeg.src, origin).href, width: jpeg.width }
}

/**
 * A post's head metadata: the shared SEO set with article times and the cover
 * as social preview, no language alternates for a single-language post, and
 * Ardo's feed discovery links.
 * @param args - What Ardo passes to the post route's `meta`.
 * @param args.defaults - The descriptors Ardo would render, which carry the feed links.
 * @param args.post - The post and its native publication metadata.
 * @returns The meta descriptors of the post.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta({ defaults, post }: PublicationPostMetaArgs): ArdoMetaDescriptor[] {
  const preview = coverPreview(post.coverImage)
  return [
    ...seoMeta({
      article: {
        publishedAt: post.publishedAt,
        tags: post.tags,
        ...(post.updatedAt === undefined ? {} : { modifiedAt: post.updatedAt }),
      },
      counterpart: postCounterpart(post.path) !== undefined,
      description: post.description ?? post.title,
      ...(preview === undefined ? {} : { image: preview }),
      path: post.path,
      title: `${post.title} – Sebastian Software`,
    }),
    ...feedLinks(defaults),
    ...blogRobots(__BLOG_INDEXED__),
  ]
}

/**
 * The post frame inside the site's header and page ending: the title with
 * dates, authors, and the translation, the optional cover, the generated
 * article body, its tags, and the one primary next step.
 * @param props - The post and its rendered body.
 * @param props.children - The generated article body.
 * @param props.post - The post's data.
 * @returns The post page.
 */
export default function BlogPost({ children, post }: PublicationPostProps): ReactElement {
  return (
    <main className={main} id="main">
      <article
        className={styles.article}
        // The authored next step, for the browser check: one box, or none for `none`.
        data-next-step={typeof post.data.nextStep === "string" ? post.data.nextStep : undefined}
      >
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <SiteLink className={styles.eyebrowLink} href={BLOG_PATH}>
              {post.publicationName}
            </SiteLink>
          </p>
          <h1 className={styles.title}>{post.title}</h1>
          {post.description === undefined ? null : (
            <p className={styles.lead}>{post.description}</p>
          )}
          <PostMeta post={post} />
          <PostTranslationLink counterpart={postCounterpart(post.path)} />
        </div>
        {post.coverImage === undefined ? null : (
          <figure className={styles.cover}>
            {/* The cover is the post's largest early image, so it loads first. */}
            <ArdoImage fetchPriority="high" image={post.coverImage} loading="eager" />
            {post.coverImage.caption === undefined ? null : (
              <figcaption className={styles.caption}>{post.coverImage.caption}</figcaption>
            )}
          </figure>
        )}
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <PostTags tags={post.tags} />
          <NextStep step={post.data.nextStep} />
        </div>
      </article>
    </main>
  )
}
