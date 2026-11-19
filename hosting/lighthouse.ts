/* eslint-disable security/detect-non-literal-fs-filename -- Generated reports stay under build/lighthouse and validated variant IDs. */
/** Run the pinned Lighthouse CI against representative, indexable local builds. */
import { spawn } from "node:child_process"
import { access, mkdir, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

import type { SeoPlan } from "./seo.ts"

import { singleLanguageClass } from "../packages/web-core/src/blogPaths.ts"
import { getVariant, VARIANTS } from "../packages/web-core/src/sites.ts"
import { checkBuilds } from "./check-builds.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const cli = fileURLToPath(import.meta.resolve("@lhci/cli/src/cli.js"))
const representativePaths: ReadonlySet<string> = new Set([
  "/",
  "/products",
  "/services/architecture-review",
  "/werner",
])

async function run(directory: string, config: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, "autorun", `--config=${config}`], {
      cwd: directory,
      stdio: "inherit",
    })
    child.once("error", reject)
    child.once("exit", (code) => {
      resolve(code ?? 1)
    })
  })
}

async function auditVariant(id: string, plan: SeoPlan): Promise<boolean> {
  const paths = plan.paths.filter((path) => representativePaths.has(path))
  const article = plan.paths.find((path) => singleLanguageClass(path) === "post")
  if (article !== undefined) paths.push(article)
  if (paths.length === 0) throw new Error(`${id}: no indexable representative page`)
  const directory = join(root, "build/lighthouse", id)
  await rm(directory, { force: true, recursive: true })
  await mkdir(directory, { recursive: true })
  const config = join(directory, "config.json")
  await writeFile(
    config,
    JSON.stringify({
      ci: {
        assert: { assertions: { "categories:seo": ["error", { minScore: 1 }] } },
        collect: {
          chromePath: chromium.executablePath(),
          numberOfRuns: 1,
          settings: {
            chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
            onlyCategories: ["seo"],
          },
          staticDistDir: join(root, `apps/${plan.variant.site}/build/${id}/client`),
          url: paths.map((path) => `http://localhost${path}`),
        },
        upload: { outputDir: join(directory, "reports"), target: "filesystem" },
      },
    })
  )
  console.log(`${id}: auditing ${paths.join(", ")}`)
  return (await run(directory, config)) === 0
}

/**
 * One browser SEO pass per representative page, with local HTML/JSON reports.
 * @returns Completion after every requested variant, failing if any audit failed.
 */
async function main(): Promise<void> {
  const requested = process.argv.slice(2)
  const checked = await checkBuilds(root)
  const available = Object.keys(VARIANTS).filter((id) =>
    checked.plans.has(getVariant(id).deploymentTarget)
  )
  if (available.length === 0) throw new Error("No website builds to audit; run pnpm build first")
  const variants = (requested.length === 0 ? available : requested).map((id) => ({
    id,
    variant: getVariant(id),
  }))
  await access(chromium.executablePath()).catch(() => {
    throw new Error("Install the audit browser first: pnpm exec playwright install chromium")
  })
  const failed: string[] = []
  for (const { id, variant } of variants) {
    const plan = checked.plans.get(variant.deploymentTarget)
    if (plan === undefined) throw new Error(`${id}: build this variant and its language pair first`)
    if (!(await auditVariant(id, plan))) failed.push(id)
  }
  if (failed.length > 0) {
    throw new Error(`Lighthouse SEO failed: ${failed.join(", ")}`)
  }
}

await main()
