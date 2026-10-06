import { existsSync } from "node:fs"

import { type VariantDefinition, VARIANTS } from "../packages/web-core/src/sites.ts"

/** One Bunny storage and pull zone pair with the build it serves. */
export type Target = {
  /** The build output to upload, relative to the repository root. */
  readonly buildDirectory: string
  /** File extensions served with open CORS, for assets other sites embed. */
  readonly corsExtensions: readonly string[]
  /** The canonical hostname to attach, once the variant is active in production. */
  readonly hostname?: string
  /** The zone name; also the `<name>.b-cdn.net` origin host, unique across Bunny. */
  readonly name: string
}

const BRAND_TARGET: Target = {
  buildDirectory: "apps/brand/build/client",
  corsExtensions: ["css", "svg", "png"],
  name: "sebastian-websites-brand",
}

/**
 * Every target the repository can publish: one per variant, plus the brand
 * site. A variant's canonical hostname is attached only when it is active in
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
]

/**
 * The targets whose build output exists in this checkout. Apps that are not
 * implemented yet have no build and are skipped rather than provisioned empty.
 *
 * @param root - The repository root.
 * @returns The publishable targets.
 */
export function buildableTargets(root: string): readonly Target[] {
  return TARGETS.filter((target) => existsSync(`${root}/${target.buildDirectory}`))
}
