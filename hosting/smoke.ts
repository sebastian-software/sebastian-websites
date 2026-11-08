/**
 * Checks one live site variant over HTTPS during and after its cutover: the
 * home page answers 200, an unknown path 404, and every legacy rule of the
 * site answers as `redirects.ts` plans it. Software also checks its resources,
 * the blog overview, and both feeds with their media types. Run against the canonical origin
 * after the DNS switch, or against the origin host beforehand:
 *
 *   node hosting/smoke.ts software-de
 *   node hosting/smoke.ts software-de https://sebastian-websites-software-de.b-cdn.net
 */
import { pathToFileURL } from "node:url"

import type { Fetch } from "./bunny.ts"

import { BLOG_PATH, BLOG_SITE } from "../packages/web-core/src/blogPaths.ts"
import { getVariant } from "../packages/web-core/src/sites.ts"
import { PATH_RULES, type PathRule, planLegacyPath, type ServingVariant } from "./redirects.ts"

const OK = 200
const MOVED_PERMANENTLY = 301
const NOT_FOUND = 404
const GONE = 410
const REQUEST_TIMEOUT_MS = 15_000

/** Generic XML types a host may serve for `.xml` files, besides the feed-specific one. */
const XML_TYPES = ["application/xml", "text/xml"] as const

export type SmokeCheck = {
  readonly contentTypes?: readonly string[]
  readonly location?: string
  readonly path: string
  readonly status: number
}

/**
 * Derives the checks for a variant from its legacy rules; a rule for a whole
 * subtree is probed with one example path below it. A rule scoped to the other
 * language is probed as an unknown path, which must stay 404 on this domain.
 *
 * @param variantId - The variant, such as `consulting-de`.
 * @param origin - The origin the requests go to.
 * @param rules - The site's legacy rules, replaceable in tests.
 * @returns The checks in rule order, after the home page and the unknown path.
 */
export function smokeChecks(
  variantId: string,
  origin: string,
  rules?: readonly PathRule[]
): readonly SmokeCheck[] {
  const serving = getVariant(variantId)
  const siteRules = rules ?? PATH_RULES[serving.site]
  const checks: SmokeCheck[] = [
    { path: "/", status: OK },
    { path: "/no-such-page-smoke", status: NOT_FOUND },
  ]
  if (serving.site === "software") {
    checks.push(
      { contentTypes: [...XML_TYPES], path: "/sitemap.xml", status: OK },
      { contentTypes: ["text/plain"], path: "/robots.txt", status: OK },
      {
        contentTypes: ["application/manifest+json", "application/json"],
        path: "/manifest.webmanifest",
        status: OK,
      }
    )
  }
  if (serving.site === BLOG_SITE) {
    // Feed discovery: the overview and both feeds exist on each domain, even without posts.
    checks.push(
      { contentTypes: ["text/html"], path: BLOG_PATH, status: OK },
      {
        contentTypes: ["application/rss+xml", ...XML_TYPES],
        path: `${BLOG_PATH}/rss.xml`,
        status: OK,
      },
      {
        contentTypes: ["application/atom+xml", ...XML_TYPES],
        path: `${BLOG_PATH}/atom.xml`,
        status: OK,
      }
    )
  }
  for (const rule of siteRules) {
    const check = ruleCheck({ origin, rule, rules: siteRules, serving })
    if (check !== undefined) checks.push(check)
  }
  return checks
}

/**
 * The expected answer to one legacy rule on the serving domain.
 *
 * @param context - The serving variant, the origin, the rule, and all rules of the site.
 * @param context.origin - The origin the requests go to.
 * @param context.rule - The rule to probe.
 * @param context.rules - All rules of the site, which decide the actual answer.
 * @param context.serving - The site and language of the domain.
 * @returns The check, or undefined when the path is no legacy path on this domain.
 */
function ruleCheck(context: {
  readonly origin: string
  readonly rule: PathRule
  readonly rules: readonly PathRule[]
  readonly serving: ServingVariant
}): SmokeCheck | undefined {
  const { origin, rule, rules, serving } = context
  const path = rule.path.endsWith("/*") ? `${rule.path.slice(0, -1)}example` : rule.path
  const plan = planLegacyPath(serving, new URL(path, origin), rules)
  if (plan?.kind === "moved") {
    return { location: plan.location, path, status: MOVED_PERMANENTLY }
  }
  if (plan?.kind === "gone") {
    return { path, status: GONE }
  }
  // A rule of the other language leaves the path unknown here.
  return rule.locale !== undefined && rule.locale !== serving.locale
    ? { path, status: NOT_FOUND }
    : undefined
}

/**
 * Compare response media types independently of optional charset parameters.
 * @param check - The resource media types allowed by the hosting contract.
 * @param response - The origin response to inspect.
 * @returns A diagnostic for an unexpected media type, otherwise undefined.
 */
function contentTypeFailure(check: SmokeCheck, response: Response): string | undefined {
  if (check.contentTypes === undefined) return
  const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase()
  if (contentType !== undefined && check.contentTypes.includes(contentType)) return
  return `${check.path}: Content-Type ${contentType ?? "missing"}, expected ${check.contentTypes.join(" or ")}`
}

/**
 * Runs the checks and reports every failure instead of stopping at the first.
 *
 * @param origin - The origin the requests go to.
 * @param checks - The expected answers.
 * @param request - The fetch implementation, replaceable in tests.
 * @returns One message per failed check.
 */
export async function runSmoke(
  origin: string,
  checks: readonly SmokeCheck[],
  request: Fetch = fetch
): Promise<readonly string[]> {
  const failures: string[] = []
  for (const check of checks) {
    const response = await request(`${origin}${check.path}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const location = response.headers.get("location") ?? undefined
    if (response.status !== check.status || location !== check.location) {
      failures.push(
        `${check.path}: ${String(response.status)} ${location ?? ""}, expected ${String(check.status)} ${check.location ?? ""}`
      )
      continue
    }
    const typeFailure = contentTypeFailure(check, response)
    if (typeFailure !== undefined) failures.push(typeFailure)
  }
  return failures
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [variantId = "", originArgument = ""] = process.argv.slice(2)
  const origin = originArgument === "" ? getVariant(variantId).canonicalOrigin : originArgument
  const checks = smokeChecks(variantId, origin)
  const failures = await runSmoke(origin, checks)
  for (const failure of failures) {
    console.error(`✗ ${failure}`)
  }
  console.log(
    `${origin}: ${String(checks.length - failures.length)}/${String(checks.length)} checks passed`
  )
  process.exitCode = failures.length === 0 ? 0 : 1
}
