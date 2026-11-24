import type { PostImage, PublicationPostMetaArgs, PublicationPostProps } from "ardo/config"
import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { SiteLink } from "@sebastian-websites/ui"
import { BLOG_PATH, getSiteOrigin, jsonLd, type SocialImage } from "@sebastian-websites/web-core"
import { ArdoImage } from "ardo/ui"

import { postCounterpart } from "~/lib/blog"
import { seoMeta } from "~/lib/seo"
import { variant } from "~/lib/site"

import { blogRobots, feedLinks } from "./blogMeta"
import { main } from "./listing.css.ts"
import { NextStep } from "./NextStep"
import * as styles from "./post.css.ts"
import { PostMeta } from "./PostMeta"
import { postStructuredData } from "./postStructuredData.ts"
import { PostTags } from "./PostTags"
import { PostTranslationLink } from "./PostTranslationLink"

/**
 * Use the share image URL Ardo resolved when preparing the post. An authored
 * social card is 1200 × 630. A cover rendition keeps its generated dimensions.
 * @param defaults - Ardo's page metadata, including its selected preview.
 * @param cover - The responsive cover and its JPEG fallback.
 * @returns The post preview, or undefined for the site's default image.
 */
function postPreview(
  defaults: readonly ArdoMetaDescriptor[],
  cover: PostImage | undefined
): SocialImage | undefined {
  const image = defaults.find((item) => "property" in item && item.property === "og:image")
  if (image === undefined || !("content" in image) || typeof image.content !== "string")
    return undefined
  const origin = getSiteOrigin(variant.site, variant.locale)
  const url = new URL(image.content, origin).href
  const jpeg = cover?.fallback
  if (jpeg !== undefined && new URL(jpeg.src, origin).href === url)
    return { height: jpeg.height, url, width: jpeg.width }
  return { height: 630, url, width: 1200 }
}

/**
 * A post's head metadata: the shared SEO set with article times and the selected
 * social preview, no language alternates for a single-language post, and
 * Ardo's feed discovery links.
 * @param args - What Ardo passes to the post route's `meta`.
 * @param args.defaults - The descriptors Ardo would render, which carry the feed links.
 * @param args.post - The post and its native publication metadata.
 * @returns The meta descriptors of the post.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta({ defaults, post }: PublicationPostMetaArgs): ArdoMetaDescriptor[] {
  const preview = postPreview(defaults, post.coverImage)
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
      <script type="application/ld+json">
        {jsonLd(postStructuredData(post, variant, coverPreview(post.coverImage)))}
      </script>
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
