import { createSiteConfig } from "@sebastian-websites/site/config"
import { DESKTOP, editorialSizes } from "@sebastian-websites/ui/responsive"
import { BLOG_PATH, getVariant, type Locale } from "@sebastian-websites/web-core"
import { FOUNDER_NAMES } from "./app/lib/founderNames.ts"
import { prepareBlog } from "./scripts/blog-data.ts"

const variant = getVariant(process.env.SITE_VARIANT ?? "blog-en")
const indexed = process.env.BLOG_INDEXED !== "false"
// Feed readers show the name, so it names the company; the descriptions stay without address.
const copy: Readonly<Record<Locale, { description: string; name: string }>> = {
  de: {
    description: "Wie wir Software bauen: Architektur, Agents und unsere Open-Source-Projekte.",
    name: "Sebastian Software Blog",
  },
  en: {
    description: "How we build software: architecture, agents, and our open-source projects.",
    name: "Sebastian Software Blog",
  },
}
const { source } = await prepareBlog()

/**
 * Post images and covers fill the text measure: eight of the twelve columns,
 * about 680 px on the 1040 px design page. Framed images switch from 4:3 to
 * 16:10 where the column layout starts, as in Ardo's own article preset.
 */
const POST_IMAGE_WIDTH = 680

export default createSiteConfig({
  site: "blog",
  title: "Sebastian Software Blog",
  seo: { sitemap: { exclude: indexed ? ["/404"] : ["/404", BLOG_PATH] }, llms: false },
  // Ardo renders the AVIF and JPEG renditions of post images with sharp at build time.
  images: {
    presets: {
      article: {
        fallback: "4:3",
        sizes: editorialSizes(POST_IMAGE_WIDTH),
        sources: [{ composition: "16:10", media: DESKTOP }],
      },
    },
  },
  publication: {
    from: source,
    to: BLOG_PATH.slice(1),
    ...copy[variant.locale],
    authors: { fastner: { name: FOUNDER_NAMES.fastner }, werner: { name: FOUNDER_NAMES.werner } },
    tags: true,
    feeds: { entryIds: "publication" },
    components: {
      index: "app/components/blog/BlogIndex.tsx",
      post: "app/components/blog/BlogPost.tsx",
      tag: "app/components/blog/TagArchive.tsx",
    },
    tagLabel: "app/components/blog/tagLabel.ts",
  },
})
