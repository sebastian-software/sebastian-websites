import { existsSync } from "node:fs"

import type { CollectorForwarding } from "./middleware-logic.ts"

import { type VariantDefinition, VARIANTS } from "../packages/web-core/src/sites.ts"

/** One Bunny storage and pull zone pair serving a site or shared assets. */
export type Target = {
  /** Additional hostnames to secure and redirect to the canonical hostname. */
  readonly aliasHostnames?: readonly string[]
  /** Asset zones omit site middleware and preserve manually uploaded files. */
  readonly assets?: boolean
  /** The public build output or asset source folder, relative to the repository root. */
  readonly buildDirectory?: string
  /**
   * Serves the Tereon collector under a path on this target's domain. Absent,
   * the middleware is exactly the plain one. The prefix defaults to
   * `DEFAULT_COLLECTOR_PREFIX`; the forwarder secret is a script secret, never
   * part of this configuration.
   */
  readonly collector?: { readonly prefix?: string } & Omit<CollectorForwarding, "prefix">
  /** File extensions served with open CORS, for assets other sites embed. */
  readonly corsExtensions: readonly string[]
  /** The canonical hostname to attach and secure during provisioning. */
  readonly hostname?: string
  /** The zone name; also the `<name>.b-cdn.net` origin host, unique across Bunny. */
  readonly name: string
  /**
   * The prerendered page the storage zone returns, with status 404, for files
   * it does not have: the site's branded not-found page.
   */
  readonly notFoundPage?: string
  /** Restrict delivery to the named Bunny routing regions when the notice requires it. */
  readonly routingFilters?: readonly string[]
}

/**
 * The default path for first-party analytics. It names nothing that content
 * blockers match on, unlike `/analytics`, `/stats`, `/track`, or `/collect`.
 */
export const DEFAULT_COLLECTOR_PREFIX = "/_s"

const COLLECTOR_PREFIX = /^\/[\w\-]{1,32}$/v
const COLLECTOR_HOST = /^[\d.a-z\-]{1,253}$/v
const COLLECTOR_SITE = /^[\da-z][\w.\-]{0,63}$/v
/** Paths the sites already use; a prefix there would hide their files. */
const RESERVED_PREFIXES = new Set(["/404", "/assets", "/images", "/posts"])

/**
 * Resolves and checks a target's first-party collector settings.
 *
 * @param target - The target whose collector settings are checked.
 * @returns The settings with their prefix, or undefined when the target has no collector.
 * @throws {Error} When the prefix, host, or site is not usable.
 */
export function collectorOf(target: Target): CollectorForwarding | undefined {
  if (target.collector === undefined) {
    return undefined
  }
  const { host, prefix = DEFAULT_COLLECTOR_PREFIX, site } = target.collector
  const ownHosts = [target.hostname, ...(target.aliasHostnames ?? []), `${target.name}.b-cdn.net`]
  if (!COLLECTOR_PREFIX.test(prefix) || RESERVED_PREFIXES.has(prefix)) {
    throw new Error(`${target.name}: collector prefix ${prefix} is not a single free path segment`)
  }
  // A collector on the site's own host would forward to itself.
  if (!COLLECTOR_HOST.test(host) || ownHosts.includes(host)) {
    throw new Error(`${target.name}: collector host ${host} is not another hostname`)
  }
  if (!COLLECTOR_SITE.test(site)) {
    throw new Error(`${target.name}: collector site ${site} is not a Tereon site name`)
  }
  return { host, prefix, site }
}

/**
 * The file beside a variant build's `client/` directory that records the
 * shared build time of both language builds, so it is never uploaded. The
 * Software build writes it and the SEO plan requires it there; builds of
 * other sites without it are compared as built together.
 */
export const BUILD_TIME_FILE = "build-time.txt"

/** Where every app prerenders its not-found route (React Router writes `<path>/index.html`). */
export const NOT_FOUND_PAGE = "/404/index.html"

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
// Widened so activation can change without changing the target construction.
const variants: Readonly<Record<string, VariantDefinition>> = VARIANTS

export const TARGETS: readonly Target[] = [
  ...Object.entries(variants).map(([variantId, variant]): Target => {
    const hostname = new URL(variant.canonicalOrigin).hostname
    return {
      buildDirectory: `apps/${variant.site}/build/${variantId}/client`,
      corsExtensions: [],
      ...(variant.productionActive
        ? {
            ...(variant.site === "consulting" ? { aliasHostnames: [`www.${hostname}`] } : {}),
            hostname,
          }
        : {}),
      name: variant.deploymentTarget,
      notFoundPage: NOT_FOUND_PAGE,
      ...(variant.site === "blog" ? { routingFilters: ["eu"] } : {}),
    }
  }),
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
