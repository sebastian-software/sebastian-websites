import { fileURLToPath } from "node:url"
import { palamedes } from "@palamedes/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { getVariant } from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vite"

// One build per variant; the variant fixes language and origin at build time (ADR-0006).
const variantId = process.env.SITE_VARIANT ?? "software-en"
const variant = getVariant(variantId)

export default defineConfig({
  define: {
    __SITE_VARIANT__: JSON.stringify(variantId),
  },
  plugins: [
    bunnyImages(),
    palamedes({ failOnCompileError: true, failOnMissing: true, runtimeModule: "~/lib/i18n" }),
    vanillaExtractPlugin(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      "virtual:active-catalog": fileURLToPath(
        new URL(`./app/locales/${variant.locale}.po`, import.meta.url)
      ),
    },
    tsconfigPaths: true,
  },
})
