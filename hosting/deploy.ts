/**
 * Publishes every buildable target: provision, upload, verify. Runs from CI on
 * every push to main (ADR-0009).
 *
 *   BUNNY_API_KEY=… node hosting/deploy.ts
 */
import { appendFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { bunnyApi, required } from "./bunny.ts"
import { provision } from "./provision.ts"
import { loadBuild, publish } from "./publish.ts"
import { buildableTargets } from "./targets.ts"
import { verify } from "./verify.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const api = bunnyApi(required("BUNNY_API_KEY"))
const targets = buildableTargets(root)
if (targets.length === 0) {
  throw new Error("No target has a build; run pnpm build first")
}
const summary: string[] = ["### Website delivery", ""]
for (const target of targets) {
  console.log(`\n${target.name}`)
  const ids = await provision(api, target)
  const assets = await loadBuild(`${root}/${target.buildDirectory}`)
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
