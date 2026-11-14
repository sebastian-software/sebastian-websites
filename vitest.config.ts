import type { UserWorkspaceConfig } from "vitest/config"

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { createRequire } from "node:module"
import path from "node:path"
import { defineConfig } from "vitest/config"

import { profileContent } from "./apps/consulting/scripts/profile-content.ts"
import { bunnyImages } from "./packages/web-core/src/bunnyImagesPlugin.ts"

const framework = createRequire(import.meta.resolve("ardo/package.json"))
const reactAliases = [
  { find: /^react$/u, replacement: framework.resolve("react") },
  { find: /^react\/jsx-runtime$/u, replacement: framework.resolve("react/jsx-runtime") },
  { find: /^react\/jsx-dev-runtime$/u, replacement: framework.resolve("react/jsx-dev-runtime") },
  { find: /^react-dom$/u, replacement: framework.resolve("react-dom") },
  { find: /^react-dom\/client$/u, replacement: framework.resolve("react-dom/client") },
  { find: /^react-dom\/server$/u, replacement: framework.resolve("react-dom/server") },
  { find: /^react-dom\/static$/u, replacement: framework.resolve("react-dom/static") },
]

/** Keep each package's test scope while sharing Ardo's React installation. */
function project(
  name: string,
  directory: string,
  options: UserWorkspaceConfig = {}
): UserWorkspaceConfig {
  const root = path.join(import.meta.dirname, directory)
  return {
    ...options,
    root,
    resolve: {
      alias: [...reactAliases, { find: "~", replacement: path.join(root, "app") }],
    },
    test: {
      name,
      include: ["src/**/*.{test,spec}.ts"],
      exclude: [
        "**/node_modules/**",
        "**/build/**",
        "**/dist/**",
        "**/.react-router/**",
        "**/.variant-build/**",
        "**/temp/**",
      ],
      ...options.test,
    },
  }
}

export default defineConfig({
  test: {
    projects: [
      project("consulting", "apps/consulting", {
        define: { __SITE_VARIANT__: JSON.stringify("consulting-en") },
        plugins: [
          profileContent(),
          // Transform styles in-process for Node component tests.
          vanillaExtractPlugin({ unstable_mode: "transform" }),
        ],
        test: { include: ["app/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.ts"] },
      }),
      project("opensource", "apps/opensource", {
        test: { include: ["app/**/*.{test,spec}.{ts,tsx}"] },
      }),
      project("ui", "packages/ui", {
        plugins: [bunnyImages(), vanillaExtractPlugin()],
        test: { environment: "happy-dom", include: ["src/**/*.{test,spec}.{ts,tsx}"] },
      }),
      project("legal", "packages/legal", {
        test: { include: ["src/**/*.{test,spec}.{ts,tsx}"] },
      }),
      project("config", "packages/config", {
        test: { server: { deps: { external: ["typescript"] } } },
      }),
      project("content", "packages/content"),
      project("tokens", "packages/tokens"),
      project("web-core", "packages/web-core"),
    ],
  },
})
