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
