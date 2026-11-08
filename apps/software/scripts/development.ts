/* eslint-disable security/detect-non-literal-fs-filename -- Only the known app source and post directories are mirrored into generated output. */

import { cp, mkdir, rm, watch } from "node:fs/promises"
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

/** How long the post directories must stay quiet before the blog is restaged. */
const RESTAGE_DELAY_MS = 150

/**
 * Runs a task once changes have settled: each call restarts the delay, and a
 * call while the task runs queues one more run, so runs never overlap.
 * @param task - The work to run; it reports its own failures.
 * @param delay - The quiet period in milliseconds.
 * @returns `schedule` for each change, and `settled` to await the last run.
 */
function debounced(
  task: () => Promise<void>,
  delay: number
): { schedule: () => void; settled: () => Promise<void> } {
  let timer: ReturnType<typeof setTimeout> | undefined
  let running: Promise<void> | undefined
  let queued = false
  const takeQueued = (): boolean => {
    const was = queued
    queued = false
    return was
  }
  // Runs the task again while changes arrived during the last run.
  const drain = async (): Promise<void> => {
    await task()
    if (takeQueued()) await drain()
  }
  const start = (): void => {
    timer = undefined
    if (running !== undefined) {
      queued = true
      return
    }
    running = drain().finally(() => {
      running = undefined
    })
  }
  return {
    schedule() {
      clearTimeout(timer)
      timer = setTimeout(start, delay)
    },
    async settled() {
      clearTimeout(timer)
      await running
    },
  }
}

/**
 * Restage the blog once changes below its content directory have settled. An
 * invalid post is reported and the server keeps the last valid staging until
 * the post is fixed. The build time stays the one of the server's start.
 * @param options - The watched directory, the abort signal, and the staging step.
 * @param options.content - The directory with the `de` and `en` posts.
 * @param options.restage - Validates all posts and restages the variant's language.
 * @param options.signal - Stops watching.
 */
async function watchContent(options: {
  content: string
  restage: () => Promise<void>
  signal: AbortSignal
}): Promise<void> {
  const { content, restage, signal } = options
  await mkdir(content, { recursive: true })
  const restaging = debounced(async () => {
    try {
      await restage()
    } catch (error) {
      console.error("Software blog staging failed:", error)
    }
  }, RESTAGE_DELAY_MS)
  try {
    for await (const _event of watch(content, { recursive: true, signal })) restaging.schedule()
  } catch (error) {
    if (!(error instanceof Error) || error.name !== "AbortError") throw error
  } finally {
    await restaging.settled()
  }
}

/**
 * Mirror original app edits while Ardo watches its isolated consumer project.
 * Post edits restage the variant's blog, so staged copies keep their
 * build-time counterpart. Shared package changes require restarting the
 * development build.
 * @param options - The directories and lifecycle of the development server.
 * @param options.app - The original Software application directory.
 * @param options.content - The directory with the `de` and `en` posts.
 * @param options.restageBlog - Validates all posts and restages the variant's language.
 * @param options.serve - The development server lifecycle.
 * @param options.site - The generated Ardo project directory.
 * @returns Completion after the server and pending copies have stopped.
 */
export async function withDevelopmentMirror(options: {
  app: string
  content: string
  restageBlog: () => Promise<void>
  serve: () => Promise<void>
  site: string
}): Promise<void> {
  const { app, content, restageBlog, serve, site } = options
  const controller = new AbortController()
  const sources = [
    { recursive: true, relative: "app" },
    { recursive: true, relative: "public" },
    { file: "vite.config.ts", recursive: false, relative: "." },
    { file: "macros.ts", recursive: false, relative: "scripts" },
  ]
  const copies = Promise.all([
    ...sources.map(async ({ file, recursive, relative }) =>
      mirror({
        file,
        recursive,
        signal: controller.signal,
        source: path.join(app, relative),
        target: path.join(site, relative),
      })
    ),
    watchContent({ content, restage: restageBlog, signal: controller.signal }),
  ]).catch((error: unknown) => {
    console.error("Software development copy failed:", error)
  })
  try {
    await serve()
  } finally {
    controller.abort()
    await copies
  }
}
