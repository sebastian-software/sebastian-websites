import { sharedVitestTestConfig } from "@sebastian-websites/config/vitest"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    ...sharedVitestTestConfig,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})
