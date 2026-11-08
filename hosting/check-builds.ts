/**
 * The pre-upload checks of a deployment, without Bunny credentials: load every
 * buildable target, compare both language builds of each site, validate the
 * SEO contract, reject raster images in the Software blog, and verify the
 * Bunny image manifests. CI runs it after
 * `pnpm build`; the deployment runs the same checks before changing any
 * remote file.
 *
 *   pnpm hosting:plan
 *   node hosting/check-builds.ts <checkout root>
 *
 * The optional root holds builds at the checkout's paths, such as the
 * Software fixture builds of `check:fixtures`; it defaults to this checkout.
 */
/* eslint-disable security/detect-non-literal-fs-filename -- Paths come from the typed target list below the repository root. */
import { readFile } from "node:fs/promises"
import { dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { isZonedTimestamp } from "../packages/web-core/src/timestamps.ts"
import { assertBlogOutput } from "./blog-output.ts"
import { loadBunnyImages } from "./images.ts"
import { type Asset, loadAssets, loadBuild } from "./publish.ts"
import { type SeoPlan, seoPlans, type SiteBuild } from "./seo.ts"
import { BUILD_TIME_FILE, buildableTargets, type Target } from "./targets.ts"

/** Everything the deployment needs once the builds passed their checks. */
export type CheckedBuilds = {
  /** The complete build files per target name. */
  readonly builds: ReadonlyMap<string, readonly Asset[]>
  /** The Bunny originals of every build, deduplicated by their hashed path. */
  readonly images: ReadonlyMap<string, Asset>
  /** The SEO plan per variant target name. */
  readonly plans: ReadonlyMap<string, SeoPlan>
  readonly targets: readonly Target[]
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT"
}

/**
 * Reads the shared build time a variant build records beside its `client/`
 * directory: an RFC 3339 timestamp with seconds and a time zone. Builds that
 * record none return undefined; the SEO plan requires the file for Software
 * and treats two such builds of another site as built together.
 *
 * @param directory - The build's client directory.
 * @returns The recorded build time, or undefined when the file is absent.
 */
export async function readBuildTime(directory: string): Promise<string | undefined> {
  let text: string
  try {
    text = await readFile(`${dirname(directory)}/${BUILD_TIME_FILE}`, "utf8")
  } catch (error) {
    if (isMissing(error)) return undefined
    throw error
  }
  const buildTime = text.trim()
  if (!isZonedTimestamp(buildTime)) {
    throw new TypeError(
      `${directory}: ${BUILD_TIME_FILE} holds no timestamp with seconds and a time zone: ${buildTime}`
    )
  }
  return buildTime
}

async function loadTarget(root: string, target: Target): Promise<SiteBuild | undefined> {
  if (target.buildDirectory === undefined) return undefined
  const directory = `${root}/${target.buildDirectory}`
  if (target.assets === true) {
    return { assets: await loadAssets(directory), target }
  }
  const buildTime = await readBuildTime(directory)
  return {
    assets: await loadBuild(directory),
    ...(buildTime === undefined ? {} : { buildTime }),
    target,
  }
}

/**
 * Loads and checks every buildable target of a checkout.
 *
 * @param root - The repository root.
 * @returns The validated builds, images, and SEO plans.
 */
export async function checkBuilds(root: string): Promise<CheckedBuilds> {
  const targets = buildableTargets(root)
  if (targets.length === 0) {
    throw new Error("No target has a build; run pnpm build first")
  }
  const loaded: SiteBuild[] = []
  for (const target of targets) {
    const build = await loadTarget(root, target)
    if (build !== undefined) loaded.push(build)
  }
  // Reject a broken SEO artifact before any remote files are changed.
  const plans = seoPlans(loaded)
  for (const build of loaded) assertBlogOutput(build.target, build.assets)
  // Every original must be available before any site document references it.
  const images = new Map<string, Asset>()
  for (const target of targets) {
    if (target.buildDirectory === undefined) continue
    for (const image of await loadBunnyImages(`${root}/${target.buildDirectory}`)) {
      images.set(image.path, image)
    }
  }
  return {
    builds: new Map(loaded.map((build) => [build.target.name, build.assets])),
    images,
    plans,
    targets,
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [root = fileURLToPath(new URL("..", import.meta.url))] = process.argv.slice(2)
  const checked = await checkBuilds(root)
  for (const [name, plan] of checked.plans) {
    const single = [...plan.alternates.values()].filter((links) => links.length === 0).length
    console.log(
      `${name}: ${String(plan.paths.length)} SEO pages, ${String(single)} single-language`
    )
  }
  console.log(
    `Checked ${String(checked.builds.size)} builds and ${String(checked.images.size)} Bunny images; ready to publish`
  )
}
