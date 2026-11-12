import { createSiteConfig } from "@sebastian-websites/site/config"
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

export default createSiteConfig({
  site: "blog",
  title: "Sebastian Software Blog",
  seo: { sitemap: { exclude: indexed ? ["/404"] : ["/404", BLOG_PATH] }, llms: false },
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
