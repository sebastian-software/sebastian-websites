// cspell:ignore Oxlint
import { getOxlintConfig } from "eslint-config-setup"

const sharedIgnorePatterns = [
  "**/*.md",
  "**/*.json",
  "**/build/**",
  "**/dist/**",
  "**/.variant-build/**",
  "**/.react-router/**",
  "**/temp/**",
  "**/_generated/**",
  "**/node_modules/**",
  "**/*.config.js",
  "**/*.config.ts",
  "**/locales/**/*.js",
]

export type OxlintConfigOptions = {
  readonly ignorePatterns?: readonly string[]
  readonly react?: boolean
}

type SharedOxlintConfig = {
  readonly ignorePatterns: string[]
} & ReturnType<typeof getOxlintConfig>

export function createOxlintConfig(options: OxlintConfigOptions = {}): SharedOxlintConfig {
  const config = getOxlintConfig({
    ai: true,
    node: true,
    react: options.react ?? false,
  })

  return {
    ...config,
    ignorePatterns: [...sharedIgnorePatterns, ...(options.ignorePatterns ?? [])],
    rules: {
      ...config.rules,
      ...(options.react === true
        ? {
            "react-perf/jsx-no-jsx-as-prop": "off",
            "react-perf/jsx-no-new-array-as-prop": "off",
            "react-perf/jsx-no-new-function-as-prop": "off",
            "react-perf/jsx-no-new-object-as-prop": "off",
          }
        : {}),
    },
  }
}
