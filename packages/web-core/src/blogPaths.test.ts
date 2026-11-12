import { describe, expect, it } from "vitest"

import { singleLanguageClass } from "./blogPaths.ts"

describe("blog paths", () => {
  it.each([
    ["/posts/a-post", "post"],
    ["/posts/tags/rust", "tag-archive"],
  ] as const)("classifies %s as %s", (path, kind) => {
    expect(singleLanguageClass(path)).toBe(kind)
  })

  it.each([
    "/",
    "/posts",
    "/posts/tags",
    "/posts/tags/",
    "/posts/nested/post",
    "/posts/tags/rust/page/2",
    "/news/a-post",
    "/blog/a-post",
    "/company",
    "blog/a-post",
  ])("gives %s no single-language class", (path) => {
    expect(singleLanguageClass(path)).toBeUndefined()
  })
})
