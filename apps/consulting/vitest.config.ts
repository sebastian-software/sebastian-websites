import { sharedVitestTestConfig } from "@sebastian-websites/config/vitest"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: { alias: { "~": fileURLToPath(new URL("app", import.meta.url)) } },
  test: {
    ...sharedVitestTestConfig,
    include: ["app/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.ts"],
  },
})
