import { describe, expect, it } from "vitest"

import { singleLanguageClass } from "./blogPaths.ts"

describe("blog paths", () => {
  it.each([
    ["/blog/a-post", "post"],
    ["/blog/tags/rust", "tag-archive"],
  ] as const)("classifies %s as %s", (path, kind) => {
    expect(singleLanguageClass(path)).toBe(kind)
  })

  it.each([
    "/",
    "/blog",
    "/blog/tags",
    "/blog/tags/",
    "/blog/nested/post",
    "/blog/tags/rust/page/2",
    "/news/a-post",
    "/company",
    "blog/a-post",
  ])("gives %s no single-language class", (path) => {
    expect(singleLanguageClass(path)).toBeUndefined()
  })
})
