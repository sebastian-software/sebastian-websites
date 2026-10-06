/**
 * The pure part of the pull-zone middleware: how a visitor's path maps to the
 * storage origin. Prerendering writes every route as `<route>/index.html`, and
 * Bunny Storage serves files, not directory indexes, so extension-less paths are
 * resolved here. Canonical paths carry no trailing slash (ADR-0010), so a
 * trailing slash redirects permanently.
 */

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

/** Headers that mean nothing to a static file store. */
const STRIPPED_ORIGIN_HEADERS = ["cookie", "referer"] as const

/**
 * Turns the origin request into the request the storage zone should receive,
 * or into a redirect response for the visitor.
 *
 * @param request - The origin request as Bunny hands it to the middleware.
 * @param storageZone - The storage zone name behind the pull zone.
 * @returns The rewritten origin request, or a permanent redirect.
 */
export function originRequest(request: Request, storageZone: string): Request | Response {
  const url = new URL(request.url)
  const plan = planPath(publicPath(url.pathname, storageZone))
  if (plan.kind === "redirect") {
    const host = request.headers.get("cdn-host") ?? url.hostname
    const protocol = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")
    return new Response(null, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        Location: `${protocol}://${host}${plan.pathname}${url.search}`,
      },
      status: MOVED_PERMANENTLY,
    })
  }
  const prefix = url.pathname.startsWith(`/${storageZone}/`) ? `/${storageZone}` : ""
  url.pathname = `${prefix}${plan.pathname}`
  const headers = new Headers(request.headers)
  for (const name of STRIPPED_ORIGIN_HEADERS) {
    headers.delete(name)
  }
  return new Request(url.toString(), { headers, method: request.method })
}
