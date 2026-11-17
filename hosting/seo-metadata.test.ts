import assert from "node:assert/strict"
import { test } from "node:test"

import { createSeoLinks } from "../packages/web-core/src/seo.ts"
import { getSiteVariant } from "../packages/web-core/src/sites.ts"
import { assertDocument, type SeoPlan } from "./seo-documents.ts"

function fixture(path = "/"): { html: string; plan: SeoPlan } {
  const links = createSeoLinks("consulting", "en", path)
  const plan: SeoPlan = {
    absent: [],
    alternates: new Map([
      [
        path,
        links.flatMap((link) =>
          link.hrefLang === undefined ? [] : [{ href: link.href, language: link.hrefLang }]
        ),
      ],
    ]),
    dark: [],
    paths: [path],
    variant: getSiteVariant("consulting", "en"),
  }
  const head = links
    .map((link) => {
      const language = link.hrefLang === undefined ? "" : ` hreflang="${link.hrefLang}"`
      return `<link rel="${link.rel}" href="${link.href}"${language}>`
    })
    .join("")
  return {
    html: `<html lang="en"><head>${head}<title>Consulting</title><meta name="description" content="Architecture reviews."></head><body>Service information</body></html>`,
    plan,
  }
}

test("indexable acquisition pages reject missing, empty, and conflicting copy metadata", () => {
  const { html, plan } = fixture()
  assert.doesNotThrow(() => {
    assertDocument(html, plan, "/")
  })
  for (const modified of [
    html.replace("<title>Consulting</title>", ""),
    html.replace("<title>Consulting</title>", "<title> </title>"),
    html.replace("</head>", "<title>Conflicting title</title></head>"),
    html.replace('<meta name="description" content="Architecture reviews.">', ""),
    html.replace('content="Architecture reviews."', 'content="  "'),
    html.replace("</head>", '<meta name="Description" content="Conflicting description"></head>'),
  ])
    assert.throws(() => {
      assertDocument(modified, plan, "/")
    }, /SEO \/: expected one nonempty (?:title|description)/v)
})

test("legal pages may omit descriptions while retaining their title and canonical contract", () => {
  for (const path of ["/imprint", "/privacy"]) {
    const { html, plan } = fixture(path)
    assert.doesNotThrow(() => {
      assertDocument(
        html.replace('<meta name="description" content="Architecture reviews.">', ""),
        plan,
        path
      )
    })
  }
})

test("comments and metadata outside the head do not satisfy the description requirement", () => {
  const { html, plan } = fixture()
  const tag = '<meta name="description" content="Architecture reviews.">'
  const commented = html.replace(tag, `<!--${tag}-->`)
  assert.throws(() => {
    assertDocument(commented.replace("</body>", `${tag}</body>`), plan, "/")
  }, /nonempty description/v)
})
