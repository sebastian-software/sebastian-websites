import type { ComponentType, ReactElement, ReactNode } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import {
  FaviconLinks,
  FONT_STYLESHEET,
  isNotFoundHandle,
  NotFound,
  PageEnding,
  PageError,
  SiteFooter,
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
  type VariantDefinition,
} from "@sebastian-websites/web-core"
import { ArdoHead, ArdoOutlet, ArdoScripts, useArdoPage } from "ardo/runtime"

const NOT_FOUND = 404
type SiteRoot = {
  readonly App: ComponentType
  readonly ErrorBoundary: ComponentType
  readonly Layout: ComponentType<{ readonly children: ReactNode }>
  readonly meta: () => ArdoMetaDescriptor[]
}

/**
 * The shared branded shell; routes keep their own content and print layouts.
 * @param root0 - The selected website settings.
 * @param root0.variant - The selected domain and language.
 * @param root0.year - The build copyright year.
 * @param root0.ending - The full invitation/newsletter ending or minimal footer.
 * @param root0.pageReference - Optional site-specific language-counterpart resolution.
 * @returns The shared Ardo root exports.
 */
export function createSiteRoot({
  ending = "full",
  pageReference,
  variant,
  year,
}: {
  readonly ending?: "footer" | "full"
  readonly pageReference?: (
    path: string,
    frontmatter: Readonly<Record<string, unknown>> | undefined
  ) => PageReference
  readonly variant: VariantDefinition
  readonly year: number
}): SiteRoot {
  const brand = SITE_BRAND[variant.site]
  function Layout({ children }: { readonly children: ReactNode }): ReactElement {
    return (
      <html data-palamedes-time-zone="Europe/Berlin" lang={variant.locale}>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {ending === "footer" ? (
            <>
              <meta content="only light" name="color-scheme" />
              <meta content="no-referrer" name="referrer" />
            </>
          ) : null}
          <FaviconLinks brand={brand} />
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
  function App(): ReactElement {
    const page = useArdoPage()
    const notFound =
      (page.error != null && "status" in page.error && page.error.status === NOT_FOUND) ||
      isNotFoundHandle(page.handle)
    const path = canonicalPath(page.path)
    const reference =
      pageReference?.(path, page.frontmatter) ??
      (singleLanguageClass(path) === undefined
        ? path
        : { counterpart: typeof page.frontmatter?.counterpart === "string", path })
    const frame = getSiteFrame(variant.site, variant.locale, notFound ? "/" : reference)
    const copy = createFrameCopy(year)
    return (
      <>
        <SiteHeader copy={copy} frame={frame} />
        <ArdoOutlet />
        {ending === "footer" ? (
          <SiteFooter copy={copy} frame={frame} />
        ) : (
          <PageEnding copy={copy} frame={frame} />
        )}
      </>
    )
  }
  function ErrorBoundary(): ReactElement {
    const page = useArdoPage()
    return page.error != null && "status" in page.error && page.error.status === NOT_FOUND ? (
      <NotFound
        copy={createFrameCopy(year)}
        frame={getSiteFrame(variant.site, variant.locale, "/")}
      />
    ) : (
      <PageError copy={createPageErrorCopy()} />
    )
  }
  function meta(): ArdoMetaDescriptor[] {
    const copy = createFrameCopy(year)
    return [
      { title: `${copy.notFound.pageTitle} – ${copy.brandNames[brand]}` },
      { content: "noindex", name: "robots" },
    ]
  }
  return { App, ErrorBoundary, Layout, meta }
}
