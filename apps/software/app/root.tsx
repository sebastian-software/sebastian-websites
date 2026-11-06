import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement, ReactNode } from "react"

import {
  DocumentNavigation,
  FaviconLinks,
  FONT_STYLESHEET,
  isNotFoundHandle,
  NotFound,
  PageEnding,
  PageError,
  SiteHeader,
} from "@sebastian-websites/ui"
import { createPageErrorCopy } from "@sebastian-websites/ui/error-copy"
import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import { getSiteFrame, SITE_BRAND } from "@sebastian-websites/web-core"
import { ArdoHead, ArdoOutlet, ArdoScripts, useArdoPage } from "ardo/runtime"
import "@sebastian-websites/ui/brand-software.css"
import "@sebastian-websites/ui/styles.css"

// eslint-disable-next-line import/no-unassigned-import -- Initialize the public translation runtime before Ardo resolves page metadata.
import "~/lib/i18n"
import { variant } from "~/lib/site"

const NOT_FOUND = 404

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads root metadata.
export function meta(): ArdoMetaDescriptor[] {
  const copy = createFrameCopy(__BUILD_YEAR__)
  return [
    { title: `${copy.notFound.pageTitle} – ${copy.brandNames.software}` },
    { content: "noindex", name: "robots" },
  ]
}

export function Layout({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <html data-palamedes-time-zone="Europe/Berlin" lang={variant.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <FaviconLinks brand={SITE_BRAND[variant.site]} />
        <link crossOrigin="anonymous" href={FONT_STYLESHEET} rel="stylesheet" />
        <ArdoHead />
      </head>
      <body>
        {children}
        <ArdoScripts />
      </body>
    </html>
  )
}

export default function App(): ReactElement {
  const page = useArdoPage()
  const notFound =
    (page.error != null && "status" in page.error && page.error.status === NOT_FOUND) ||
    isNotFoundHandle(page.handle)
  const frame = getSiteFrame(variant.site, variant.locale, notFound ? "/" : page.path)
  const copy = createFrameCopy(__BUILD_YEAR__)
  return (
    <DocumentNavigation>
      <SiteHeader copy={copy} frame={frame} />
      <ArdoOutlet />
      <PageEnding copy={copy} frame={frame} />
    </DocumentNavigation>
  )
}

/**
 * Use existing Ardo error exports; comprehensive browser recovery is optional #498.
 * @returns The translated not-found or error view.
 */
export function ErrorBoundary(): ReactElement {
  const page = useArdoPage()
  return page.error != null && "status" in page.error && page.error.status === NOT_FOUND ? (
    <NotFound
      copy={createFrameCopy(__BUILD_YEAR__)}
      frame={getSiteFrame(variant.site, variant.locale, "/")}
    />
  ) : (
    <PageError copy={createPageErrorCopy()} />
  )
}
