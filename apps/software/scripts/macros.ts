import type { Plugin } from "vite"

import { transformPalamedesMacros } from "@palamedes/transform"

/**
 * Compile macros to the public runtime; catalog loading belongs to the website.
 * @returns The application's macro compilation plugin.
 */
export function sharedMacros(): Plugin {
  return {
    enforce: "pre",
    name: "software:shared-macros",
    transform(code, id) {
      if (!/\.[jt]sx?$/v.test(id) || !code.includes("/macro")) return null
      const result = transformPalamedesMacros(code, id, { runtimeModule: "@palamedes/runtime" })
      return result.hasChanged ? { code: result.code, map: result.map } : undefined
    },
  }
}
