/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from Vite's module resolver. */
import type { Plugin } from "vite"

import { imageSize } from "image-size"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"

import type { ImageSource } from "./image.ts"

const SUFFIX = "?bunny"
const MANIFEST = "_bunny/images.json"
const FIRST_ROTATED_ORIENTATION = 5
const EXTENSIONS = new Map([
  ["avif", "avif"],
  ["gif", "gif"],
  ["jpg", "jpg"],
  ["png", "png"],
  ["webp", "webp"],
])

/**
 * Imports raster originals as metadata with an immutable shared asset path.
 * Client builds emit the originals and an upload manifest; dev uses Vite URLs.
 *
 * @returns The Vite plugin for imports such as `./portrait.jpg?bunny`.
 */
export function bunnyImages(): Plugin {
  const environments = new Map<string, Map<string, Uint8Array>>()
  const imagesFor = (name: string): Map<string, Uint8Array> => {
    let images = environments.get(name)
    if (images === undefined) {
      images = new Map()
      environments.set(name, images)
    }
    return images
  }
  let development = false
  return {
    buildStart() {
      imagesFor(this.environment.name).clear()
    },
    configResolved(config) {
      development = config.command === "serve"
    },
    enforce: "pre",
    generateBundle() {
      const images = imagesFor(this.environment.name)
      if (this.environment.config.consumer === "server" || images.size === 0) return
      const entries = [...images.entries()].toSorted(([left], [right]) => left.localeCompare(right))
      for (const [path, bytes] of entries) {
        this.emitFile({ fileName: path, source: bytes, type: "asset" })
      }
      this.emitFile({
        fileName: MANIFEST,
        source: JSON.stringify(entries.map(([path]) => path)),
        type: "asset",
      })
    },
    async load(id) {
      if (!id.endsWith(SUFFIX)) return
      const file = id.slice(0, -SUFFIX.length)
      this.addWatchFile(file)
      const bytes = await readFile(file)
      const dimensions = imageSize(bytes)
      const extension = EXTENSIONS.get(dimensions.type ?? "")
      if (extension === undefined) {
        throw new Error(`Unsupported Bunny image format in ${file}; use a normal import for SVG`)
      }
      const hash = createHash("sha256").update(bytes).digest("hex")
      const rotated =
        dimensions.orientation !== undefined && dimensions.orientation >= FIRST_ROTATED_ORIENTATION
      const source: ImageSource = {
        height: rotated ? dimensions.width : dimensions.height,
        path: `images/${hash}.${extension}`,
        width: rotated ? dimensions.height : dimensions.width,
      }
      imagesFor(this.environment.name).set(source.path, bytes)
      const metadata = JSON.stringify(source)
      const localImport = JSON.stringify(`${file}?no-inline`)
      return development
        ? `import localSrc from ${localImport}; export default { ...${metadata}, localSrc };`
        : `export default ${metadata};`
    },
    name: "websites:bunny-images",
    async resolveId(id, importer) {
      if (!id.endsWith(SUFFIX)) return
      const resolved = await this.resolve(id.slice(0, -SUFFIX.length), importer, { skipSelf: true })
      if (resolved === null) throw new Error(`Cannot resolve Bunny image ${id}`)
      return `${resolved.id}${SUFFIX}`
    },
  }
}
