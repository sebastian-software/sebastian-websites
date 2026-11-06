import { palamedes } from "@palamedes/vite-plugin"
import { getVariant } from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import { ardo, defineConfig, type Plugin } from "ardo/vite"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { sharedMacros } from "./scripts/macros.ts"

const variantId = process.env.SITE_VARIANT ?? "software-en"
const variant = getVariant(variantId)
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
      return id === "virtual:software-metrics" || id === "virtual:software-catalog"
        ? `\0${id}`
        : undefined
    },
    async load(id) {
      if (id === "\0virtual:software-metrics") {
        const snapshot = JSON.parse(await readFile(path.resolve("metrics.json"), "utf8")) as unknown
        return `export default ${JSON.stringify(snapshot)}`
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
    __SITE_VARIANT__: JSON.stringify(variantId),
  },
  plugins: [
    bunnyImages(),
    buildData(),
    sharedMacros(),
    palamedes({ failOnMissing: true }),
    ardo({
      title: "Sebastian Software",
      siteUrl: variant.canonicalOrigin,
      lang: variant.locale,
      // The hosting contract keeps the not-found page out of every sitemap.
      seo: { sitemap: { exclude: ["/404"] }, llms: false },
      linkCheck: { enabled: true, level: "error" },
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
