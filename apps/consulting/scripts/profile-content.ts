import type { Plugin } from "ardo/vite"

import { fileURLToPath } from "node:url"

const directory = fileURLToPath(new URL("../app/content/werner/", import.meta.url)).replaceAll(
  "\\",
  "/"
)

// Profiles are prose with two explicit layout components, not executable MDX.
const layoutTags =
  /<\/?Project>|<\/Experience>|<Experience\s+id="(?:regrello|3degrees|otto-group|deutsche-bank-dws|telekom-zynga|enbw)"\s+title="[^"<>\n]+"\s*>/gv

/**
 * Keep localized profile sources within their public prose and layout contract.
 * @param source - The authored profile Markdown.
 */
export function assertProfileContent(source: string): void {
  const prose = source.replaceAll(layoutTags, "")
  if (/[<>]/v.test(prose)) throw new Error("Unsupported profile HTML or component.")
  if (prose.includes("{") || prose.includes("}") || /^[\t ]*(?:import|export)\b/mv.test(prose))
    throw new Error("Profile content cannot contain executable MDX.")
}

/**
 * Validate authored prose before Ardo compiles it, in development and production.
 * @returns The profile source-policy plugin.
 */
export function profileContent(): Plugin {
  return {
    enforce: "pre",
    name: "consulting:profile-content",
    transform(source, id) {
      const filename = id.split("?", 1)[0].replaceAll("\\", "/")
      if (filename.startsWith(directory) && filename.endsWith(".mdx")) assertProfileContent(source)
    },
  }
}
