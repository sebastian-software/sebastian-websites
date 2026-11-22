import { compileCatalogModule } from "@palamedes/core-node"
import { createI18n } from "@palamedes/core"
import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { localizeArticle, mdxOptions } from "./localize-article.mjs"

/** Materialize posts before Ardo discovers the publication and generates its feeds. */
export async function localizePublication(app, output) {
  const sourceDir = path.join(app, "content/articles")
  const locales = ["en", "de"]
  const catalogs = [{ path: "content/catalogs/{locale}", include: ["content/articles"] }]
  const config = { rootDir: app, locales, sourceLocale: "en", mdx: mdxOptions, catalogs }
  const entries = await readdir(sourceDir, { withFileTypes: true })
  const assetDirs = new Set(
    entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  )
  const sources = entries
    .filter((entry) => entry.isFile() && /^[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/v.test(entry.name))
    .map((entry) => entry.name)
    .sort()

  for (const locale of locales) {
    const i18n = createI18n({ locale, timeZone: "UTC" })
    const catalogPath = path.join(app, "content/catalogs", `${locale}.po`)
    const catalog = compileCatalogModule(config, catalogPath, { locale, failOnMissing: true })
    const code = catalog.code.replace(
      '"@palamedes/core/compiled"',
      JSON.stringify(import.meta.resolve("@palamedes/core/compiled"))
    )
    const { messages } = await import(
      `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
    )
    i18n.load(locale, messages)
    const folder = path.join(output, locale)
    await mkdir(folder, { recursive: true })
    // Explicit per-language posts still work. Translated articles get the same path
    // in both builds; writing with wx prevents an ambiguous duplicate.
    await cp(path.join(app, "content/posts", locale), folder, { recursive: true })
    for (const file of sources) {
      const filename = path.join(sourceDir, file)
      const destination = path.join(folder, file)
      const rendered = localizeArticle(await readFile(filename, "utf8"), {
        filename,
        destination,
        locale,
        i18n,
      })
      await writeFile(destination, rendered, { flag: "wx" })
      const stem = path.basename(file, ".mdx")
      const assets = path.join(sourceDir, stem)
      if (assetDirs.has(stem))
        await cp(assets, path.join(folder, stem), {
          recursive: true,
          force: false,
          errorOnExist: true,
        })
    }
  }
}
