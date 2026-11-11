import { fetchMetricsSummary } from "@sebastian-websites/content"
import type { Plugin } from "ardo/vite"
import { createSiteConfig } from "@sebastian-websites/site/config"
import { BLOG_PATH, getVariant, type Locale } from "@sebastian-websites/web-core"
import { FOUNDER_NAMES } from "./app/lib/founderNames.ts"
import { blogData, prepareBlog } from "./scripts/blog-data.ts"

const variant = getVariant(process.env.SITE_VARIANT ?? "software-en")
const indexed = process.env.SOFTWARE_BLOG_INDEXED !== "false"
const copy: Readonly<Record<Locale, { description: string; name: string }>> = {
  de: { description: "Beiträge von Sebastian Software.", name: "Blog" },
  en: { description: "Posts from Sebastian Software.", name: "Blog" },
}
const { source } = await prepareBlog()

const metrics = process.env.SOFTWARE_METRICS ?? JSON.stringify(await fetchMetricsSummary())
const data: Plugin = {
  name: "software:metrics",
  resolveId: (id) => (id === "virtual:software-metrics" ? `\0${id}` : undefined),
  load: (id) => (id === "\0virtual:software-metrics" ? `export default ${metrics}` : undefined),
}

const vite = {
  define: { __BLOG_INDEXED__: JSON.stringify(process.env.SOFTWARE_BLOG_INDEXED !== "false") },
  plugins: [data, blogData()],
}

export default createSiteConfig({
  site: "software",
  root: import.meta.dirname,
  vite,
  title: "Sebastian Software",
  seo: { sitemap: { exclude: indexed ? ["/404"] : ["/404", BLOG_PATH] }, llms: false },
  publication: {
    from: source,
    to: "blog",
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
