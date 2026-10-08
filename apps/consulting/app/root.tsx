import type { ReactElement, ReactNode } from "react"

import {
  FaviconLinks,
  FONT_STYLESHEET,
  isNotFoundHandle,
  PageEnding,
  SiteHeader,
} from "@sebastian-websites/ui"
import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import { createSeoLinks, getSiteFrame, SITE_BRAND } from "@sebastian-websites/web-core"
import { Links, Meta, Outlet, Scripts, useLocation, useMatches } from "react-router"
import "@sebastian-websites/ui/brand-consulting.css"

import "~/styles/print-pages.css"
import "~/styles/print.css"
import { variant } from "~/lib/site"

/**
 * Whether the current page is the not-found route, which has no canonical
 * address and no counterpart in the other language.
 *
 * @returns True on the not-found page.
 */
function useNotFound(): boolean {
  return useMatches().some((match) => isNotFoundHandle(match.handle))
}

export function Layout({ children }: { readonly children: ReactNode }): ReactElement {
  const { pathname } = useLocation()
  const notFound = useNotFound()
  const seoLinks = notFound ? [] : createSeoLinks(variant.site, variant.locale, pathname)

  return (
    <html lang={variant.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <FaviconLinks brand={SITE_BRAND[variant.site]} />
        <link crossOrigin="anonymous" href={FONT_STYLESHEET} rel="stylesheet" />
        <Meta />
        {seoLinks.map((link) => (
          <link
            href={link.href}
            hrefLang={link.hrefLang}
            key={link.href + (link.hrefLang ?? "")}
            rel={link.rel}
          />
        ))}
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function App(): ReactElement {
  const { pathname } = useLocation()
  const notFound = useNotFound()
  // The language switch of the not-found page leads to the other home page.
  const frame = getSiteFrame(variant.site, variant.locale, notFound ? "/" : pathname)
  const copy = createFrameCopy(__BUILD_YEAR__)

  return (
    <>
      <SiteHeader copy={copy} frame={frame} />
      <Outlet />
      <PageEnding copy={copy} frame={frame} />
    </>
  )
}
