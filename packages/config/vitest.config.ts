import { defineConfig } from "vitest/config"

import { sharedVitestTestConfig } from "./src/vitest.ts"

export default defineConfig({
  test: {
    ...sharedVitestTestConfig,
    include: ["src/**/*.{test,spec}.ts"],
    server: {
      deps: {
        external: ["typescript"],
      },
    },
  },
})
