import { createOxlintConfig } from "@sebastian-websites/config/oxlint"

const config = await createOxlintConfig({ react: true })

export default {
  ...config,
  overrides: [
    ...(config.overrides ?? []),
    {
      files: ["hosting/**/*.ts"],
      // Sequential by design; see eslint.config.ts.
      rules: { "no-await-in-loop": "off" },
    },
    {
      files: ["**/packages/content/src/data/*.ts"],
      rules: { "max-lines": "off" },
    },
    {
      files: ["hosting/**/*.test.ts"],
      rules: { complexity: "off", "max-statements": "off" },
    },
  ],
}
