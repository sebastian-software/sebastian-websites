import rootConfig from "../../eslint.config.ts"

export default [
  ...rootConfig,
  { ignores: ["app/routes/posts/**"] },
  {
    files: ["app/**/*.test.ts", "scripts/**/*.test.ts"],
    name: "sebastian-websites/blog-tests",
    rules: {
      // node:test registers and runs the tests it is given.
      "@typescript-eslint/no-floating-promises": "off",
      // The tests read and write their own temporary directories.
      "security/detect-non-literal-fs-filename": "off",
    },
  },
]
