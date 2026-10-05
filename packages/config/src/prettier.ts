import type { Config } from "prettier"

const config = {
  arrowParens: "always",
  bracketSpacing: true,
  printWidth: 100,
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
} satisfies Config

export default config
