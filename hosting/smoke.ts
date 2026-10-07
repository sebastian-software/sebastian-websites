/**
 * Checks one live site variant over HTTPS during and after its cutover: the
 * home page answers 200, an unknown path 404, and every legacy rule of the
 * site answers as `redirects.ts` plans it. Run against the canonical origin
 * after the DNS switch, or against the origin host beforehand:
 *
 *   node hosting/smoke.ts software-de
 *   node hosting/smoke.ts software-de https://sebastian-websites-software-de.b-cdn.net
 */
import { pathToFileURL } from "node:url"

import type { Fetch } from "./bunny.ts"

import { getVariant } from "../packages/web-core/src/sites.ts"
import { PATH_RULES, planLegacyPath } from "./redirects.ts"

const OK = 200
const MOVED_PERMANENTLY = 301
const NOT_FOUND = 404
const GONE = 410
const REQUEST_TIMEOUT_MS = 15_000

export type SmokeCheck = {
  readonly location?: string
  readonly path: string
  readonly status: number
}

/**
 * Derives the checks for a variant from its legacy rules; a rule for a whole
 * subtree is probed with one example path below it.
 *
 * @param variantId - The variant, such as `consulting-de`.
 * @param origin - The origin the requests go to.
 * @returns The checks in rule order, after the home page and the unknown path.
 */
export function smokeChecks(variantId: string, origin: string): readonly SmokeCheck[] {
  const serving = getVariant(variantId)
  const checks: SmokeCheck[] = [
    { path: "/", status: OK },
    { path: "/no-such-page-smoke", status: NOT_FOUND },
  ]
  for (const rule of PATH_RULES[serving.site]) {
    const path = rule.path.endsWith("/*") ? `${rule.path.slice(0, -1)}example` : rule.path
    const plan = planLegacyPath(serving, new URL(path, origin))
    if (plan?.kind === "moved") {
      checks.push({ location: plan.location, path, status: MOVED_PERMANENTLY })
    } else if (plan?.kind === "gone") {
      checks.push({ path, status: GONE })
    }
  }
  return checks
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
    }
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
