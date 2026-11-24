import { getVariant, ORGANIZATION_ID, personIdentity } from "@sebastian-websites/web-core"
import assert from "node:assert/strict"
import { test } from "node:test"

import { postStructuredData } from "./postStructuredData.ts"

const article = {
  authors: [
    { id: "werner", name: "Sebastian Werner" },
    { id: "fastner", name: "Sebastian Fastner" },
    { name: "Guest author" },
  ],
  description: "A real engineering question.",
  path: "/posts/engineering-question",
  publishedAt: "2026-11-17T10:00:00Z",
  title: "An engineering question",
}

test("article facts share canonical URLs and known identities in both languages", () => {
  for (const locale of ["de", "en"] as const) {
    const variant = getVariant(`blog-${locale}`)
    const schema = postStructuredData(article, variant)
    assert.equal(schema["@type"], "BlogPosting")
    assert.deepEqual(schema.mainEntityOfPage, {
      "@id": `${variant.canonicalOrigin}${article.path}`,
      "@type": "WebPage",
    })
    assert.equal(schema.inLanguage, locale)
    assert.equal(schema.datePublished, article.publishedAt)
    assert.equal(schema.headline, article.title)
    assert.equal(schema.description, article.description)
    assert.deepEqual(schema.publisher, { "@id": ORGANIZATION_ID })
    assert.deepEqual(schema.author, [
      personIdentity("werner", locale),
      personIdentity("fastner", locale),
      { "@type": "Person", name: "Guest author" },
    ])
    assert.equal("dateModified" in schema, false)
    assert.equal("image" in schema, false)
  }
})

test("only recorded updates and actual representative images enter article metadata", () => {
  const updatedAt = "2026-11-18T10:00:00Z"
  const image = {
    height: 630,
    url: "https://blog.sebastian-software.com/images/cover.jpg",
    width: 1200,
  }
  const schema = postStructuredData({ ...article, updatedAt }, getVariant("blog-en"), image)
  assert.equal(schema.dateModified, updatedAt)
  assert.equal(schema.image, image.url)
})
