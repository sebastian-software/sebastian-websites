import { fileURLToPath } from "node:url"
import { palamedes } from "@palamedes/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { getVariant } from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vite"

// One build per variant; the variant fixes language and origin at build time (ADR-0006).
const variantId = process.env.SITE_VARIANT ?? "consulting-en"
const variant = getVariant(variantId)
// One timestamp per build: the documents' "as of" date and the footer year agree.
const BUILD_DATE = new Date(process.env.SITE_BUILD_DATE ?? Date.now())

export default defineConfig({
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE.toISOString()),
    __BUILD_YEAR__: JSON.stringify(BUILD_DATE.getFullYear()),
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
      // Shared packages (the frame copy) use the macro runtime too; resolve it to
      // this app's i18n instance from outside the app as well.
      "~/lib/i18n": fileURLToPath(new URL("./app/lib/i18n.ts", import.meta.url)),
      "virtual:active-catalog": fileURLToPath(
        new URL(`./app/locales/${variant.locale}.po`, import.meta.url)
      ),
    },
    tsconfigPaths: true,
  },
})
