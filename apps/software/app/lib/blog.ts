import {
  canonicalPath,
  type PageReference,
  singleLanguageClass,
} from "@sebastian-websites/web-core"
import blog from "virtual:software-blog-data"

/**
 * The published translation's path, or undefined for a single-language post.
 * @param path - The post or page route.
 * @returns The other language's published path, when one exists.
 */
export function postCounterpart(path: string): string | undefined {
  return blog.counterparts[canonicalPath(path)] ?? undefined
}

/**
 * Resolve the frame's language switch from publication data, without changing the sources.
 * @param path - The post or page route.
 * @param frontmatter - Native route data, including tag archive counterparts.
 * @returns The page reference for the shared language switch.
 */
export function blogPageReference(
  path: string,
  frontmatter: Readonly<Record<string, unknown>> | undefined
): PageReference {
  const canonical = canonicalPath(path)
  const kind = singleLanguageClass(canonical)
  if (kind === undefined) return canonical
  return {
    counterpart:
      kind === "post"
        ? postCounterpart(canonical) !== undefined
        : typeof frontmatter?.counterpart === "string",
    path: canonical,
  }
}
