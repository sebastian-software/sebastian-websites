/**
 * The document-level SEO assertions shared by the build check and the
 * published verification: sitemap, robots file, canonical, hreflang
 * alternates, Open Graph, language, and indexing directives (ADR-0010).
 */
import { type Document, type Element, Window } from "happy-dom"

import type { VariantDefinition } from "../packages/web-core/src/sites.ts"

import { BLOG_SITE } from "../packages/web-core/src/blogPaths.ts"

const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"
/** Sites whose pages carry Open Graph: one `og:type`, and `og:url` equal to the canonical. */
const OPEN_GRAPH_SITES: ReadonlySet<string> = new Set([BLOG_SITE])
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

/** One hreflang alternate a document must link. */
export type Alternate = { readonly href: string; readonly language: string }

/** The SEO contract of one variant, derived from both language builds of its site. */
export type SeoPlan = {
  /** Paths of the other language's single-language pages, which this origin answers with 404. */
  readonly absent: readonly string[]
  /** The alternates each indexable path must link; empty for a single-language page. */
  readonly alternates: ReadonlyMap<string, readonly Alternate[]>
  /** The indexable paths: every document and the exact sitemap list. */
  readonly paths: readonly string[]
  readonly variant: VariantDefinition
}
export function parseHtml(html: string): Document {
  return new window.DOMParser().parseFromString(html, "text/html")
}

export function assertSitemap(xml: string, plan: SeoPlan): void {
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

export function assertRobots(text: string, variant: VariantDefinition): void {
  const expected = `User-agent: *\nAllow: /\nSitemap: ${variant.canonicalOrigin}/sitemap.xml`
  if (robotsLines(text) !== expected) {
    throw new Error("SEO: robots.txt must allow crawling and reference the variant's own sitemap")
  }
}

export function blocksIndexing(directives: string): boolean {
  return /\b(?:noindex|none)\b/iv.test(directives)
}

function hasRel(link: Element, rel: string): boolean {
  return (link.getAttribute("rel") ?? "").toLowerCase().split(/\s+/v).includes(rel)
}

function assertAlternates(
  links: readonly Element[],
  expected: readonly Alternate[],
  path: string
): void {
  const alternates = links.filter(
    (link) => hasRel(link, "alternate") && link.hasAttribute("hreflang")
  )
  if (expected.length === 0) {
    if (alternates.length > 0) {
      throw new Error(`SEO ${path}: a page without a counterpart must link no hreflang alternates`)
    }
    return
  }
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
}

export function openGraph(document: Document, property: string): readonly string[] {
  return [...document.head.querySelectorAll("meta")]
    .filter((meta) => meta.getAttribute("property") === property)
    .map((meta) => meta.getAttribute("content") ?? "")
}

/**
 * Open Graph names the same page as the canonical. Sites with an Open Graph
 * contract need exactly one `og:type` and one `og:url`; on other sites the
 * tags are optional but must not repeat or name another page.
 *
 * @param document - The parsed document.
 * @param context - The document's canonical URL, its path for messages, and its site.
 * @param context.canonical - The canonical URL.
 * @param context.path - The document's path.
 * @param context.site - The site that serves it.
 */
function assertOpenGraph(
  document: Document,
  context: { readonly canonical: string; readonly path: string; readonly site: string }
): void {
  const { canonical, path, site } = context
  const required = OPEN_GRAPH_SITES.has(site)
  const types = openGraph(document, "og:type")
  if (types.length > 1 || (required && types.length !== 1)) {
    throw new Error(`SEO ${path}: expected exactly one og:type`)
  }
  const urls = openGraph(document, "og:url")
  if (urls.length > 1 || (required && urls.length !== 1) || urls.some((url) => url !== canonical)) {
    throw new Error(`SEO ${path}: expected one og:url equal to the canonical ${canonical}`)
  }
}

export function assertDocument(html: string, plan: SeoPlan, path: string): void {
  const { variant } = plan
  const document = parseHtml(html)
  const canonical = `${variant.canonicalOrigin}${path}`
  const links = [...document.head.querySelectorAll("link")]
  const canonicals = links.filter((link) => hasRel(link, "canonical"))
  if (canonicals.length !== 1 || canonicals[0].getAttribute("href") !== canonical) {
    throw new Error(`SEO ${path}: expected one self-referencing canonical ${canonical}`)
  }
  assertAlternates(links, plan.alternates.get(path) ?? [], path)
  assertOpenGraph(document, { canonical, path, site: variant.site })
  if (document.documentElement.lang !== variant.locale) {
    throw new Error(`SEO ${path}: expected document language ${variant.locale}`)
  }
  for (const meta of document.head.querySelectorAll("meta")) {
    if (["googlebot", "robots"].includes(meta.name.toLowerCase()) && blocksIndexing(meta.content)) {
      throw new Error(`SEO ${path}: meta ${meta.name} blocks indexing`)
    }
  }
}
