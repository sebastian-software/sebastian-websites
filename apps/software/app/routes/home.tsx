import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { getSiteOrigin } from "@sebastian-websites/web-core"
import { Link } from "react-router"

import * as page from "~/components/Page.css"
import { variant } from "~/lib/site"

import type { Route } from "./+types/home"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Sebastian Software` },
    {
      content: t`Sebastian Software builds products that are meant to last and shares the tools behind them as open source.`,
      name: "description",
    },
  ]
}

export default function Home(): ReactElement {
  const openSource = getSiteOrigin("opensource", variant.locale)
  return (
    <main className={page.main}>
      <h1 className={page.title}>
        <Trans>Experience. Clarity. Enthusiasm.</Trans>
      </h1>
      <p className={page.lead}>
        <Trans>
          Sebastian Software is a small German software company. We build products that are meant to
          last and share the tools behind them as open source.
        </Trans>
      </p>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Products</Trans>
        </h2>
        <p>
          <Trans>
            Terminaro keeps appointment booking simple for small businesses. Palamedes+ will bring
            managed translations to teams that already use Palamedes.
          </Trans>
        </p>
        <Link className={page.link} to="/products">
          <Trans>Discover our products</Trans>
        </Link>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Open source</Trans>
        </h2>
        <p>
          <Trans>
            Open source shaped our careers, and we give back: the Ferramenta family of Rust engines,
            the Effective libraries and skills, and the tools we use ourselves.
          </Trans>
        </p>
        <a className={page.link} href={`${openSource}/`}>
          <Trans>Explore our open source</Trans>
        </a>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Company</Trans>
        </h2>
        <p>
          <Trans>
            Two founders, one company since 2014, and a way of working that puts quality and
            longevity first.
          </Trans>
        </p>
        <Link className={page.link} to="/company">
          <Trans>About the company</Trans>
        </Link>
      </section>
    </main>
  )
}
