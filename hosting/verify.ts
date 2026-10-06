/**
 * Checks a published target over HTTPS on its origin host: documents resolve
 * without an extension, a trailing slash redirects, unknown paths are 404, and
 * exported assets carry open CORS.
 */
import { setTimeout as pause } from "node:timers/promises"

import type { Fetch } from "./bunny.ts"
import type { Log } from "./provision.ts"
import type { Asset } from "./publish.ts"
import type { Target } from "./targets.ts"

const OK = 200
const MOVED_PERMANENTLY = 301
const NOT_FOUND = 404
const REQUEST_TIMEOUT_MS = 15_000
const ATTEMPTS = 6
const RETRY_BASE_MS = 2000
const INDEX_SUFFIX = "/index.html"

export type Check = {
  readonly cors?: boolean
  readonly location?: string
  readonly path: string
  readonly status: number
  readonly text?: string
}

/**
 * Derives the checks for a target from its build: the home page, one
 * prerendered route with and without a trailing slash, a missing path, and
 * one exported asset per CORS extension.
 *
 * @param target - The target whose exported extensions need CORS checks.
 * @param assets - The build files.
 * @returns The checks to run.
 */
export function checksFor(target: Target, assets: readonly Asset[]): readonly Check[] {
  const checks: Check[] = [
    { path: "/", status: OK, text: "<html" },
    { path: "/no-such-page-verification", status: NOT_FOUND },
  ]
  const route = assets.find(
    (asset) => asset.path.endsWith(INDEX_SUFFIX) && !asset.path.startsWith("assets/")
  )
  if (route !== undefined) {
    const path = `/${route.path.slice(0, -INDEX_SUFFIX.length)}`
    checks.push(
      { path, status: OK, text: "<html" },
      { location: path, path: `${path}/`, status: MOVED_PERMANENTLY }
    )
  }
  for (const extension of target.corsExtensions) {
    const asset = assets.find((entry) => entry.path.endsWith(`.${extension}`))
    if (asset !== undefined) {
      checks.push({ cors: true, path: `/${asset.path}`, status: OK })
    }
  }
  return checks
}

async function runCheck(request: Fetch, origin: string, check: Check): Promise<void> {
  const response = await request(`${origin}${check.path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  const body = await response.text()
  if (response.status !== check.status) {
    throw new Error(`${check.path}: HTTP ${response.status}, expected ${check.status}`)
  }
  if (check.text !== undefined && !body.includes(check.text)) {
    throw new Error(`${check.path}: body lacks ${check.text}`)
  }
  const location = response.headers.get("location") ?? "nowhere"
  if (check.location !== undefined && location !== `${origin}${check.location}`) {
    throw new Error(`${check.path}: redirects to ${location}`)
  }
  if (check.cors === true && response.headers.get("access-control-allow-origin") !== "*") {
    throw new Error(`${check.path}: open CORS is missing`)
  }
}

export type VerifyOptions = {
  readonly assets: readonly Asset[]
  readonly log?: Log
  readonly request?: Fetch
  readonly target: Target
}

/**
 * Runs every check of a target against its origin host, retrying while the
 * CDN propagates the publish.
 *
 * @param options - The target, its build files, and optional fetch and log.
 */
export async function verify(options: VerifyOptions): Promise<void> {
  const { assets, log = console.log, request = fetch, target } = options
  const origin = `https://${target.name}.b-cdn.net`
  const checks = checksFor(target, assets)
  for (let attempt = 1; ; attempt += 1) {
    const failure = await runChecks(request, origin, checks)
    if (failure === undefined) {
      log(`Verified ${target.name}: ${checks.length} checks`)
      return
    }
    if (attempt === ATTEMPTS) {
      throw failure
    }
    log(`${target.name} attempt ${attempt}: ${failure.message}`)
    await pause(RETRY_BASE_MS * attempt)
  }
}

async function runChecks(
  request: Fetch,
  origin: string,
  checks: readonly Check[]
): Promise<Error | undefined> {
  try {
    for (const check of checks) {
      await runCheck(request, origin, check)
    }
    return undefined
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error))
  }
}
