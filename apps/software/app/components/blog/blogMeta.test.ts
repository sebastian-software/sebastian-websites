import type { ArdoMetaDescriptor } from "ardo/runtime"

import assert from "node:assert/strict"
import { test } from "node:test"

import { counterpartPath, feedLinks } from "./blogMeta.ts"

const RSS: ArdoMetaDescriptor = {
  href: "https://x.example/blog/rss.xml",
  rel: "alternate",
  tagName: "link",
  title: "Blog",
  type: "application/rss+xml",
}
const ATOM: ArdoMetaDescriptor = {
  href: "https://x.example/blog/atom.xml",
  rel: "alternate",
  tagName: "link",
  title: "Blog",
  type: "application/atom+xml",
}

test("feedLinks keeps the alternate links, titled by format, and drops every other descriptor", () => {
  const defaults: ArdoMetaDescriptor[] = [
    { title: "A post" },
    { href: "https://x.example/blog/a", rel: "canonical", tagName: "link" },
    RSS,
    { content: "article", property: "og:type" },
    ATOM,
  ]
  assert.deepEqual(feedLinks(defaults), [
    { ...RSS, title: "Blog (RSS)" },
    { ...ATOM, title: "Blog (Atom)" },
  ])
  assert.deepEqual(feedLinks([]), [])
  // A hreflang alternate is no feed and keeps its descriptor.
  const hreflang: ArdoMetaDescriptor = {
    href: "/de",
    hrefLang: "de",
    rel: "alternate",
    tagName: "link",
  }
  assert.deepEqual(feedLinks([hreflang]), [hreflang])
})

test("counterpartPath accepts a path and treats null or missing as none", () => {
  assert.equal(counterpartPath("/blog/pair"), "/blog/pair")
  assert.equal(counterpartPath(null), undefined)
  assert.equal(counterpartPath(undefined), undefined)
  assert.equal(counterpartPath(42), undefined)
})
