import type { ArdoPluginOptions, Plugin, UserConfig } from "ardo/vite"

import { palamedes } from "@palamedes/vite-plugin"
import { getVariant, type SiteId } from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import path from "node:path"
import { mergeConfig } from "vite"

import { webManifest } from "./manifest.ts"

/**
 * Normal Ardo settings for one domain build of a website.
 * @param root0 - The selected website settings.
 * @param root0.site - The website identifier.
 * @returns The Ardo settings of the selected domain.
 */
export function createSiteConfig({
  site,
  ...options
}: { readonly site: SiteId } & ArdoPluginOptions): ArdoPluginOptions {
  const variantId = process.env.SITE_VARIANT ?? `${site}-en`
  const variant = getVariant(variantId)
  return {
    buildTime: process.env.SITE_BUILD_DATE,
    icons: false,
    lang: variant.locale,
    linkCheck: { enabled: true, level: "error" },
    outDir: path.join(process.env.SITE_OUTPUT_ROOT ?? "build", variantId),
    seo: { llms: false, sitemap: { exclude: ["/404"] } },
    siteUrl: variant.canonicalOrigin,
    trailingSlash: false,
    ...options,
  }
}

/**
 * The only translation catalog included in a domain's browser bundle.
 * @param root - The application directory.
 * @param locale - The active domain language.
 * @returns The active catalog Vite module.
 */
function catalog(root: string, locale: string): Plugin {
  const source = JSON.stringify(path.join(root, "app/locales", `${locale}.po`))
  return {
    load: (id) =>
      id === "\0virtual:site-catalog" ? `export { messages } from ${source}` : undefined,
    name: "websites:catalog",
    resolveId: (id) => (id === "virtual:site-catalog" ? `\0${id}` : undefined),
  }
}

/**
 * Optional site integrations; Ardo itself owns React, Vanilla Extract and the build.
 * @param root0 - The selected website settings.
 * @param root0.root - The application directory.
 * @returns The website Vite integrations.
 */
export function websiteViteConfig({
  root,
  ...options
}: { readonly root: string } & UserConfig): UserConfig {
  const variantId = process.env.SITE_VARIANT ?? `${path.basename(root)}-en`
  const variant = getVariant(variantId)
  const buildDate = process.env.SITE_BUILD_DATE ?? new Date().toISOString()
  const runtimeImports = [
    "@palamedes/core",
    "@palamedes/core/compiled",
    "@palamedes/core/locale",
    "@palamedes/react/compiled",
    "@palamedes/runtime",
    "@palamedes/runtime/internal",
    "@sebastian-websites/ui > lucide-react",
  ]
  return mergeConfig(
    {
      define: {
        __BUILD_DATE__: JSON.stringify(buildDate),
        __BUILD_YEAR__: JSON.stringify(
          Number(
            new Intl.DateTimeFormat("en", { timeZone: "Europe/Berlin", year: "numeric" }).format(
              new Date(buildDate)
            )
          )
        ),
        __SITE_VARIANT__: JSON.stringify(variantId),
      },
      optimizeDeps: { include: runtimeImports },
      plugins: [
        bunnyImages(),
        catalog(root, variant.locale),
        webManifest(variantId),
        palamedes({ failOnMissing: true, mdx: false, runtimeModule: "@palamedes/runtime" }),
      ],
      resolve: { alias: { "~": path.join(root, "app") } },
      ssr: {
        optimizeDeps: {
          include: [
            ...runtimeImports,
            "@palamedes/runtime/server",
            "@sebastian-websites/site > @palamedes/vite-plugin/delivery",
          ],
        },
      },
    },
    options
  )
}
