import { sharedVitestTestConfig } from "@sebastian-websites/config/vitest"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "~": fileURLToPath(new URL("app", import.meta.url)) } },
  test: {
    ...sharedVitestTestConfig,
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
})
