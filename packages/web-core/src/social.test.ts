import { describe, expect, it } from "vitest"

import { createSocialMeta, type SocialMetaOptions } from "./social.ts"

const image = {
  height: 630,
  url: "https://assets.sebastian-software.com/images/a.png?width=1200&aspect_ratio=40:21&quality=85",
  width: 1200,
}

const page: SocialMetaOptions = {
  description: "What we build.",
  image,
  locale: "de",
  path: "/products/",
  site: "software",
  siteName: "Sebastian Software",
  title: "Products – Sebastian Software",
}

describe("social metadata", () => {
  it("describes a page with its canonical URL, language, image, and a large card", () => {
    expect(createSocialMeta(page)).toStrictEqual([
      { content: "website", property: "og:type" },
      { content: "Products – Sebastian Software", property: "og:title" },
      { content: "What we build.", property: "og:description" },
      { content: "https://sebastian-software.de/products", property: "og:url" },
      { content: "Sebastian Software", property: "og:site_name" },
      { content: "de_DE", property: "og:locale" },
      { content: image.url, property: "og:image" },
      { content: "1200", property: "og:image:width" },
      { content: "630", property: "og:image:height" },
      { content: "summary_large_image", name: "twitter:card" },
    ])
  })

  it("gives a document without a canonical no og:url", () => {
    const tags = createSocialMeta({ ...page, description: undefined, path: undefined })
    expect(tags).not.toContainEqual(expect.objectContaining({ property: "og:url" }))
    expect(tags).not.toContainEqual(expect.objectContaining({ property: "og:description" }))
  })

  it("marks articles with normalized publication and modification times and tags", () => {
    const tags = createSocialMeta({
      ...page,
      article: { publishedAt: "2026-11-17T09:00:00+01:00", tags: ["architecture"] },
      locale: "en",
      path: "/blog/first-post",
    })
    expect(tags).toContainEqual({ content: "article", property: "og:type" })
    expect(tags).toContainEqual({ content: "en_US", property: "og:locale" })
    expect(tags).toContainEqual({
      content: "2026-11-17T08:00:00.000Z",
      property: "article:published_time",
    })
    expect(tags).toContainEqual({
      content: "2026-11-17T08:00:00.000Z",
      property: "article:modified_time",
    })
    expect(tags).toContainEqual({ content: "architecture", property: "article:tag" })
    expect(
      createSocialMeta({
        ...page,
        article: { modifiedAt: "2026-11-18T10:00:00Z", publishedAt: "2026-11-17T09:00:00Z" },
      })
    ).toContainEqual({ content: "2026-11-18T10:00:00.000Z", property: "article:modified_time" })
  })

  it("rejects timestamps without a time zone, reversed times, and relative or insecure images", () => {
    expect(() =>
      createSocialMeta({ ...page, article: { publishedAt: "2026-11-17T09:00:00" } })
    ).toThrow("time zone")
    expect(() =>
      createSocialMeta({
        ...page,
        article: { modifiedAt: "2026-11-16T09:00:00Z", publishedAt: "2026-11-17T09:00:00Z" },
      })
    ).toThrow("precede")
    expect(() => createSocialMeta({ ...page, image: { ...image, url: "/images/a.png" } })).toThrow(
      "Invalid URL"
    )
    expect(() =>
      createSocialMeta({ ...page, image: { ...image, url: "http://example.com/a.png" } })
    ).toThrow("HTTPS")
    expect(() => createSocialMeta({ ...page, image: { ...image, width: 0 } })).toThrow("dimensions")
  })
})
