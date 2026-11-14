import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { NOT_FOUND_HANDLE, NotFound } from "@sebastian-websites/ui"
import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import { getSiteFrame } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

/**
 * The storage zone serves this static document with status 404 for missing
 * files. Ardo renders the same translated recovery view for unknown paths.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads handle from the route module
export const handle = NOT_FOUND_HANDLE

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
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
