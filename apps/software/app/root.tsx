import type { ReactElement, ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { COMPANY } from "@sebastian-websites/legal"
import { BrandBar, FONT_STYLESHEET, SiteFooter } from "@sebastian-websites/ui"
import { createSeoLinks } from "@sebastian-websites/web-core"
import { Links, Meta, Outlet, Scripts, useLocation } from "react-router"
import "@sebastian-websites/ui/brand-software.css"

import { MainNav } from "~/components/MainNav"
import { variant } from "~/lib/site"

export function Layout({ children }: { readonly children: ReactNode }): ReactElement {
  const { pathname } = useLocation()
  const seoLinks = createSeoLinks(variant.site, variant.locale, pathname)

  return (
    <html lang={variant.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
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

  return (
    <>
      <BrandBar
        languageLabel={t`Language`}
        locale={variant.locale}
        path={pathname}
        site="software"
      />
      <MainNav />
      <Outlet />
      <SiteFooter
        legalEntity={`${COMPANY.name} · ${COMPANY.address.city}`}
        links={[
          { href: "/imprint", label: t`Legal Notice` },
          { href: "/privacy", label: t`Privacy` },
          { href: "https://github.com/sebastian-software", label: "GitHub" },
        ]}
        navigationLabel={t`Legal`}
      />
    </>
  )
}
