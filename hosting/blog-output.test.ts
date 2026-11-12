import assert from "node:assert/strict"
import { test } from "node:test"

import type { Asset } from "./publish.ts"

import { assertBlogOutput, blogImageIssues, isBlogTarget } from "./blog-output.ts"
import { TARGETS } from "./targets.ts"

const encoder = new TextEncoder()

function asset(path: string, text: string): Asset {
  return { bytes: encoder.encode(text), path }
}

function target(name: string): (typeof TARGETS)[number] {
  const found = TARGETS.find((entry) => entry.name === name)
  assert.ok(found, name)
  return found
}

// The frame around <main> keeps its inline logo and its Bunny photos.
const SVG_POST =
  '<header><img src="data:image/svg+xml,%3csvg%3e%3c/svg%3e" alt=""></header><main><img src="/assets/diagram.svg" alt="Diagram"></main><footer><img src="https://assets.example/road.png" alt=""></footer>'
const RSS_ENTRY = (content: string): string =>
  `<rss version="2.0"><channel><item><content:encoded><![CDATA[${content}]]></content:encoded></item></channel></rss>`
const ATOM_ENTRY = (content: string): string =>
  `<feed xmlns="http://www.w3.org/2005/Atom"><entry><content type="html">${content}</content></entry></feed>`

test("the blog output allows SVG images and pages without images", () => {
  assert.deepEqual(
    blogImageIssues([
      asset("posts/index.html", "<main><h1>Blog</h1></main>"),
      asset("posts/a-post/index.html", SVG_POST),
      asset("posts/rss.xml", RSS_ENTRY('<p><img src="https://x.example/a.svg?v=1"></p>')),
      asset("posts/atom.xml", ATOM_ENTRY("&lt;img src=&quot;/b.svg&quot;&gt;")),
      // Ardo copies SVG sources of post images unchanged.
      asset("assets/posts/0123456789abcdef0123.svg", "<svg/>"),
      // Outside the blog, the site keeps its Bunny images.
      asset("company/index.html", '<img src="https://assets.example/team.png">'),
    ]),
    []
  )
})

test("the blog output rejects raster images in documents, feeds, and renditions", () => {
  assert.deepEqual(
    blogImageIssues([
      asset(
        "posts/a-post/index.html",
        '<main><img src="/photo.jpg"><img alt="" src=\'/b.PNG\'></main>'
      ),
      asset(
        "posts/tags/internationalization/index.html",
        '<main><picture><source srcset="/a.avif 1x, /a.svg 2x"><img src="/a.svg"></picture></main>'
      ),
      asset("posts/rss.xml", RSS_ENTRY('<img src="https://x.example/a.webp">')),
      asset("posts/atom.xml", ATOM_ENTRY("&lt;img src=&quot;/c.gif&quot;&gt;")),
      asset("posts/index.html", '<main id="main"><img src="data:image/png;base64,AAAA"></main>'),
      asset("assets/posts/0123456789abcdef0123.avif", ""),
    ]),
    [
      "posts/a-post/index.html: image /photo.jpg is not an SVG",
      "posts/a-post/index.html: image /b.PNG is not an SVG",
      "posts/tags/internationalization/index.html: image /a.avif is not an SVG",
      "posts/rss.xml: image https://x.example/a.webp is not an SVG",
      "posts/atom.xml: image /c.gif is not an SVG",
      "posts/index.html: image data:image/png;base64,AAAA is not an SVG",
      "assets/posts/0123456789abcdef0123.avif: publication image renditions are not allowed",
    ]
  )
})

test("the blog output finds raster images in an upper-case main element", () => {
  assert.deepEqual(
    blogImageIssues([asset("posts/a-post/index.html", '<MAIN><img src="/photo.jpg"></MAIN>')]),
    ["posts/a-post/index.html: image /photo.jpg is not an SVG"]
  )
})

test("the blog output rejects raster SVG images, video posters, and objects", () => {
  assert.deepEqual(
    blogImageIssues([
      asset(
        "posts/a-post/index.html",
        [
          "<main>",
          '<svg><image href="/inline.png"/><image xlink:href="/legacy.jpg"/><image href="/ok.svg"/></svg>',
          '<video poster="/poster.webp" src="/clip.svg"></video>',
          '<object data="/chart.avif" type="image/avif"></object><object data="/chart.svg"></object>',
          // Data attributes and a link's href are no image references.
          '<img data-src="/lazy.jpg" src="/a.svg" alt=""><a href="/photo.jpg">Photo</a>',
          "</main>",
        ].join("")
      ),
      asset(
        "posts/rss.xml",
        RSS_ENTRY(
          '<video poster="https://x.example/p.jpg"></video><svg><image href="/i.gif"/></svg>'
        )
      ),
    ]),
    [
      "posts/a-post/index.html: image /inline.png is not an SVG",
      "posts/a-post/index.html: image /legacy.jpg is not an SVG",
      "posts/a-post/index.html: image /poster.webp is not an SVG",
      "posts/a-post/index.html: image /chart.avif is not an SVG",
      "posts/rss.xml: image https://x.example/p.jpg is not an SVG",
      "posts/rss.xml: image /i.gif is not an SVG",
    ]
  )
})

test("each blog document needs exactly one <main>", () => {
  assert.deepEqual(
    blogImageIssues([
      asset("posts/index.html", '<body><img src="/photo.jpg"></body>'),
      asset("posts/a-post/index.html", "<main>One</main><MAIN>Two</MAIN>"),
      asset("posts/b-post/index.html", '<main id="main"><p>Fine</p></main>'),
      // Outside the blog documents, the rule does not apply.
      asset("company/index.html", "<div></div>"),
    ]),
    [
      "posts/index.html: a blog document needs exactly one <main>, found 0",
      "posts/a-post/index.html: a blog document needs exactly one <main>, found 2",
    ]
  )
})

test("only tech blog builds carry the blog output check", () => {
  const raster = [asset("posts/a-post/index.html", '<main><img src="/photo.jpg"></main>')]
  const blog = target("sebastian-websites-blog-de")
  assert.ok(isBlogTarget(blog))
  assert.equal(isBlogTarget(target("sebastian-websites-software-de")), false)
  assert.throws(() => {
    assertBlogOutput(blog, raster)
  }, /raster images before the image plan:\n- posts\/a-post\/index.html: image \/photo.jpg/v)
  const consulting = target("sebastian-websites-consulting-de")
  assert.equal(isBlogTarget(consulting), false)
  assert.doesNotThrow(() => {
    assertBlogOutput(consulting, raster)
  })
})
