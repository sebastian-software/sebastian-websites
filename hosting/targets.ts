import { existsSync } from "node:fs"

import { type VariantDefinition, VARIANTS } from "../packages/web-core/src/sites.ts"

/** One Bunny storage and pull zone pair serving a site or shared assets. */
export type Target = {
  /** Asset zones omit site middleware and preserve manually uploaded files. */
  readonly assets?: boolean
  /** The public build output or asset source folder, relative to the repository root. */
  readonly buildDirectory?: string
  /** File extensions served with open CORS, for assets other sites embed. */
  readonly corsExtensions: readonly string[]
  /** The canonical hostname to attach and secure during provisioning. */
  readonly hostname?: string
  /** The zone name; also the `<name>.b-cdn.net` origin host, unique across Bunny. */
  readonly name: string
}

const BRAND_TARGET: Target = {
  buildDirectory: "apps/brand/build/client",
  corsExtensions: ["css", "svg", "png"],
  hostname: "brand.sebastian-software.com",
  name: "sebastian-websites-brand",
}

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"] as const

export const ASSET_TARGET: Target = {
  assets: true,
  buildDirectory: "assets",
  corsExtensions: [...IMAGE_EXTENSIONS, "woff2", "css"],
  hostname: "assets.sebastian-software.com",
  name: "sebastian-websites-assets",
}

/**
 * Every target the repository provisions: one per variant, plus the brand
 * site and asset zone. A variant's canonical hostname is attached only when it is active in
 * production (ADR-0009); until then the variant lives on its origin host.
 */
// Widened on purpose: the literal list knows every variant is inactive today.
const variants: Readonly<Record<string, VariantDefinition>> = VARIANTS

export const TARGETS: readonly Target[] = [
  ...Object.entries(variants).map(([variantId, variant]): Target => ({
    buildDirectory: `apps/${variant.site}/build/${variantId}/client`,
    corsExtensions: [],
    ...(variant.productionActive ? { hostname: new URL(variant.canonicalOrigin).hostname } : {}),
    name: variant.deploymentTarget,
  })),
  BRAND_TARGET,
  ASSET_TARGET,
]

/**
 * The targets whose build output exists in this checkout. Apps that are not
 * implemented yet have no build and are skipped rather than provisioned empty.
 *
 * @param root - The repository root.
 * @returns Built website targets and the build-free asset target.
 */
export function buildableTargets(root: string): readonly Target[] {
  return TARGETS.filter(
    (target) =>
      target.assets === true ||
      (target.buildDirectory !== undefined && existsSync(`${root}/${target.buildDirectory}`))
  )
}
