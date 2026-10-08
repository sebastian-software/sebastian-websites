import type { ReactElement, ReactNode } from "react"

import { FaviconLinks, FONT_STYLESHEET, PageEnding, SiteHeader } from "@sebastian-websites/ui"
import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import { createSeoLinks, getSiteFrame } from "@sebastian-websites/web-core"
import { Links, Meta, Outlet, Scripts, useLocation } from "react-router"
import "@sebastian-websites/ui/brand-consulting.css"

import "~/styles/print-pages.css"
import "~/styles/print.css"
import { variant } from "~/lib/site"

export function Layout({ children }: { readonly children: ReactNode }): ReactElement {
  const { pathname } = useLocation()
  const seoLinks = createSeoLinks(variant.site, variant.locale, pathname)

  return (
    <html lang={variant.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <FaviconLinks />
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
  const frame = getSiteFrame(variant.site, variant.locale, pathname)
  const copy = createFrameCopy(__BUILD_YEAR__)

  return (
    <>
      <SiteHeader copy={copy} frame={frame} />
      <Outlet />
      <PageEnding copy={copy} frame={frame} />
    </>
  )
}
