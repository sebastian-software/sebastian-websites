import { defineConfig } from "@playwright/test"
import path from "node:path"

const reference = path.resolve(
  process.env.SOFTWARE_VISUAL_REFERENCE ?? path.join(import.meta.dirname, "visual-reference")
)

export default defineConfig({
  expect: {
    toMatchSnapshot: { maxDiffPixels: 150, threshold: 0.1 },
  },
  outputDir: process.env.SOFTWARE_VISUAL_RESULTS ?? "../build/visual-results",
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: process.env.SOFTWARE_VISUAL_REPORT ?? "../build/visual-report",
      },
    ],
  ],
  snapshotPathTemplate: `${reference}/{arg}{ext}`,
  testDir: ".",
  testMatch: "visual.spec.ts",
  updateSnapshots: "none",
})
