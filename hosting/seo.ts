/**
 * Validates the SEO contract of built and published site variants (ADR-0010).
 * The plan compares both language builds of a site: a path present in both
 * needs reciprocal alternates, and only the Software blog may have pages in
 * one language.
 */
import type { Fetch } from "./bunny.ts"
import type { Asset } from "./publish.ts"

import { BLOG_SITE, singleLanguageClass } from "../packages/web-core/src/blogPaths.ts"
import {
  getSiteVariant,
  type Locale,
  type VariantDefinition,
  VARIANTS,
} from "../packages/web-core/src/sites.ts"
import { isZonedTimestamp } from "../packages/web-core/src/timestamps.ts"
import {
  type Alternate,
  assertDocument,
  assertRobots,
  assertSitemap,
  blocksIndexing,
  openGraph,
  parseHtml,
  type SeoPlan,
} from "./seo-documents.ts"
import { NOT_FOUND_PAGE, type Target } from "./targets.ts"

export type { Alternate, SeoPlan } from "./seo-documents.ts"

const OK = 200
const NOT_FOUND = 404
const TIMEOUT_MS = 15_000
const INDEX_SUFFIX = "/index.html"
const ROOT_DOCUMENT = "index.html"
const decoder = new TextDecoder()

/** The build of one hosting target, as deployment and the CI check load it. */
export type SiteBuild = {
  readonly assets: readonly Asset[]
  /**
   * The shared build time recorded beside the build's `client/` directory.
   * Builds that record none leave it undefined; such a pair counts as equal.
   */
  readonly buildTime?: string
  readonly target: Target
}

function buildText(assets: readonly Asset[], path: string): string {
  const asset = assets.find((entry) => entry.path === path)
  if (asset === undefined) {
    throw new Error(`SEO: build lacks ${path}`)
  }
  return decoder.decode(asset.bytes)
}

function documentPath(path: string): string {
  return path === "/" ? ROOT_DOCUMENT : `${path.slice(1)}${INDEX_SUFFIX}`
}

function variantOf(target: Target): undefined | VariantDefinition {
  if (target.assets === true) return undefined
  return Object.values(VARIANTS).find((entry) => entry.deploymentTarget === target.name)
}

function indexablePaths(build: SiteBuild): readonly string[] {
  const notFound = (build.target.notFoundPage ?? NOT_FOUND_PAGE).slice(1)
  const paths = build.assets
    .filter(
      (asset) =>
        asset.path === ROOT_DOCUMENT ||
        (asset.path.endsWith(INDEX_SUFFIX) &&
          asset.path !== notFound &&
          !asset.path.startsWith("assets/"))
    )
    .map((asset) =>
      asset.path === ROOT_DOCUMENT ? "/" : `/${asset.path.slice(0, -INDEX_SUFFIX.length)}`
    )
  if (!paths.includes("/")) {
    throw new Error(`SEO: ${build.target.name} lacks its home page`)
  }
  return paths
}

/**
 * Tells whether a path may exist in one language only: a Software blog post,
 * shaped `/blog/<slug>` and marked as an Open Graph article, or a tag archive
 * at `/blog/tags/<key>`.
 *
 * @param build - The build that holds the path.
 * @param site - The site of that build.
 * @param path - The indexable path.
 * @returns Whether the page belongs to an allowed single-language class.
 */
function isSingleLanguagePage(build: SiteBuild, site: string, path: string): boolean {
  if (site !== BLOG_SITE) return false
  const kind = singleLanguageClass(path)
  if (kind !== "post") return kind === "tag-archive"
  return openGraph(parseHtml(buildText(build.assets, documentPath(path))), "og:type").includes(
    "article"
  )
}

function assertBuildTime(site: string, build: SiteBuild): void {
  if (build.buildTime !== undefined && !isZonedTimestamp(build.buildTime)) {
    throw new Error(
      `SEO: the ${site} build time ${build.buildTime} is no timestamp with seconds and a time zone`
    )
  }
}

type Pair = Readonly<
  Record<Locale, { readonly build: SiteBuild; readonly variant: VariantDefinition }>
>

function pairs(builds: readonly SiteBuild[]): readonly Pair[] {
  const bySite = new Map<
    string,
    Partial<Record<Locale, { build: SiteBuild; variant: VariantDefinition }>>
  >()
  for (const build of builds) {
    const variant = variantOf(build.target)
    if (variant === undefined) continue
    const entry = bySite.get(variant.site) ?? {}
    entry[variant.locale] = { build, variant }
    bySite.set(variant.site, entry)
  }
  return [...bySite].map(([site, entry]) => {
    const { de, en } = entry
    if (de === undefined || en === undefined) {
      const present = de === undefined ? "en" : "de"
      throw new Error(`SEO: ${site} has a build for ${present} only; both languages must be built`)
    }
    assertBuildTime(site, de.build)
    assertBuildTime(site, en.build)
    // Builds without the file still pass as long as both lack it: build.ts does not
    // write it yet. The blog launch makes it mandatory for Software.
    const [german, english] = [de.build.buildTime, en.build.buildTime].map((time) =>
      time === undefined ? undefined : Date.parse(time)
    )
    if (german !== english) {
      throw new Error(
        `SEO: the ${site} builds record different build times (de ${de.build.buildTime ?? "none"}, en ${en.build.buildTime ?? "none"})`
      )
    }
    return { de, en }
  })
}

function alternatesFor(variant: VariantDefinition, path: string): readonly Alternate[] {
  const german = getSiteVariant(variant.site, "de").canonicalOrigin
  const english = getSiteVariant(variant.site, "en").canonicalOrigin
  return [
    { href: `${german}${path}`, language: "de" },
    { href: `${english}${path}`, language: "en" },
    { href: `${english}${path}`, language: "x-default" },
  ]
}

function planFor(pair: Pair, locale: Locale): SeoPlan {
  const { build, variant } = pair[locale]
  const other = pair[locale === "de" ? "en" : "de"]
  const paths = indexablePaths(build)
  const otherPaths = indexablePaths(other.build)
  const alternates = new Map<string, readonly Alternate[]>()
  for (const path of paths) {
    if (otherPaths.includes(path)) {
      alternates.set(path, alternatesFor(variant, path))
    } else if (isSingleLanguagePage(build, variant.site, path)) {
      alternates.set(path, [])
    } else {
      throw new Error(
        `SEO ${path}: ${variant.site}-${locale} has no counterpart; only Software blog posts and tag archives may exist in one language`
      )
    }
  }
  return { absent: otherPaths.filter((path) => !paths.includes(path)), alternates, paths, variant }
}

function assertBuild(build: SiteBuild, plan: SeoPlan): void {
  assertSitemap(buildText(build.assets, "sitemap.xml"), plan)
  assertRobots(buildText(build.assets, "robots.txt"), plan.variant)
  for (const path of plan.paths) {
    assertDocument(buildText(build.assets, documentPath(path)), plan, path)
  }
}

/**
 * Compares both language builds of every site and validates each indexable
 * document and its crawl files before upload. A site needs both builds with
 * the same recorded build time; a path present in both needs reciprocal
 * hreflang and `x-default`; only Software blog posts and tag archives may exist
 * in one language, and they link no alternates. The brand catalog and the
 * shared asset zone have no variant SEO contract.
 *
 * @param builds - The builds of every buildable target.
 * @returns One plan per variant target, keyed by target name.
 */
export function seoPlans(builds: readonly SiteBuild[]): ReadonlyMap<string, SeoPlan> {
  const plans = new Map<string, SeoPlan>()
  for (const pair of pairs(builds)) {
    for (const locale of ["de", "en"] as const) {
      const plan = planFor(pair, locale)
      assertBuild(pair[locale].build, plan)
      plans.set(pair[locale].build.target.name, plan)
    }
  }
  return plans
}

async function fetchResponse(request: Fetch, origin: string, path: string): Promise<Response> {
  return request(`${origin}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
}

async function fetchText(request: Fetch, origin: string, path: string): Promise<string> {
  const response = await fetchResponse(request, origin, path)
  if (response.status !== OK) {
    throw new Error(`SEO ${origin}${path}: HTTP ${response.status}, expected ${OK}`)
  }
  if (blocksIndexing(response.headers.get("x-robots-tag") ?? "")) {
    throw new Error(`SEO ${origin}${path}: X-Robots-Tag blocks indexing`)
  }
  return response.text()
}

/**
 * Checks the published origin of one variant against its own plan: its
 * sitemap, robots file, and every indexable document, and a 404 for the other
 * language's single-language pages. Canonical and alternate addresses remain
 * public domains even before cutover.
 *
 * @param plan - The validated build contract of this variant.
 * @param request - The fetch implementation, replaceable in tests.
 */
export async function verifySeo(plan: SeoPlan, request: Fetch = fetch): Promise<void> {
  const { variant } = plan
  const origin = `https://${variant.deploymentTarget}.b-cdn.net`
  assertSitemap(await fetchText(request, origin, "/sitemap.xml"), plan)
  assertRobots(await fetchText(request, origin, "/robots.txt"), variant)
  for (const path of plan.paths) {
    assertDocument(await fetchText(request, origin, path), plan, path)
  }
  for (const path of plan.absent) {
    const response = await fetchResponse(request, origin, path)
    await response.body?.cancel()
    if (response.status !== NOT_FOUND) {
      throw new Error(`SEO ${origin}${path}: HTTP ${response.status}, expected ${NOT_FOUND}`)
    }
  }
}
