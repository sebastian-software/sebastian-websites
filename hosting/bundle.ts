import { build } from "esbuild"
import { fileURLToPath } from "node:url"

/**
 * Bundles the middleware for one storage zone into the single file Bunny
 * accepts. The SDK stays external; the edge runtime provides it.
 *
 * @param storageZone - The storage zone name the middleware resolves paths for.
 * @returns The bundled source.
 */
export async function bundleMiddleware(storageZone: string): Promise<string> {
  const result = await build({
    bundle: true,
    define: { STORAGE_ZONE: JSON.stringify(storageZone) },
    entryPoints: [fileURLToPath(new URL("middleware.ts", import.meta.url))],
    external: ["@bunny.net/edgescript-sdk"],
    format: "esm",
    logLevel: "silent",
    platform: "neutral",
    target: "es2022",
    write: false,
  })
  const file = result.outputFiles.at(0)
  if (file === undefined) {
    throw new Error("The middleware bundle is empty")
  }
  return file.text
}
