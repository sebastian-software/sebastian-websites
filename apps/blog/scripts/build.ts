/* eslint-disable security/detect-non-literal-fs-filename -- Each build owns its generated input directory. */
import { runBuilds } from "@sebastian-websites/site/build"
import { BLOG_NAVIGATION } from "@sebastian-websites/web-core"
import { mkdir, mkdtemp, rm } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"

import { localizePublication } from "../tools/localize-publication.mjs"
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
if (cli.values.content !== undefined) process.env.BLOG_CONTENT = path.resolve(cli.values.content)
process.env.BLOG_INDEXED = String(BLOG_NAVIGATION !== "off" || cli.values.content !== undefined)
const run = async () => runBuilds("blog", { variants: cli.positionals })
if (cli.values.content === undefined) {
  const cache = path.resolve(".blog-localized")
  await mkdir(cache, { recursive: true })
  const output = await mkdtemp(path.join(cache, "posts-"))
  try {
    await localizePublication(process.cwd(), output)
    process.env.BLOG_LOCALIZED_CONTENT = output
    await run()
  } finally {
    await rm(output, { force: true, recursive: true })
  }
} else {
  await run()
}
