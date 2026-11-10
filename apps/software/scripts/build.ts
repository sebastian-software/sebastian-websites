import { fetchMetricsSummary } from "@sebastian-websites/content"
import { runBuilds } from "@sebastian-websites/site/build"
import { BLOG_NAVIGATION } from "@sebastian-websites/web-core"
import path from "node:path"
import { parseArgs } from "node:util"

import { resolveBuildTime } from "./build-time.ts"

const cli = parseArgs({
  allowPositionals: true,
  options: {
    "build-time": { type: "string" },
    content: { type: "string" },
    dev: { type: "boolean" },
    out: { type: "string" },
  },
})
process.env.SITE_BUILD_DATE = resolveBuildTime(cli.values["build-time"])
if (cli.values.out !== undefined) process.env.SITE_OUTPUT_ROOT = path.resolve(cli.values.out)
if (cli.values.content !== undefined)
  process.env.SOFTWARE_BLOG_CONTENT = path.resolve(cli.values.content)
process.env.SOFTWARE_BLOG_INDEXED = String(
  BLOG_NAVIGATION !== "off" || cli.values.content !== undefined
)
// Both domains receive the same immutable metrics observation.
process.env.SOFTWARE_METRICS = JSON.stringify(await fetchMetricsSummary())
await runBuilds("software", { variants: cli.positionals })
