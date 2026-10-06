import { sharedVitestTestConfig } from "@sebastian-websites/config/vitest"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    ...sharedVitestTestConfig,
    include: ["src/**/*.{test,spec}.ts"],
  },
})
