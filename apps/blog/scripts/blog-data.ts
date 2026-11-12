/* eslint-disable security/detect-non-literal-fs-filename -- The directory is the selected publication source. */
import type { Plugin } from "ardo/vite"
import type { ModuleRunner } from "vite/module-runner"

import { BLOG_NAVIGATION, getVariant, LOCALES } from "@sebastian-websites/web-core"
import { mkdir } from "node:fs/promises"
import path from "node:path"

import { blogLanguageData, readBlog } from "./blog-sources.ts"

/**
 * Validate both languages while Ardo reads this domain's original sources.
 * @returns The native source directory and validated publication data.
 */
export async function prepareBlog() {
  const locale = getVariant(process.env.SITE_VARIANT ?? "blog-en").locale
  const content = path.resolve(process.env.BLOG_CONTENT ?? "content/posts")
  const blog = await readBlog(content, process.env.SITE_BUILD_DATE ?? new Date().toISOString(), {
    requireBothLanguages: BLOG_NAVIGATION === "launching" && process.env.BLOG_CONTENT === undefined,
  })
  const source = path.join(content, locale)
  // Git drops empty directories; Ardo requires its publication input to exist.
  await mkdir(source, { recursive: true })
  return { blog, content, data: blogLanguageData(blog.index, locale), source }
}

/**
 * Supply this domain's translation paths and the other language's tag keys.
 * @returns A Vite virtual module integrated with the existing development watcher.
 */
export function blogData(): Plugin {
  const content = path.resolve(process.env.BLOG_CONTENT ?? "content/posts")
  const virtualId = "\0virtual:blog-data"
  return {
    configureServer(server) {
      server.watcher.add(LOCALES.map((locale) => path.join(content, locale)))
    },
    hotUpdate({ file, server, timestamp }) {
      const relative = path.relative(content, file)
      const segments = relative.split(path.sep)
      if (
        !LOCALES.some((locale) => relative.startsWith(`${locale}${path.sep}`)) ||
        segments.some((part) => part.startsWith(".") || part.startsWith("_")) ||
        !/\.mdx?$/v.test(file)
      )
        return
      if (this.environment.name !== "client") return []
      // Refresh every server consumer before the browser requests its next document.
      for (const environment of Object.values(server.environments)) {
        const module = environment.moduleGraph.getModuleById(virtualId)
        if (module !== undefined)
          environment.moduleGraph.invalidateModule(module, new Set(), timestamp, true)
        invalidateMetadata(environment, virtualId)
      }
      this.environment.hot.send({ type: "full-reload" })
      return []
    },
    async load(id) {
      if (id !== virtualId) return
      const { data } = await prepareBlog()
      return `export default ${JSON.stringify(data)}`
    },
    name: "blog:blog-data",
    resolveId: (id) => (id === "virtual:blog-data" ? virtualId : undefined),
  }
}

/**
 * Recognize a public Vite module runner across Ardo's and the app's Vite installs.
 * @param environment - The environment receiving the content event.
 * @returns Whether it exposes a module runner.
 */
function hasModuleRunner(environment: object): environment is {
  readonly runner: Pick<ModuleRunner, "evaluatedModules">
} {
  return "runner" in environment
}

/**
 * Refresh metadata consumers while retaining Ardo's renderer and React instances.
 * @param environment - The server rendering environment.
 * @param id - The virtual metadata module's resolved id.
 */
function invalidateMetadata(environment: object, id: string): void {
  if (!hasModuleRunner(environment)) return
  const { evaluatedModules } = environment.runner
  const metadata = evaluatedModules.getModuleById(id)
  if (metadata === undefined) return
  const affected = new Set([metadata])
  for (const entry of affected) {
    for (const importerId of entry.importers) {
      const importer = evaluatedModules.getModuleById(importerId)
      if (importer !== undefined) affected.add(importer)
    }
  }
  for (const entry of affected) evaluatedModules.invalidateModule(entry)
}
