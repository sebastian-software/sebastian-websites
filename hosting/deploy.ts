/**
 * Publishes every buildable target: provision, upload, verify. Runs from CI on
 * every push to main (ADR-0009).
 *
 *   BUNNY_API_KEY=… node hosting/deploy.ts
 */
import { appendFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { bunnyApi, required } from "./bunny.ts"
import { loadBunnyImages } from "./images.ts"
import { provision } from "./provision.ts"
import { loadAssets, loadBuild, publish } from "./publish.ts"
import { ASSET_TARGET, buildableTargets } from "./targets.ts"
import { verify } from "./verify.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const api = bunnyApi(required("BUNNY_API_KEY"))
const targets = buildableTargets(root)
if (targets.length === 0) {
  throw new Error("No target has a build; run pnpm build first")
}
const summary: string[] = ["### Website delivery", ""]
// Every original must be available before any site document references it.
const images = new Map<string, Awaited<ReturnType<typeof loadBunnyImages>>[number]>()
for (const target of targets) {
  if (target.buildDirectory === undefined) continue
  for (const image of await loadBunnyImages(`${root}/${target.buildDirectory}`)) {
    images.set(image.path, image)
  }
}
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
  const directory = `${root}/${target.buildDirectory}`
  const build = await (target.assets === true ? loadAssets(directory) : loadBuild(directory))
  const assets = build.filter((asset) => !images.has(asset.path))
  const result = await publish({ api, assets, ids, target })
  await verify({ assets, target })
  summary.push(
    `- \`${target.name}\`: ${result.uploaded} uploaded, ${result.removed} removed, https://${target.name}.b-cdn.net/`
  )
}
if (process.env.GITHUB_STEP_SUMMARY !== undefined) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`)
}
console.log(`\n${summary.join("\n")}`)
