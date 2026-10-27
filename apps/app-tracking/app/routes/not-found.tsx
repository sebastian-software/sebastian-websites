import type { ReactElement } from "react"

import { NOT_FOUND_HANDLE, NotFound } from "@sebastian-websites/ui"
import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import { getSiteFrame } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

import type { Route } from "./+types/not-found"

/**
 * Every unknown address. It is prerendered as /404, which the storage zone
 * returns with status 404 for missing files; in the browser the same route
 * matches the requested address, so the page hydrates unchanged.
 */
// eslint-disable-next-line react-refresh/only-export-components -- React Router reads handle from the route module
export const handle = NOT_FOUND_HANDLE

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  const copy = createFrameCopy(__BUILD_YEAR__)
  const brand = copy.brandNames[getSiteFrame(variant.site, variant.locale, "/").brand]
  return [
    { title: `${copy.notFound.pageTitle} – ${brand}` },
    { content: "noindex", name: "robots" },
  ]
}

export default function NotFoundRoute(): ReactElement {
  return (
    <NotFound
      copy={createFrameCopy(__BUILD_YEAR__)}
      frame={getSiteFrame(variant.site, variant.locale, "/")}
    />
  )
}
