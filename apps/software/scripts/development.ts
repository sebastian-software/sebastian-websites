/* eslint-disable security/detect-non-literal-fs-filename -- Only the known app source directories are mirrored into generated output. */

import { cp, rm, watch } from "node:fs/promises"
import path from "node:path"

async function copyChange(source: string, target: string): Promise<void> {
  try {
    await cp(source, target, { recursive: true })
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error
    await rm(target, { force: true, recursive: true })
  }
}

async function mirror(options: {
  file?: string
  recursive: boolean
  signal: AbortSignal
  source: string
  target: string
}): Promise<void> {
  const { file, recursive, signal, source, target } = options
  try {
    for await (const event of watch(source, { recursive, signal })) {
      const name = event.filename ?? ""
      if (file !== undefined && name !== file) continue
      await copyChange(path.join(source, name), path.join(target, name))
    }
  } catch (error) {
    if (!(error instanceof Error) || error.name !== "AbortError") throw error
  }
}

/**
 * Mirror original app edits while Ardo watches its isolated consumer project.
 * Shared package changes require restarting the development build.
 * @param app - The original Software application directory.
 * @param site - The generated Ardo project directory.
 * @param serve - The development server lifecycle.
 * @returns Completion after the server and pending copies have stopped.
 */
export async function withDevelopmentMirror(
  app: string,
  site: string,
  serve: () => Promise<void>
): Promise<void> {
  const controller = new AbortController()
  const sources = [
    { recursive: true, relative: "app" },
    { recursive: true, relative: "public" },
    { file: "vite.config.ts", recursive: false, relative: "." },
    { file: "macros.ts", recursive: false, relative: "scripts" },
  ]
  const copies = Promise.all(
    sources.map(async ({ file, recursive, relative }) =>
      mirror({
        file,
        recursive,
        signal: controller.signal,
        source: path.join(app, relative),
        target: path.join(site, relative),
      })
    )
  ).catch((error: unknown) => {
    console.error("Software development copy failed:", error)
  })
  try {
    await serve()
  } finally {
    controller.abort()
    await copies
  }
}
