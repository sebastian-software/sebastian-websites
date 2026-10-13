/** Validates the SEO contract of built and published site variants (ADR-0010). */
import { Window } from "happy-dom"

import type { Fetch } from "./bunny.ts"
import type { Asset } from "./publish.ts"

import { getSiteVariant, type VariantDefinition, VARIANTS } from "../packages/web-core/src/sites.ts"
import { NOT_FOUND_PAGE, type Target } from "./targets.ts"

const OK = 200
const TIMEOUT_MS = 15_000
const INDEX_SUFFIX = "/index.html"
const ROOT_DOCUMENT = "index.html"
const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"
const decoder = new TextDecoder()
// Parse static markup only. Referenced scripts, styles, and frames must not run
// or make requests during a deployment check.
const window = new Window({
  settings: {
    disableCSSFileLoading: true,
    disableIframePageLoading: true,
    disableJavaScriptFileLoading: true,
    enableJavaScriptEvaluation: false,
  },
})

export type SeoPlan = {
  readonly paths: readonly string[]
  readonly variant: VariantDefinition
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

function assertSitemap(xml: string, plan: SeoPlan): void {
  const document = new window.DOMParser().parseFromString(xml, "application/xml")
  if (document.querySelector("parsererror") !== null) {
    throw new Error("SEO: sitemap.xml is invalid XML")
  }
  const root = document.documentElement
  if (root.localName !== "urlset" || root.namespaceURI !== SITEMAP_NAMESPACE) {
    throw new Error("SEO: sitemap.xml must be a sitemap urlset")
  }
  const actual = [...document.getElementsByTagNameNS(SITEMAP_NAMESPACE, "loc")].map((node) =>
    node.textContent.trim()
  )
  const expected = plan.paths.map((path) => `${plan.variant.canonicalOrigin}${path}`)
  if (
    actual.length !== expected.length ||
    new Set(actual).size !== actual.length ||
    expected.some((url) => !actual.includes(url))
  ) {
    throw new Error("SEO: sitemap.xml must contain exactly the canonical build pages")
  }
}

function robotsLines(text: string): string {
  return text
    .split(/\r?\n/v)
    .map((line) => line.split("#")[0].trim())
    .filter((line) => line !== "")
    .join("\n")
}

function assertRobots(text: string, variant: VariantDefinition): void {
  const expected = `User-agent: *\nAllow: /\nSitemap: ${variant.canonicalOrigin}/sitemap.xml`
  if (robotsLines(text) !== expected) {
    throw new Error("SEO: robots.txt must allow crawling and reference the variant's own sitemap")
  }
}

function blocksIndexing(directives: string): boolean {
  return /\b(?:noindex|none)\b/iv.test(directives)
}

function assertDocument(html: string, variant: VariantDefinition, path: string): void {
  const document = new window.DOMParser().parseFromString(html, "text/html")
  const canonical = `${variant.canonicalOrigin}${path}`
  const expected = [
    { href: `${getSiteVariant(variant.site, "de").canonicalOrigin}${path}`, language: "de" },
    { href: `${getSiteVariant(variant.site, "en").canonicalOrigin}${path}`, language: "en" },
    { href: `${getSiteVariant(variant.site, "en").canonicalOrigin}${path}`, language: "x-default" },
  ]
  const links = [...document.head.querySelectorAll("link")]
  const canonicals = links.filter((link) =>
    link.rel.toLowerCase().split(/\s+/v).includes("canonical")
  )
  if (canonicals.length !== 1 || canonicals[0].getAttribute("href") !== canonical) {
    throw new Error(`SEO ${path}: expected one self-referencing canonical ${canonical}`)
  }
  const alternates = links.filter(
    (link) =>
      link.rel.toLowerCase().split(/\s+/v).includes("alternate") && link.hasAttribute("hreflang")
  )
  if (
    alternates.length !== expected.length ||
    expected.some(
      (link) =>
        alternates.filter(
          (element) =>
            element.getAttribute("hreflang") === link.language &&
            element.getAttribute("href") === link.href
        ).length !== 1
    )
  ) {
    throw new Error(`SEO ${path}: expected reciprocal de, en, and x-default alternates`)
  }
  if (document.documentElement.lang !== variant.locale) {
    throw new Error(`SEO ${path}: expected document language ${variant.locale}`)
  }
  for (const meta of document.head.querySelectorAll("meta")) {
    if (["googlebot", "robots"].includes(meta.name.toLowerCase()) && blocksIndexing(meta.content)) {
      throw new Error(`SEO ${path}: meta ${meta.name} blocks indexing`)
    }
  }
}

/**
 * Validates every indexable build document and its crawl files before upload.
 * The brand catalog and shared asset zone have no variant SEO contract.
 *
 * @param target - The hosting target.
 * @param assets - Its complete build files.
 * @returns The variant and canonical paths, or undefined for non-site targets.
 */
export function seoPlanFor(target: Target, assets: readonly Asset[]): SeoPlan | undefined {
  const variant = Object.values(VARIANTS).find((entry) => entry.deploymentTarget === target.name)
  if (variant === undefined || target.assets === true) {
    return undefined
  }
  const notFound = (target.notFoundPage ?? NOT_FOUND_PAGE).slice(1)
  const paths = assets
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
    throw new Error("SEO: build lacks its home page")
  }
  const plan = { paths, variant }
  assertSitemap(buildText(assets, "sitemap.xml"), plan)
  assertRobots(buildText(assets, "robots.txt"), variant)
  for (const path of paths) {
    assertDocument(buildText(assets, documentPath(path)), variant, path)
  }
  return plan
}

async function fetchText(request: Fetch, origin: string, path: string): Promise<string> {
  const response = await request(`${origin}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (response.status !== OK) {
    throw new Error(`SEO ${origin}${path}: HTTP ${response.status}, expected ${OK}`)
  }
  if (blocksIndexing(response.headers.get("x-robots-tag") ?? "")) {
    throw new Error(`SEO ${origin}${path}: X-Robots-Tag blocks indexing`)
  }
  return response.text()
}

/**
 * Checks all sitemap pages on the published origin and their other-language
 * counterparts. Both variants must be published before this check runs.
 * Canonical and alternate addresses remain public domains even before cutover.
 *
 * @param plan - The validated build contract.
 * @param request - The fetch implementation, replaceable in tests.
 */
export async function verifySeo(plan: SeoPlan, request: Fetch = fetch): Promise<void> {
  const { variant } = plan
  const origin = `https://${variant.deploymentTarget}.b-cdn.net`
  assertSitemap(await fetchText(request, origin, "/sitemap.xml"), plan)
  assertRobots(await fetchText(request, origin, "/robots.txt"), variant)
  const other = getSiteVariant(variant.site, variant.locale === "de" ? "en" : "de")
  const otherOrigin = `https://${other.deploymentTarget}.b-cdn.net`
  assertSitemap(await fetchText(request, otherOrigin, "/sitemap.xml"), {
    paths: plan.paths,
    variant: other,
  })
  assertRobots(await fetchText(request, otherOrigin, "/robots.txt"), other)
  for (const path of plan.paths) {
    assertDocument(await fetchText(request, origin, path), variant, path)
    assertDocument(await fetchText(request, otherOrigin, path), other, path)
  }
}
