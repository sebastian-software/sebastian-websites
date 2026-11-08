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
import {
  canonicalPath,
  getSiteFrame,
  type PageReference,
  singleLanguageClass,
  SITE_BRAND,
} from "@sebastian-websites/web-core"
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

/**
 * Whether the other language has the page, for the language switch. Pages
 * outside the blog and the blog overview exist in both (ADR-0010). A post
 * carries the counterpart that the build writes into its frontmatter, and a
 * tag archive gets it from the tag module's `frontmatter` export: the other
 * language's path, or null.
 * @param pathname - The page's path.
 * @param frontmatter - The page data Ardo exposes for the route, if any.
 * @returns The page reference for the frame.
 */
function framePage(
  pathname: string,
  frontmatter: Readonly<Record<string, unknown>> | undefined
): PageReference {
  const path = canonicalPath(pathname)
  return singleLanguageClass(path) === undefined
    ? path
    : { counterpart: typeof frontmatter?.counterpart === "string", path }
}

export default function App(): ReactElement {
  const page = useArdoPage()
  const notFound =
    (page.error != null && "status" in page.error && page.error.status === NOT_FOUND) ||
    isNotFoundHandle(page.handle)
  const frame = getSiteFrame(
    variant.site,
    variant.locale,
    notFound ? "/" : framePage(page.path, page.frontmatter)
  )
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
