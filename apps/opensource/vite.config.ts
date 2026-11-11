import { websiteViteConfig } from "@sebastian-websites/site/config"
import type { Plugin } from "ardo/vite"

import { loadActivity } from "./app/lib/activity.ts"
import { loadMetrics } from "./app/lib/metrics.ts"

/** Share one public observation between the browser bundle and prerendered routes. */
function buildData(): Plugin {
  const id = "virtual:opensource-build-data"
  let data: Promise<string> | undefined
  return {
    name: "opensource:build-data",
    resolveId(source) {
      return source === id ? `\0${id}` : undefined
    },
    async load(source) {
      if (source !== `\0${id}`) return undefined
      data ??= Promise.all([loadActivity(), loadMetrics()]).then(
        ([{ activity }, metrics]) =>
          `export const activity = ${JSON.stringify(activity)}; export const metrics = ${JSON.stringify(metrics)};`
      )
      return data
    },
  }
}

export default websiteViteConfig({ root: import.meta.dirname, plugins: [buildData()] })
