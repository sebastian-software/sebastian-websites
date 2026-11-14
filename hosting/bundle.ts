import { build } from "esbuild"
import { fileURLToPath } from "node:url"

import type { CollectorForwarding } from "./middleware-logic.ts"

/**
 * Bundles the middleware for one storage zone into the single file Bunny
 * accepts. The SDK stays external; the edge runtime provides it. A target
 * without a collector gets the plain middleware, byte for byte as before
 * first-party analytics existed.
 *
 * @param storageZone - The storage zone name the middleware resolves paths for.
 * @param collector - The target's first-party collector settings, if any.
 * @returns The bundled source.
 */
export async function bundleMiddleware(
  storageZone: string,
  collector?: CollectorForwarding
): Promise<string> {
  const entry = collector === undefined ? "middleware.ts" : "middleware-first-party.ts"
  const result = await build({
    bundle: true,
    define: {
      STORAGE_ZONE: JSON.stringify(storageZone),
      ...(collector === undefined ? {} : { COLLECTOR: JSON.stringify(collector) }),
    },
    entryPoints: [fileURLToPath(new URL(entry, import.meta.url))],
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
