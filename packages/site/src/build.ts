/* eslint-disable no-await-in-loop -- Domain variants share one app directory and build sequentially. */
import type { SiteId } from "@sebastian-websites/web-core"

import { spawn } from "node:child_process"
import { cp, mkdir, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
type BuildHooks = {
  readonly afterBuild?: (variantId: string) => Promise<void>
  readonly beforeBuild?: (variantId: string) => Promise<void>
  readonly variants?: readonly string[]
}

/**
 * Run a normal Ardo command in the actual app directory.
 * @param command - The requested Ardo lifecycle.
 */
async function ardo(command: "build" | "dev"): Promise<void> {
  const cli = path.join(path.dirname(require.resolve("ardo/package.json")), "bin/ardo.js")
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [cli, command], { env: process.env, stdio: "inherit" })
    child.once("error", reject)
    child.once("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Ardo ${command} exited ${String(code)}`))
    })
  })
}

/**
 * Select the requested domains, or the development/default pair.
 * @param site - The website being built.
 * @param development - Whether to run its development server.
 * @param supplied - App-parsed positional variants, excluding custom flag values.
 * @returns The variant IDs selected by the command line.
 */
function selectedVariants(
  site: SiteId,
  development: boolean,
  supplied?: readonly string[]
): string[] {
  const requested = supplied ?? process.argv.slice(2).filter((arg) => !arg.startsWith("--"))
  if (requested.length > 0) return [...requested]
  if (development) return [process.env.SITE_VARIANT ?? `${site}-en`]
  return [`${site}-de`, `${site}-en`]
}

/**
 * Keep the existing static hosting artifact contract.
 * @param variantId - The completed domain build.
 */
async function finishBuild(variantId: string): Promise<void> {
  const output = path.resolve(process.env.SITE_OUTPUT_ROOT ?? "build", variantId)
  await mkdir(path.join(output, "client/404"), { recursive: true })
  await cp(path.join(output, "client/404.html"), path.join(output, "client/404/index.html"))
  await writeFile(path.join(output, "build-time.txt"), `${process.env.SITE_BUILD_DATE}\n`)
}

/**
 * Build ordinary Ardo variants, with optional app-owned data/PDF hooks.
 * @param site - The website being built.
 * @param hooks - Website-owned build prerequisites and checks.
 */
export async function runBuilds(site: SiteId, hooks: BuildHooks = {}): Promise<void> {
  const development = process.argv.includes("--dev")
  process.env.SITE_BUILD_DATE ??= new Date().toISOString()
  for (const variantId of selectedVariants(site, development, hooks.variants)) {
    if (variantId !== `${site}-de` && variantId !== `${site}-en`)
      throw new Error(`Unknown ${site} variant: ${variantId}`)
    process.env.SITE_VARIANT = variantId
    if (development) {
      await ardo("dev")
      return
    }
    await hooks.beforeBuild?.(variantId)
    await ardo("build")
    await finishBuild(variantId)
    await hooks.afterBuild?.(variantId)
  }
}
