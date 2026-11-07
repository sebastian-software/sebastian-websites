/**
 * Publishes every buildable target: provision, upload, verify. Runs from CI on
 * every push to main (ADR-0009).
 *
 *   BUNNY_API_KEY=… node hosting/deploy.ts
 */
import { appendFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { bunnyApi, required } from "./bunny.ts"
import { checkBuilds } from "./check-builds.ts"
import { provision } from "./provision.ts"
import { publish } from "./publish.ts"
import { ASSET_TARGET } from "./targets.ts"
import { verify } from "./verify.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const api = bunnyApi(required("BUNNY_API_KEY"))
// The same checks as `pnpm hosting:plan`, before any remote file changes.
const { builds, images, plans, targets } = await checkBuilds(root)
const summary: string[] = ["### Website delivery", ""]
if (images.size > 0) {
  const assets = [...images.values()]
  const ids = await provision(api, ASSET_TARGET)
  const result = await publish({ api, assets, ids, purgeCache: false, target: ASSET_TARGET })
  await verify({ assets, target: ASSET_TARGET })
  summary.push(`- Shared images: ${result.uploaded} uploaded; existing originals preserved`)
}
for (const target of targets) {
  console.log(`\n${target.name}`)
  const ids = await provision(api, target)
  if (target.buildDirectory === undefined) {
    summary.push(`- \`${target.name}\`: provisioned; sources are published locally`)
    continue
  }
  const build = builds.get(target.name)
  if (build === undefined) {
    throw new Error(`No validated build for ${target.name}`)
  }
  const assets = build.filter((asset) => !images.has(asset.path))
  const result = await publish({ api, assets, ids, target })
  summary.push(
    `- \`${target.name}\`: ${result.uploaded} uploaded, ${result.removed} removed, https://${target.name}.b-cdn.net/`
  )
}
// Reciprocal language checks need both new variants to be available first.
for (const target of targets) {
  const assets = builds.get(target.name)
  if (assets !== undefined) {
    await verify({
      assets: assets.filter((asset) => !images.has(asset.path)),
      seo: plans.get(target.name),
      target,
    })
  }
}
if (process.env.GITHUB_STEP_SUMMARY !== undefined) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`)
}
console.log(`\n${summary.join("\n")}`)
