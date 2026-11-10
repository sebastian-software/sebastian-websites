import type { Plugin } from "ardo/vite"

import { getVariant, SITE_BRAND } from "@sebastian-websites/web-core"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)

/**
 * Emit the same hashed brand icons used by the HTML into a static web manifest.
 * @param variantId - The selected domain build.
 * @returns The static manifest Vite plugin.
 */
export function webManifest(variantId: string): Plugin {
  const site = getVariant(variantId).site
  const brand = SITE_BRAND[site]
  const directory = path.join(
    path.dirname(require.resolve("@sebastian-websites/ui")),
    "assets/favicons",
    brand
  )
  const names = {
    "app-tracking": "app-tracking – Sebastian Software",
    consulting: "Sebastian Consulting",
    opensource: "Open Source – Sebastian Software",
    skills: "Sebastian Software",
    software: "Sebastian Software",
  }
  const name = names[site]
  const icons = [
    { file: "icon-192.png", sizes: "192x192" },
    { file: "icon-mask.png", purpose: "maskable", sizes: "512x512" },
    { file: "icon-512.png", sizes: "512x512" },
  ]
  let references: string[] = []
  let building = false
  return {
    buildStart() {
      if (building && this.environment.name === "client")
        references = icons.map(({ file }) =>
          this.emitFile({
            name: file,
            source: readFileSync(path.join(directory, file)),
            type: "asset",
          })
        )
    },
    configResolved(config) {
      building = config.command === "build"
    },
    configureServer(server) {
      server.middlewares.use("/manifest.webmanifest", (_request, response) => {
        response.setHeader("content-type", "application/manifest+json")
        response.end(
          JSON.stringify({
            icons: icons.map(({ file, ...icon }) => ({
              ...icon,
              src: `/@fs${path.join(directory, file)}`,
              type: "image/png",
            })),
            name,
          })
        )
      })
    },
    generateBundle() {
      if (this.environment.name !== "client") return
      const generated = icons.map(({ file: _file, ...icon }, index) => ({
        ...icon,
        src: `/${this.getFileName(references[index])}`,
        type: "image/png",
      }))
      this.emitFile({
        fileName: "manifest.webmanifest",
        source: `${JSON.stringify({ icons: generated, name }, null, 2)}\n`,
        type: "asset",
      })
    },
    name: "websites:manifest",
  }
}
