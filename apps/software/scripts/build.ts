/* eslint-disable security/detect-non-literal-fs-filename -- Paths are restricted to generated output and known workspace packages. */
/* eslint-disable no-await-in-loop -- Package preparation, asset merges and language builds must complete in order. */
import type * as SharedUi from "@sebastian-websites/ui"

import { fetchMetricsSummary } from "@sebastian-websites/content"
import { createRobots, createSitemap, getVariant, SITE_BRAND } from "@sebastian-websites/web-core"
import { bunnyImages } from "@sebastian-websites/web-core/vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { cp, mkdir, readdir, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build, type InlineConfig } from "vite"

import { PAGES } from "../app/lib/pages.ts"
import { withDevelopmentMirror } from "./development.ts"
import { sharedMacros } from "./macros.ts"

const app = fileURLToPath(new URL("..", import.meta.url))
const repository = path.resolve(app, "../..")
const generated = path.join(app, ".variant-build")
const require = createRequire(import.meta.url)
const packageNames = ["tokens", "web-core", "content", "legal", "ui"] as const
const PACKAGE_FILE = "package.json"
const MODULES = "node_modules"
const MISSING = "ENOENT"
const SCOPE = "@sebastian-websites"
const ENGLISH = "software-en"
const runtimePackages = new Set(["react", "react-dom", "vite"])

type Manifest = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  exports?: Record<string, string>
  name: string
  version: string
}
type PackageBuild = {
  entries: Record<string, string>
  input: Manifest
  output: string
  source: string
}

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && "code" in error && error.code === code
}

function stringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((entry) => typeof entry === "string")
  )
}
function isManifest(value: unknown): value is Manifest {
  return (
    isRegistryManifest(value) &&
    (!("exports" in value) || stringRecord(value.exports)) &&
    (!("dependencies" in value) || stringRecord(value.dependencies)) &&
    (!("devDependencies" in value) || stringRecord(value.devDependencies))
  )
}
function isRegistryManifest(value: unknown): value is Pick<Manifest, "name" | "version"> {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "version" in value &&
    typeof value.version === "string"
  )
}
async function registryManifest(directory: string): Promise<Pick<Manifest, "name" | "version">> {
  const value: unknown = JSON.parse(await readFile(path.join(directory, PACKAGE_FILE), "utf8"))
  assert.ok(isRegistryManifest(value), `Invalid registry package: ${directory}`)
  return value
}
function isManifestModule(value: unknown): value is Pick<typeof SharedUi, "createWebManifest"> {
  return (
    typeof value === "object" &&
    value !== null &&
    "createWebManifest" in value &&
    typeof value.createWebManifest === "function"
  )
}

async function manifest(directory: string): Promise<Manifest> {
  const value: unknown = JSON.parse(await readFile(path.join(directory, PACKAGE_FILE), "utf8"))
  assert.ok(isManifest(value), `Invalid workspace manifest: ${directory}`)
  return value
}

// pnpm can encode different peer environments for the same release. Ardo owns React/DOM.
async function linkRegistryPackage(source: string, destination: string): Promise<void> {
  const resolved = await realpath(source)
  try {
    await symlink(resolved, destination, "dir")
  } catch (error) {
    if (!hasCode(error, "EEXIST")) throw error
    if ((await realpath(destination)) === resolved) return
    const installed = await registryManifest(destination)
    const candidate = await registryManifest(resolved)
    if (installed.name !== candidate.name || installed.version !== candidate.version) {
      throw new Error(
        `Conflicting registry releases for ${candidate.name}: ${installed.version} / ${candidate.version}`,
        { cause: error }
      )
    }
  }
}

// Reuse concrete registry installations from the frozen lockfile, never workspace sources.
async function linkRegistryPackages(source: string, target: string): Promise<void> {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === SCOPE) continue
    const original = path.join(source, entry.name)
    const destination = path.join(target, entry.name)
    if (entry.name.startsWith("@")) {
      await mkdir(destination, { recursive: true })
      await linkRegistryPackages(original, destination)
    } else await linkRegistryPackage(original, destination)
  }
}

function packageConfig(pkg: PackageBuild): InlineConfig {
  const externals = new Set([
    ...Object.keys(pkg.input.dependencies ?? {}),
    ...Object.keys(pkg.input.devDependencies ?? {}),
    "@palamedes/core",
    "@palamedes/react",
    "@palamedes/runtime",
  ])
  return {
    base: "/",
    build: {
      cssCodeSplit: false,
      emptyOutDir: true,
      lib: {
        cssFileName: "styles",
        entry: pkg.entries,
        fileName: (_format, entry) => `${entry}.js`,
        formats: ["es"],
      },
      outDir: path.join(pkg.output, "dist"),
      rolldownOptions: {
        external: (id) =>
          id.startsWith("node:") ||
          [...externals].some((dependency) => id === dependency || id.startsWith(`${dependency}/`)),
        output: {
          assetFileNames: (asset) =>
            asset.names.some((entry) => entry.endsWith(".css"))
              ? "[name][extname]"
              : "assets/[name]-[hash][extname]",
        },
      },
    },
    configFile: false,
    plugins: [sharedMacros(), bunnyImages(), vanillaExtractPlugin({ identifiers: "short" })],
    root: pkg.source,
  }
}

function artifactDependencies(input: Manifest): Record<string, string> {
  const dependencies = { ...input.dependencies }
  if (input.name === "@sebastian-websites/ui" || input.name === "@sebastian-websites/legal") {
    Object.assign(dependencies, {
      "@palamedes/core": "*",
      "@palamedes/react": "*",
      "@palamedes/runtime": "*",
    })
  }
  if (input.name === "@sebastian-websites/web-core") dependencies["image-size"] = "*"
  return Object.fromEntries(
    Object.entries(dependencies)
      .filter(([dependency]) => !runtimePackages.has(dependency))
      .map(([dependency, version]) => [
        dependency,
        version.startsWith("workspace:") ? "0.0.0" : version.replace("catalog:", "*"),
      ])
  )
}

async function buildPackage(packageName: string, directory: string): Promise<void> {
  const source = path.join(repository, "packages", packageName)
  const input = await manifest(source)
  assert.ok(input.exports, `Workspace package needs exports: ${packageName}`)
  const output = path.join(directory, input.name)
  const entries = Object.fromEntries(
    Object.entries(input.exports)
      .filter(([subpath, file]) => !file.endsWith(".d.ts") && subpath !== "./brand-consulting.css")
      .map(([subpath, file]) => [
        subpath === "." ? "index" : subpath.slice(2),
        path.join(source, file),
      ])
  )
  await build(packageConfig({ entries, input, output, source }))
  await writeFile(
    path.join(output, PACKAGE_FILE),
    JSON.stringify(
      {
        dependencies: artifactDependencies(input),
        exports: {
          ...Object.fromEntries(
            Object.keys(entries).map((entry) => [
              entry === "index" ? "." : `./${entry}`,
              `./dist/${entry}.js`,
            ])
          ),
          ...(packageName === "ui" ? { "./styles.css": "./dist/styles.css" } : {}),
        },
        name: input.name,
        peerDependencies: Object.fromEntries(
          [...runtimePackages].map((dependency) => [dependency, "*"])
        ),
        sideEffects: ["**/*.css", "**/brand-software.css.js"],
        type: "module",
        version: input.version,
      },
      null,
      2
    )
  )
}

// Build ordinary installed JS/CSS packages; Ardo never processes their workspace source.
async function buildPackages(): Promise<string> {
  const directory = path.join(generated, "packages")
  await rm(directory, { force: true, recursive: true })
  await mkdir(directory, { recursive: true })
  for (const packageName of packageNames) await buildPackage(packageName, directory)
  return directory
}

async function run(command: string, args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: "inherit" })
    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} exited ${String(code)} (${String(signal)})`))
    })
  })
}

async function copyApplication(site: string): Promise<void> {
  await mkdir(path.join(site, "scripts"), { recursive: true })
  await Promise.all([
    cp(path.join(app, "app"), path.join(site, "app"), { recursive: true }),
    cp(path.join(app, "public"), path.join(site, "public"), { recursive: true }),
    cp(path.join(app, "vite.config.ts"), path.join(site, "vite.config.ts")),
    cp(path.join(app, "scripts/macros.ts"), path.join(site, "scripts/macros.ts")),
  ])
}

async function writeSiteConfig(site: string, metrics: unknown): Promise<void> {
  const original = await manifest(app)
  await Promise.all([
    writeFile(
      path.join(site, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          jsx: "react-jsx",
          jsxImportSource: "ardo",
          module: "ESNext",
          moduleResolution: "Bundler",
          target: "ES2024",
        },
      })
    ),
    writeFile(
      path.join(site, PACKAGE_FILE),
      JSON.stringify(
        {
          ...original,
          dependencies: { ...original.dependencies, "@sebastian-websites/tokens": "0.0.0" },
          name: "@sebastian-websites/software-build",
        },
        null,
        2
      )
    ),
    writeFile(
      path.join(site, "palamedes.yaml"),
      "locales: [en, de]\nsource-locale: en\ncatalogs:\n  - path: app/locales/{locale}\n    include: [app]\n"
    ),
    writeFile(path.join(site, "metrics.json"), JSON.stringify(metrics)),
  ])
}

async function installSitePackages(modules: string, packages: string): Promise<void> {
  for (const source of [
    app,
    ...packageNames.map((packageName) => path.join(repository, "packages", packageName)),
  ]) {
    await linkRegistryPackages(path.join(source, MODULES), modules)
  }
  await mkdir(path.join(modules, SCOPE), { recursive: true })
  for (const packageName of packageNames) {
    await cp(path.join(packages, SCOPE, packageName), path.join(modules, SCOPE, packageName), {
      recursive: true,
    })
  }
}

async function prepareSite(variantId: string, packages: string, metrics: unknown): Promise<string> {
  const site = path.join(generated, variantId)
  await rm(site, { force: true, recursive: true })
  const modules = path.join(site, MODULES)
  await mkdir(modules, { recursive: true })
  await copyApplication(site)
  await writeSiteConfig(site, metrics)
  await installSitePackages(modules, packages)
  await copyPackageAssets(packages, path.join(site, "public"))
  await writeResources(site, path.join(site, "public"), variantId)
  return site
}

async function copyIfPresent(source: string, target: string): Promise<void> {
  try {
    await cp(source, target, { recursive: true })
  } catch (error) {
    if (!hasCode(error, MISSING)) throw error
  }
}

async function imageManifest(directory: string): Promise<string[]> {
  try {
    const value: unknown = JSON.parse(
      await readFile(path.join(directory, "_bunny/images.json"), "utf8")
    )
    assert.ok(Array.isArray(value) && value.every((entry: unknown) => typeof entry === "string"))
    return value
  } catch (error) {
    if (!hasCode(error, MISSING)) throw error
    return []
  }
}

async function copyLibraryAssets(directory: string, client: string): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isFile() && !/\.(?:[cm]?js|css|map)$/v.test(entry.name)) {
      await cp(path.join(directory, entry.name), path.join(client, entry.name))
    }
  }
  for (const assetDirectory of ["assets", "images"]) {
    await copyIfPresent(path.join(directory, assetDirectory), path.join(client, assetDirectory))
  }
}

// Merge image manifests and assets referenced by the compiled library code.
async function copyPackageAssets(packages: string, client: string): Promise<void> {
  const images = new Set(await imageManifest(client))
  for (const packageName of packageNames) {
    const directory = path.join(packages, SCOPE, packageName, "dist")
    for (const image of await imageManifest(directory)) images.add(image)
    await copyLibraryAssets(directory, client)
  }
  if (images.size === 0) return
  await mkdir(path.join(client, "_bunny"), { recursive: true })
  await writeFile(path.join(client, "_bunny/images.json"), JSON.stringify([...images].sort()))
}

async function writeResources(site: string, client: string, variantId: string): Promise<void> {
  const uiModule: unknown = await import(
    path.join(site, "node_modules/@sebastian-websites/ui/dist/index.js")
  )
  assert.ok(isManifestModule(uiModule))
  const variant = getVariant(variantId)
  await Promise.all([
    writeFile(path.join(client, "sitemap.xml"), createSitemap(variant.site, variant.locale, PAGES)),
    writeFile(path.join(client, "robots.txt"), createRobots(variant.site, variant.locale)),
    writeFile(
      path.join(client, "manifest.webmanifest"),
      uiModule.createWebManifest(SITE_BRAND[variant.site], "Sebastian Software")
    ),
  ])
}

async function finishSite(site: string, packages: string, variantId: string): Promise<void> {
  const client = path.join(site, "build/client")
  await copyPackageAssets(packages, client)
  await mkdir(path.join(client, "404"), { recursive: true })
  await cp(path.join(client, "404.html"), path.join(client, "404/index.html"))
  const output = path.join(app, "build", variantId)
  await mkdir(output, { recursive: true })
  await rm(path.join(output, "client"), { force: true, recursive: true })
  await cp(client, path.join(output, "client"), { recursive: true })
}

const development = process.argv.includes("--dev")
const requested = process.argv.slice(2).filter((arg) => arg !== "--dev")
const defaults = development ? [ENGLISH] : ["software-de", ENGLISH]
const variants = requested.length > 0 ? requested : defaults
for (const variant of variants) {
  if (variant !== "software-de" && variant !== ENGLISH)
    throw new Error(`Unknown Software variant: ${variant}`)
}
await run("pnpm", ["check:translations"], app)
const metricsSnapshot = await fetchMetricsSummary()
const packageArtifacts = await buildPackages()
const ardo = path.join(path.dirname(require.resolve("ardo/package.json")), "bin/ardo.js")
for (const variant of variants) {
  const site = await prepareSite(variant, packageArtifacts, metricsSnapshot)
  process.env.SITE_VARIANT = variant
  if (development)
    await withDevelopmentMirror(app, site, async () => run(process.execPath, [ardo, "dev"], site))
  else {
    await run(process.execPath, [ardo, "build"], site)
    await finishSite(site, packageArtifacts, variant)
  }
}
