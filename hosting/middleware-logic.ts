/**
 * The pure part of the pull-zone middleware: how a visitor's path maps to the
 * storage origin. Known legacy paths redirect or answer 410 first (ADR-0010).
 * Prerendering writes every route as `<route>/index.html`, and Bunny Storage
 * serves files, not directory indexes, so extension-less paths are resolved
 * here. Canonical paths carry no trailing slash, so a trailing slash redirects
 * permanently.
 */
import { planLegacyPath, zoneVariant } from "./redirects.ts"

export type OriginPlan =
  | { readonly kind: "redirect"; readonly pathname: string }
  | { readonly kind: "rewrite"; readonly pathname: string }

/**
 * Recovers the public path from the origin path Bunny hands the middleware,
 * which may carry the storage zone as its first segment.
 *
 * @param internalPathname - The path of the origin request.
 * @param storageZone - The storage zone name.
 * @returns The path the visitor requested.
 */
export function publicPath(internalPathname: string, storageZone: string): string {
  const prefix = `/${storageZone}`
  if (internalPathname === prefix) {
    return "/"
  }
  return internalPathname.startsWith(`${prefix}/`)
    ? internalPathname.slice(prefix.length)
    : internalPathname
}

/**
 * Decides what the origin should serve for a public path.
 *
 * @param pathname - The public path.
 * @returns A redirect to the canonical path, or the storage path to fetch.
 */
export function planPath(pathname: string): OriginPlan {
  if (pathname === "/") {
    return { kind: "rewrite", pathname: "/index.html" }
  }
  let end = pathname.length
  while (end > 0 && pathname[end - 1] === "/") {
    end -= 1
  }
  const trimmed = pathname.slice(0, end)
  const lastSegment = trimmed.split("/").at(-1) ?? ""
  if (lastSegment.includes(".")) {
    return { kind: "rewrite", pathname: trimmed }
  }
  if (trimmed !== pathname) {
    return { kind: "redirect", pathname: trimmed === "" ? "/" : trimmed }
  }
  return { kind: "rewrite", pathname: `${pathname}/index.html` }
}

const MOVED_PERMANENTLY = 301
const GONE = 410
const REDIRECT_CACHE_CONTROL = "public, max-age=3600"

// Website zones ignore query strings in their cache key, so a cached redirect
// must not carry the query of the visitor who caused it; redirects drop it.

/** Headers that mean nothing to a static file store. */
const STRIPPED_ORIGIN_HEADERS = ["cookie", "referer"] as const

function redirect(location: string): Response {
  return new Response(null, {
    headers: { "Cache-Control": REDIRECT_CACHE_CONTROL, Location: location },
    status: MOVED_PERMANENTLY,
  })
}

function gone(): Response {
  return new Response("Gone: this page was removed on purpose.\n", {
    headers: {
      "Cache-Control": REDIRECT_CACHE_CONTROL,
      "Content-Type": "text/plain; charset=utf-8",
    },
    status: GONE,
  })
}

/**
 * Answers a known legacy path of the site the zone serves.
 *
 * @param storageZone - The storage zone, which identifies site and language.
 * @param url - The requested URL as the visitor sees it.
 * @returns A redirect or 410, or nothing when the path is not a legacy path.
 */
function legacyResponse(storageZone: string, url: URL): Response | undefined {
  const serving = zoneVariant(storageZone)
  const legacy = serving === undefined ? undefined : planLegacyPath(serving, url)
  if (legacy === undefined) {
    return undefined
  }
  return legacy.kind === "moved" ? redirect(legacy.location) : gone()
}

/**
 * Recovers the origin the visitor requested, which Bunny passes in headers
 * because the origin request itself targets the storage zone.
 *
 * @param request - Carries the `cdn-host` and `x-forwarded-proto` headers.
 * @param url - The parsed request address, the fallback for host and protocol.
 * @returns The visitor's protocol and host.
 */
function visitorOriginOf(request: Request, url: URL): string {
  const host = request.headers.get("cdn-host") ?? url.hostname
  const protocol = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
  return `${protocol}://${host}`
}

/**
 * Turns the origin request into the request the storage zone should receive,
 * or into a redirect or removal response for the visitor.
 *
 * @param request - The origin request as Bunny hands it to the middleware.
 * @param storageZone - The storage zone name behind the pull zone.
 * @returns The rewritten origin request, a permanent redirect, or a 410.
 */
export function originRequest(request: Request, storageZone: string): Request | Response {
  const url = new URL(request.url)
  const pathname = publicPath(url.pathname, storageZone)
  const visitorOrigin = visitorOriginOf(request, url)
  const legacy = legacyResponse(storageZone, new URL(pathname, visitorOrigin))
  if (legacy !== undefined) {
    return legacy
  }
  const plan = planPath(pathname)
  if (plan.kind === "redirect") {
    return redirect(`${visitorOrigin}${plan.pathname}`)
  }
  const prefix = url.pathname.startsWith(`/${storageZone}/`) ? `/${storageZone}` : ""
  url.pathname = `${prefix}${plan.pathname}`
  const headers = new Headers(request.headers)
  for (const name of STRIPPED_ORIGIN_HEADERS) {
    headers.delete(name)
  }
  return new Request(url.toString(), { headers, method: request.method })
}

/**
 * Where a site serves the Tereon collector under its own domain, so the
 * client script and its endpoint are first-party paths (Tereon ADR-0009).
 */
export type CollectorForwarding = {
  /** The collector's hostname, reached over HTTPS. */
  readonly host: string
  /** The path the script and endpoint live under, such as `/_s`. */
  readonly prefix: string
  /** The site's name in the collector's `TEREON_SITES` and `TEREON_FORWARDERS`. */
  readonly site: string
}

/** The middleware script's secret that holds the site's forwarder secret. */
export const FORWARD_SECRET_NAME = "TEREON_FORWARD_SECRET"

export type ForwardDependencies = {
  readonly fetch: typeof fetch
  readonly now: () => Date
  /** The forwarder secret from the script's environment, if it has one. */
  readonly secret: string | undefined
}

/** One request below the prefix: the site's settings and the path on the collector. */
export type CollectorRoute = { readonly forwarding: CollectorForwarding; readonly path: string }

/** A pull zone with first-party analytics: its storage zone and collector settings. */
export type FirstPartySite = {
  readonly forwarding: CollectorForwarding
  readonly storageZone: string
}

/** What a forwarded request is signed with. */
type Signing = {
  readonly body: Uint8Array<ArrayBuffer>
  readonly now: Date
  readonly route: CollectorRoute
  readonly secret: string
}

/** The collector refuses shorter secrets, so the middleware never sends with one. */
const MIN_SECRET_LENGTH = 32

/** The headers the collector reads to recognize and verify a forwarded request. */
const FORWARD_HEADERS = {
  country: "tereon-client-country",
  ip: "tereon-client-ip",
  signature: "tereon-signature",
  site: "tereon-forwarder",
  time: "tereon-forwarded-at",
} as const

/**
 * The only visitor headers the collector receives. Cookies, `Authorization`,
 * and every address header the visitor could set stay behind.
 */
const FORWARDED_REQUEST_HEADERS = ["accept", "content-type", "dnt", "sec-gpc", "user-agent"]
const FORWARDED_RESPONSE_HEADERS = ["allow", "cache-control", "content-type"]
const FORWARDED_METHODS = new Set(["GET", "HEAD", "POST"])
/** The collector's own limit; a larger body is refused before it travels. */
const MAX_FORWARD_BODY_BYTES = 8192
const FORWARD_TIMEOUT_MS = 8000
const MS_PER_SECOND = 1000
const HEX_RADIX = 16
const OK_MIN = 200
const OK_MAX = 299
const NO_CONTENT = 204
const RESET_CONTENT = 205
const NOT_MODIFIED = 304
const METHOD_NOT_ALLOWED = 405
const PAYLOAD_TOO_LARGE = 413
const BAD_GATEWAY = 502
const SERVICE_UNAVAILABLE = 503
/** Statuses whose responses must not carry a body. */
const NULL_BODY_STATUSES = new Set([NO_CONTENT, NOT_MODIFIED, RESET_CONTENT])

/**
 * Maps a public path below the prefix to the collector's path.
 *
 * @param pathname - The public path.
 * @param prefix - The site's collector prefix.
 * @returns The path on the collector, or undefined outside the prefix.
 */
export function collectorPath(pathname: string, prefix: string): string | undefined {
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : undefined
}

function addressOf(headers: Headers): string {
  const real = headers.get("x-real-ip")?.trim() ?? ""
  const ip = real === "" ? (headers.get("x-forwarded-for")?.split(",").at(0)?.trim() ?? "") : real
  return /^[\d.:a-f]{1,45}$/iv.test(ip) ? ip : ""
}

/**
 * The visitor's address and country as Bunny reports them to the middleware,
 * read the way the collector reads them on a direct request.
 *
 * @param headers - The request headers Bunny hands the middleware.
 * @returns The address and the two-letter country code; each is empty when unknown.
 */
export function visitorOf(headers: Headers): { readonly country: string; readonly ip: string } {
  const country = headers.get("cdn-requestcountrycode")?.trim().toUpperCase() ?? ""
  return { country: /^[A-Z]{2}$/v.test(country) ? country : "", ip: addressOf(headers) }
}

const hex = (bytes: ArrayBuffer): string =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(HEX_RADIX).padStart(2, "0")).join("")

/** What the forwarder signs; the collector rebuilds the same text to verify it. */
export type SignedParts = {
  readonly body: Uint8Array<ArrayBuffer>
  readonly country: string
  readonly ip: string
  readonly method: string
  readonly path: string
  readonly site: string
  readonly time: number
  readonly userAgent: string
}

/**
 * Signs a forwarded request the way Tereon's collector verifies it: an
 * HMAC-SHA-256 over the site, time, method, path, address, country, user
 * agent, and the SHA-256 of the body, joined by line feeds.
 *
 * @param secret - The site's forwarder secret.
 * @param parts - The values to sign.
 * @returns The signature as lowercase hex.
 */
export async function signForwarded(secret: string, parts: SignedParts): Promise<string> {
  const encoder = new TextEncoder()
  const text = [
    "tereon-forward-v1",
    parts.site,
    String(parts.time),
    parts.method,
    parts.path,
    parts.ip,
    parts.country,
    parts.userAgent,
    hex(await crypto.subtle.digest("SHA-256", parts.body)),
  ].join("\n")
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"]
  )
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(text)))
}

function plain(message: string, status: number, extra: Record<string, string> = {}): Response {
  return new Response(`${message}\n`, {
    headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8", ...extra },
    status,
  })
}

async function readBody(request: Request): Promise<Uint8Array<ArrayBuffer> | undefined> {
  if (request.method !== "POST") {
    return new Uint8Array()
  }
  if (Number(request.headers.get("content-length")) > MAX_FORWARD_BODY_BYTES) {
    return undefined
  }
  const body = new Uint8Array(await request.arrayBuffer())
  return body.length > MAX_FORWARD_BODY_BYTES ? undefined : body
}

/**
 * The request headers for the collector: the allowed visitor headers and the
 * signed forwarding headers, which replace any the visitor sent.
 *
 * @param request - The visitor's request.
 * @param signing - The route, the body, the secret, and the clock.
 * @returns The headers to send.
 */
async function forwardedHeaders(request: Request, signing: Signing): Promise<Headers> {
  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value !== null) {
      headers.set(name, value)
    }
  }
  const { country, ip } = visitorOf(request.headers)
  const { site } = signing.route.forwarding
  const time = Math.floor(signing.now.getTime() / MS_PER_SECOND)
  const signature = await signForwarded(signing.secret, {
    body: signing.body,
    country,
    ip,
    method: request.method,
    path: signing.route.path,
    site,
    time,
    userAgent: headers.get("user-agent") ?? "",
  })
  headers.set(FORWARD_HEADERS.country, country)
  headers.set(FORWARD_HEADERS.ip, ip)
  headers.set(FORWARD_HEADERS.signature, signature)
  headers.set(FORWARD_HEADERS.site, site)
  headers.set(FORWARD_HEADERS.time, String(time))
  return headers
}

/**
 * Copies the collector's answer for the visitor. Only a successful read may
 * keep the collector's caching; everything else, the endpoint above all, is
 * marked as not storable.
 *
 * @param request - The visitor's request.
 * @param upstream - The collector's response.
 * @returns The response for the visitor.
 */
async function answerFrom(request: Request, upstream: Response): Promise<Response> {
  const headers = new Headers()
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name)
    if (value !== null) {
      headers.set(name, value)
    }
  }
  const succeeded = upstream.status >= OK_MIN && upstream.status <= OK_MAX
  if (request.method === "POST" || !succeeded) {
    headers.set("cache-control", "no-store")
  }
  const empty = request.method === "HEAD" || NULL_BODY_STATUSES.has(upstream.status)
  const body = empty ? null : await upstream.arrayBuffer()
  return new Response(body, { headers, status: upstream.status })
}

/**
 * Forwards a request below the collector prefix to the collector, signed so
 * that the collector accepts the visitor's address and country from it.
 * Without its secret the middleware sends nothing: an unsigned address would
 * be worthless, and the collector would refuse the request anyway.
 *
 * @param request - The visitor's request as Bunny hands it to the middleware.
 * @param route - The site's collector settings and the path on the collector.
 * @param dependencies - Fetch, clock, and the forwarder secret.
 * @returns The collector's answer, or an error answer that is never cached.
 */
export async function forwardToCollector(
  request: Request,
  route: CollectorRoute,
  dependencies: ForwardDependencies
): Promise<Response> {
  const { secret } = dependencies
  if (!FORWARDED_METHODS.has(request.method)) {
    return plain("Method not allowed", METHOD_NOT_ALLOWED, { Allow: "GET, HEAD, POST" })
  }
  if (secret === undefined || secret.length < MIN_SECRET_LENGTH) {
    return plain("Analytics forwarding is not configured", SERVICE_UNAVAILABLE)
  }
  const body = await readBody(request)
  if (body === undefined) {
    return plain("Payload too large", PAYLOAD_TOO_LARGE)
  }
  const headers = await forwardedHeaders(request, { body, now: dependencies.now(), route, secret })
  let upstream: Response
  try {
    upstream = await dependencies.fetch(`https://${route.forwarding.host}${route.path}`, {
      ...(request.method === "POST" ? { body } : {}),
      headers,
      method: request.method,
      redirect: "manual",
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    })
  } catch {
    return plain("Analytics collector unavailable", BAD_GATEWAY)
  }
  return answerFrom(request, upstream)
}

/**
 * The origin-request handler of a site with first-party analytics: paths
 * below the collector prefix go to the collector, everything else to storage.
 *
 * @param request - The origin request as Bunny hands it to the middleware.
 * @param site - The storage zone behind the pull zone and the site's collector settings.
 * @param dependencies - Fetch, clock, and the forwarder secret.
 * @returns The collector's answer, or what `originRequest` returns.
 */
export async function firstPartyOriginRequest(
  request: Request,
  site: FirstPartySite,
  dependencies: ForwardDependencies
): Promise<Request | Response> {
  const { forwarding, storageZone } = site
  const pathname = publicPath(new URL(request.url).pathname, storageZone)
  const path = collectorPath(pathname, forwarding.prefix)
  return path === undefined
    ? originRequest(request, storageZone)
    : forwardToCollector(request, { forwarding, path }, dependencies)
}
