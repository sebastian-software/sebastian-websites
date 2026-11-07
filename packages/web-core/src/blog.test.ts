import { describe, expect, it } from "vitest"

import {
  blogPostAt,
  blogPostPath,
  type BlogPostSource,
  blogTagArchives,
  BlogValidationError,
  createBlogIndex,
  hasBlogCounterpart,
  splitFrontmatter,
  validateBlogPosts,
} from "./blog.ts"
import { NEXT_STEPS } from "./blogNextSteps.ts"
import { BLOG_TAGS, isSlug } from "./blogTags.ts"

const BUILD_TIME = new Date("2026-11-17T12:00:00Z")

function post(
  locale: BlogPostSource["locale"],
  file: string,
  frontmatter: Readonly<Record<string, unknown>> = {}
): BlogPostSource {
  return {
    body: "Text.",
    file,
    frontmatter: {
      authors: ["fastner"],
      id: file.replace(/\.mdx?$/v, ""),
      nextStep: "contact",
      publishedAt: "2026-11-17T09:00:00+01:00",
      title: "A post",
      ...frontmatter,
    },
    locale,
  }
}

function issuesOf(sources: readonly BlogPostSource[]): readonly string[] {
  try {
    validateBlogPosts(sources)
  } catch (error) {
    if (error instanceof BlogValidationError) return error.issues
    throw error
  }
  return []
}

describe("blog sources", () => {
  it("splits YAML frontmatter from the body", () => {
    expect(splitFrontmatter("---\nid: a\ntitle: A\n---\n\n# Body\n")).toStrictEqual({
      body: "\n# Body\n",
      yaml: "id: a\ntitle: A",
    })
    expect(splitFrontmatter("﻿---\r\nid: a\r\n---\r\nBody")).toStrictEqual({
      body: "Body",
      yaml: "id: a",
    })
    expect(splitFrontmatter("# No frontmatter\n---\nx\n---\n")).toStrictEqual({
      body: "# No frontmatter\n---\nx\n---\n",
      yaml: "",
    })
  })

  it("derives post paths like the publication", () => {
    expect(blogPostPath("first-post.md", undefined)).toBe("/blog/first-post")
    expect(blogPostPath("first-post/index.mdx", undefined)).toBe("/blog/first-post")
    expect(blogPostPath("x.md", "/blog/chosen/")).toBe("/blog/chosen")
  })

  it("keeps a registry of lowercase hyphenated English tag keys", () => {
    expect(new Set(BLOG_TAGS).size).toBe(BLOG_TAGS.length)
    expect(BLOG_TAGS.filter((tag) => !isSlug(tag))).toStrictEqual([])
    expect(
      ["Rust", "open--source", "-rust", "rust-", "open source"].filter((value) => isSlug(value))
    ).toStrictEqual([])
  })
})

describe("blog validation", () => {
  it("accepts a translated pair and single-language posts", () => {
    const posts = validateBlogPosts([
      post("de", "pair.md", { id: "pair", tags: ["rust"] }),
      post("en", "pair.md", { id: "pair", tags: ["rust", "architecture"] }),
      post("en", "english-only.md", { nextStep: "none" }),
    ])
    expect(posts.map((entry) => `${entry.locale}${entry.path}`)).toStrictEqual([
      "de/blog/pair",
      "en/blog/pair",
      "en/blog/english-only",
    ])
  })

  it("requires the same path for the same id and the same id for the same path", () => {
    expect(
      issuesOf([
        post("de", "ein-beitrag.md", { id: "pair" }),
        post("en", "a-post.md", { id: "pair" }),
      ])
    ).toStrictEqual(["id pair has path /blog/ein-beitrag in de but /blog/a-post in en"])
    expect(
      issuesOf([post("de", "same.md", { id: "one" }), post("en", "same.md", { id: "two" })])
    ).toStrictEqual(["path /blog/same has id one in de but two in en"])
  })

  it("keeps ids and paths unique within a language, drafts included", () => {
    expect(
      issuesOf([
        post("de", "a.md", { id: "shared" }),
        post("de", "b.md", { draft: true, id: "shared" }),
        post("en", "c.md", { path: "/blog/d" }),
        post("en", "d.md"),
      ])
    ).toStrictEqual([
      "de: id shared is used by a.md and b.md",
      "en: path /blog/d is used by c.md and d.md",
    ])
  })

  it("requires a known nextStep, known tag keys, and a valid publication time", () => {
    expect(
      issuesOf([
        post("de", "a.md", { nextStep: undefined }),
        post("de", "b.md", { nextStep: "newsletter" }),
        post("en", "c.md", { tags: ["Rust", "rust"] }),
        post("en", "d.md", { tags: ["rust", "rust"] }),
        post("en", "e.md", { publishedAt: "2026-11-17T09:00:00" }),
        post("en", "f.md", { draft: "yes" }),
        post("en", "g.md", { id: "" }),
      ])
    ).toStrictEqual([
      "de/a.md: nextStep is required; use none for a development report",
      'de/b.md: unknown nextStep "newsletter"',
      'en/c.md: unknown tag "Rust"; add the key to the tag registry first',
      "en/d.md: tags must not repeat",
      "en/e.md: publishedAt must be a timestamp with a time zone",
      "en/f.md: draft must be a boolean",
      "en/g.md: id must be a non-empty string",
    ])
  })

  it.each(NEXT_STEPS)("accepts the next step %s", (nextStep) => {
    expect(issuesOf([post("en", "a.md", { nextStep })])).toStrictEqual([])
  })

  it("keeps posts directly below the blog and away from the tag archives", () => {
    expect(
      issuesOf([
        post("en", "nested/post.md"),
        post("en", "tags.md"),
        post("de", "a.md", { path: "/news/a" }),
        post("de", "Upper.md"),
      ])
    ).toStrictEqual([
      "en/nested/post.md: path /blog/nested/post must be /blog/<slug>, one lowercase hyphenated segment other than tags",
      "en/tags.md: path /blog/tags must be /blog/<slug>, one lowercase hyphenated segment other than tags",
      "de/a.md: path /news/a must be /blog/<slug>, one lowercase hyphenated segment other than tags",
      "de/Upper.md: path /blog/Upper must be /blog/<slug>, one lowercase hyphenated segment other than tags",
    ])
  })

  it("rejects raster images in the source", () => {
    const issues = issuesOf([
      post("en", "a.md", { coverImage: { alt: "", src: "./a.png" } }),
      { ...post("en", "b.md"), body: "![Diagram](./diagram.svg)\n![Photo](./photo.jpg)" },
    ])
    expect(issues).toStrictEqual([
      "en/a.md: Frontmatter field coverImage is not allowed before the image plan",
      "en/b.md: Markdown image ./photo.jpg is not an SVG",
    ])
  })

  it("reports problems of drafts and future posts as well", () => {
    expect(
      issuesOf([
        post("de", "draft.md", { draft: true, nextStep: "unknown" }),
        post("de", "later.md", { publishedAt: "2027-01-01T00:00:00Z", tags: ["unknown"] }),
      ])
    ).toStrictEqual([
      'de/draft.md: unknown nextStep "unknown"',
      'de/later.md: unknown tag "unknown"; add the key to the tag registry first',
    ])
  })
})

describe("blog index", () => {
  const sources = [
    post("de", "pair.md", { id: "pair", tags: ["rust"] }),
    post("en", "pair.md", { id: "pair", tags: ["rust"] }),
    post("en", "english-only.md", {
      nextStep: "products",
      publishedAt: "2026-11-16T09:00:00Z",
      tags: ["architecture"],
    }),
    post("de", "entwurf.md", { draft: true, tags: ["typescript"] }),
    post("en", "later.md", { publishedAt: "2026-11-18T09:00:00Z", tags: ["typescript"] }),
  ]

  it("lists only due posts per language, newest first", () => {
    expect(createBlogIndex(sources, BUILD_TIME)).toStrictEqual({
      buildTime: "2026-11-17T12:00:00.000Z",
      posts: {
        de: [{ id: "pair", nextStep: "contact", path: "/blog/pair", tags: ["rust"] }],
        en: [
          { id: "pair", nextStep: "contact", path: "/blog/pair", tags: ["rust"] },
          {
            id: "english-only",
            nextStep: "products",
            path: "/blog/english-only",
            tags: ["architecture"],
          },
        ],
      },
    })
  })

  it("includes a future post once the shared build time has passed its date", () => {
    const index = createBlogIndex(sources, new Date("2026-11-18T09:00:00Z"))
    expect(index.posts.en.map((entry) => entry.id)).toStrictEqual(["later", "pair", "english-only"])
    expect(index.posts.de.map((entry) => entry.id)).toStrictEqual(["pair"])
  })

  it("validates sources that are not due", () => {
    expect(() =>
      createBlogIndex([...sources, post("en", "x.md", { draft: true, nextStep: "?" })], BUILD_TIME)
    ).toThrow(BlogValidationError)
    expect(() => createBlogIndex(sources, new Date(Number.NaN))).toThrow("valid date")
  })

  it("gives every publication page outside the two single-language classes a counterpart", () => {
    const index = createBlogIndex(sources, BUILD_TIME)
    for (const path of [
      "/blog/tags",
      "/blog/authors/fastner",
      "/blog/page/2",
      "/blog/tags/architecture/page/2",
      // Shaped like a post, but no due post of this language lives there.
      "/blog/authors",
      "/blog/later",
    ]) {
      expect([path, hasBlogCounterpart(index, "en", path)]).toStrictEqual([path, true])
      expect([path, hasBlogCounterpart(index, "de", path)]).toStrictEqual([path, true])
    }
    // An archive this language does not have is no single-language page either.
    expect(hasBlogCounterpart(index, "de", "/blog/tags/architecture")).toBe(true)
  })

  it("orders posts of one time by code point, independent of collation", () => {
    const same = { publishedAt: "2026-11-17T09:00:00Z" }
    const index = createBlogIndex(
      [post("en", "a.md", { ...same, id: "alpha" }), post("en", "z.md", { ...same, id: "Zeta" })],
      BUILD_TIME
    )
    // Collation would put "alpha" first; code points put upper case first.
    expect(index.posts.en.map((entry) => entry.id)).toStrictEqual(["Zeta", "alpha"])
  })

  it("resolves counterparts of posts, tag archives, and other pages", () => {
    const index = createBlogIndex(sources, BUILD_TIME)
    expect(hasBlogCounterpart(index, "de", "/blog/pair")).toBe(true)
    expect(hasBlogCounterpart(index, "en", "/blog/pair/")).toBe(true)
    expect(hasBlogCounterpart(index, "en", "/blog/english-only")).toBe(false)
    expect(hasBlogCounterpart(index, "en", "/blog/tags/rust")).toBe(true)
    expect(hasBlogCounterpart(index, "en", "/blog/tags/architecture")).toBe(false)
    expect(hasBlogCounterpart(index, "de", "/blog")).toBe(true)
    expect(hasBlogCounterpart(index, "en", "/blog/")).toBe(true)
    expect(hasBlogCounterpart(index, "de", "/company")).toBe(true)
    expect(blogTagArchives(index, "en")).toStrictEqual(["rust", "architecture"])
    expect(blogTagArchives(index, "de")).toStrictEqual(["rust"])
    expect(blogPostAt(index, "en", "/blog/english-only")?.nextStep).toBe("products")
    expect(blogPostAt(index, "de", "/blog/english-only")).toBeUndefined()
  })
})
