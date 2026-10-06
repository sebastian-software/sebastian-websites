import { createEslintConfig } from "@sebastian-websites/config/eslint"

const config = await createEslintConfig({ react: true })

export default [
  ...config,
  {
    files: ["hosting/**/*.ts"],
    name: "sebastian-websites/hosting",
    // The deployment scripts talk to rate-limited APIs in a deliberate order:
    // zones before rules, assets before documents, uploads before purges.
    rules: { "no-await-in-loop": "off" },
  },
  {
    files: ["packages/content/src/data/*.ts"],
    name: "sebastian-websites/generated-data",
    // Generated from the capture of the old site; long by nature.
    rules: { "max-lines": "off", "sonarjs/no-duplicate-string": "off" },
  },
  {
    files: ["hosting/**/*.test.ts"],
    name: "sebastian-websites/hosting-tests",
    // Test fixtures model a whole Bunny account in one function.
    rules: {
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/strict-void-return": "off",
      complexity: "off",
      "max-statements": "off",
      "sonarjs/cognitive-complexity": "off",
    },
  },
]
