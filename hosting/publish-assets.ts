/** Publishes the complete private asset folder. Never runs in CI. */
import { homedir } from "node:os"
import { resolve } from "node:path"

import { bunnyApi, required } from "./bunny.ts"
import { provision } from "./provision.ts"
import { loadAssets, publish } from "./publish.ts"
import { ASSET_TARGET } from "./targets.ts"

if (process.env.CI !== undefined || process.env.GITHUB_ACTIONS !== undefined) {
  throw new Error("Asset sources must be published locally, never in CI")
}

const directory = resolve(process.env.ASSETS_DIR ?? `${homedir()}/Workspace/sebastian-assets`)
const assets = await loadAssets(directory)
const api = bunnyApi(required("BUNNY_API_KEY"))
const ids = await provision(api, ASSET_TARGET)
const result = await publish({ api, assets, ids, target: ASSET_TARGET })
console.log(`${result.uploaded} uploaded, ${result.removed} removed`)
