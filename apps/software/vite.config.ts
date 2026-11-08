import { palamedes } from "@palamedes/vite-plugin"
import {
  authorAvatarIssues,
  BLOG_PATH,
  getVariant,
  type Locale,
} from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import { ardo, defineConfig, type Plugin } from "ardo/vite"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { FOUNDER_NAMES } from "./app/lib/founderNames.ts"
import { sharedMacros } from "./scripts/macros.ts"

const variantId = process.env.SITE_VARIANT ?? "software-en"
const variant = getVariant(variantId)
/**
 * `build.ts` sets both for each variant build: the shared build time of both
 * languages, and the app directory the staged project mirrors, whose Git
 * history dates its routes. A plain `ardo` run without them uses Ardo's defaults.
 */
const buildTime = process.env.SOFTWARE_BUILD_TIME
const sourceRoot = process.env.SOFTWARE_SOURCE_ROOT
// build.ts sets false while the blog navigation is off; development builds index the blog.
const blogIndexed = process.env.SOFTWARE_BLOG_INDEXED !== "false"
/** Literal per language: the feed titles come from them, so they cannot use Palamedes macros. */
const PUBLICATION_COPY: Readonly<Record<Locale, { description: string; name: string }>> = {
  de: { description: "Beiträge von Sebastian Software.", name: "Blog" },
  en: { description: "Posts from Sebastian Software.", name: "Blog" },
}
/**
 * The founders' names, which are not translated, are all Ardo's feeds use;
 * roles and bios stay Palamedes messages in the site's founder module
 * (`app/lib/founders.ts`). No avatars until the image plan.
 */
const AUTHORS = {
  fastner: { name: FOUNDER_NAMES.fastner },
  werner: { name: FOUNDER_NAMES.werner },
}
const avatarIssues = authorAvatarIssues(AUTHORS)
if (avatarIssues.length > 0) {
  throw new Error(`The blog authors are invalid:\n${avatarIssues.join("\n")}`)
}
const runtimeImports = [
  "@palamedes/core",
  "@palamedes/core/compiled",
  "@palamedes/react/compiled",
  "@palamedes/runtime",
  "@sebastian-websites/ui",
  "@sebastian-websites/ui/brand-software.css",
  "@sebastian-websites/ui/error-copy",
  "@sebastian-websites/ui/frame-copy",
  "@sebastian-websites/web-core",
  "@sebastian-websites/legal",
  "@sebastian-websites/content",
  "@sebastian-websites/tokens",
]

/** Share one immutable metrics snapshot and one locale catalog between SSR and hydration. */
function buildData(): Plugin {
  return {
    name: "software:build-data",
    resolveId(id) {
      return id === "virtual:software-metrics" ||
        id === "virtual:software-catalog" ||
        id === "virtual:software-blog-tags"
        ? `\0${id}`
        : undefined
    },
    async load(id) {
      if (id === "\0virtual:software-metrics") {
        const snapshot = JSON.parse(await readFile(path.resolve("metrics.json"), "utf8")) as unknown
        return `export default ${JSON.stringify(snapshot)}`
      }
      if (id === "\0virtual:software-blog-tags") {
        // Written by build.ts while staging the posts; only the tag archive module imports it.
        const file = path.resolve("blog-tags.json")
        this.addWatchFile(file)
        const tags = JSON.parse(await readFile(file, "utf8")) as unknown
        return `export default ${JSON.stringify(tags)}`
      }
      if (id === "\0virtual:software-catalog") {
        return `export { messages } from ${JSON.stringify(path.resolve("app/locales", `${variant.locale}.po`))}`
      }
      return undefined
    },
  }
}

export default defineConfig({
  define: {
    __BUILD_YEAR__: JSON.stringify(Number(process.env.BUILD_YEAR ?? new Date().getFullYear())),
    __BLOG_INDEXED__: JSON.stringify(blogIndexed),
    __SITE_VARIANT__: JSON.stringify(variantId),
  },
  plugins: [
    bunnyImages(),
    buildData(),
    sharedMacros(),
    // Posts are written per language, not translated through the catalog. Palamedes' MDX
    // transform would treat their prose as catalog messages, so it skips the generated blog routes.
    palamedes({ exclude: [/node_modules/v, /\/app\/routes\/blog\//v], failOnMissing: true }),
    ardo({
      title: "Sebastian Software",
      siteUrl: variant.canonicalOrigin,
      lang: variant.locale,
      // The hosting contract keeps the not-found page out of every sitemap, and the
      // blog out of it until its navigation item launches.
      seo: { sitemap: { exclude: blogIndexed ? ["/404"] : ["/404", BLOG_PATH] }, llms: false },
      linkCheck: { enabled: true, level: "error" },
      // Canonicals, the sitemap, links, and publication URLs without a trailing slash (ADR-0010).
      trailingSlash: false,
      ...(buildTime === undefined ? {} : { buildTime }),
      ...(sourceRoot === undefined ? {} : { sourceRoot }),
      // One monolingual publication per domain; Ardo's i18n would add locale prefixes.
      publication: {
        from: `content/blog/${variant.locale}`,
        to: "blog",
        ...PUBLICATION_COPY[variant.locale],
        authors: AUTHORS,
        tags: true,
        // A translated pair shares its post id; qualify feed entries per domain.
        feeds: { entryIds: "publication" },
        components: {
          index: "app/components/blog/BlogIndex.tsx",
          post: "app/components/blog/BlogPost.tsx",
          tag: "app/components/blog/TagArchive.tsx",
        },
        tagLabel: "app/components/blog/tagLabel.ts",
      },
    }),
  ],
  // Generated source copies can replace inodes on mounted filesystems.
  server: { watch: { usePolling: true } },
  optimizeDeps: { include: runtimeImports },
  // Ardo loads the root and render hook after discovery. Prebundle their runtime once.
  ssr: {
    optimizeDeps: {
      include: [...runtimeImports, "@palamedes/runtime/server"],
    },
  },
  resolve: {
    alias: { "~": path.resolve("app") },
  },
})
