import rootConfig from "../../eslint.config.ts"

export default [
  ...rootConfig,
  {
    files: ["src/data/*.ts"],
    name: "sebastian-websites/generated-data",
    // Generated from the capture of the old site; long and repetitive by nature.
    rules: { "max-lines": "off", "sonarjs/no-duplicate-string": "off" },
  },
]
