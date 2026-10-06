/* eslint-disable security/detect-non-literal-fs-filename -- Validated hash paths are read below a build directory. */
import { readFile } from "node:fs/promises"

import { type Asset, checksum } from "./publish.ts"

const IMAGE_PATH = /^images\/[a-f0-9]{64}\.(?:jpg|png|webp|avif|gif)$/v

function isImagePaths(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every((path: unknown) => typeof path === "string" && IMAGE_PATH.test(path))
  )
}

/**
 * Reads the Vite image manifest and verifies that each path matches its bytes.
 *
 * @param directory - Client build directory.
 * @returns Original images to publish to the shared asset zone before documents.
 */
export async function loadBunnyImages(directory: string): Promise<readonly Asset[]> {
  let manifest: string
  try {
    manifest = await readFile(`${directory}/_bunny/images.json`, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return []
    throw error
  }
  const paths: unknown = JSON.parse(manifest)
  if (!isImagePaths(paths)) {
    throw new Error(`Invalid Bunny image manifest in ${directory}`)
  }
  const images: Asset[] = []
  for (const path of new Set(paths)) {
    const bytes = new Uint8Array(await readFile(`${directory}/${path}`))
    if (checksum(bytes).toLowerCase() !== path.slice("images/".length).split(".")[0]) {
      throw new Error(`Bunny image checksum mismatch: ${path}`)
    }
    images.push({ bytes, path })
  }
  return images
}
