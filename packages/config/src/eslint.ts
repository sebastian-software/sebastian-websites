import type { Linter } from "eslint"

import { getEslintConfig } from "eslint-config-setup"

const sharedIgnores = [
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

export type EslintConfigOptions = {
  readonly ignores?: readonly string[]
  readonly react?: boolean
}

export async function createEslintConfig(
  options: EslintConfigOptions = {}
): Promise<Linter.Config[]> {
  const config = await getEslintConfig({
    ai: true,
    node: true,
    react: options.react ?? false,
  })
  const normalizedConfig = config
    .flat()
    .filter((block) => !block.name?.startsWith("eslint-config-setup/oxlint"))
  const reactPerformanceCompatibility: Linter.Config = {
    name: "@sebastian-websites/config/react-perf-compatibility",
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-perf/jsx-no-jsx-as-prop": "off",
      "react-perf/jsx-no-new-array-as-prop": "off",
      "react-perf/jsx-no-new-function-as-prop": "off",
      "react-perf/jsx-no-new-object-as-prop": "off",
      "react-you-might-not-need-an-effect/no-external-store-subscription": "off",
    },
  }

  const workspaceConfig: Linter.Config[] = [
    ...normalizedConfig,
    ...(options.react === true ? [reactPerformanceCompatibility] : []),
    {
      ignores: [...sharedIgnores, ...(options.ignores ?? [])],
      name: "@sebastian-websites/config/ignores",
    },
  ]

  return workspaceConfig
}
