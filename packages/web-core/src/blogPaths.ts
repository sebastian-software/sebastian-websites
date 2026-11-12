/**
 * The URL shape of the tech blog, shared by the frame, the build checks, and
 * the hosting gate (ADR-0022). Deliberately free of imports, so `hosting/` can
 * load it as a relative source file.
 */

/** The only site with a publication, and so the only site with single-language pages. */
export const BLOG_SITE = "blog"
/** The route directory of the publication: the overview, posts, tag archives, and feeds. */
export const BLOG_PATH = "/posts"
export const BLOG_TAGS_PATH = `${BLOG_PATH}/tags`

/** Slugs directly below the publication path that the publication owns; no post may use them. */
export const RESERVED_POST_SLUGS: readonly string[] = ["tags"]

/** The two page classes that may exist in one language only. */
export type SingleLanguageClass = "post" | "tag-archive"

const POST_SEGMENTS = 3
const TAG_ARCHIVE_SEGMENTS = 4

/**
 * Classifies a canonical path by shape: a post is `/posts/<slug>` with one
 * segment that the publication does not reserve, a tag archive is
 * `/posts/tags/<key>`. Every other path, the overview and nested paths
 * included, belongs to neither class and needs a counterpart.
 *
 * @param path - A canonical path, without a trailing slash.
 * @returns The page class, or undefined for every other path.
 */
export function singleLanguageClass(path: string): SingleLanguageClass | undefined {
  if (!path.startsWith(`${BLOG_PATH}/`)) return undefined
  const segments = path.split("/")
  const slug = segments[2] ?? ""
  if (segments.length === TAG_ARCHIVE_SEGMENTS && `${BLOG_PATH}/${slug}` === BLOG_TAGS_PATH) {
    return segments[3] === "" ? undefined : "tag-archive"
  }
  const isPost =
    segments.length === POST_SEGMENTS && slug !== "" && !RESERVED_POST_SLUGS.includes(slug)
  return isPost ? "post" : undefined
}
