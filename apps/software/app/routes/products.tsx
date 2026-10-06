import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"

import * as page from "~/components/Page.css"

import type { Route } from "./+types/products"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Products – Sebastian Software` },
    {
      content: t`Terminaro for appointment booking, Palamedes+ for managed translations: the products of Sebastian Software.`,
      name: "description",
    },
  ]
}

export default function Products(): ReactElement {
  return (
    <main className={page.main}>
      <h1 className={page.title}>
        <Trans>Products</Trans>
      </h1>
      <p className={page.lead}>
        <Trans>We build products we use ourselves, and we keep them deliberately small.</Trans>
      </p>
      <section className={page.section}>
        <h2 className={page.heading}>Terminaro</h2>
        <p>
          <Trans>
            Appointment booking for small businesses. Connect your calendar, define your
            availability, and let customers book in seconds, without an account and without the
            complexity of large scheduling suites. Set up in minutes.
          </Trans>
        </p>
        <a className={page.link} href="https://terminaro.eu">
          <Trans>Visit terminaro.eu</Trans>
        </a>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          Palamedes+
          <span className={page.badge}>
            <Trans>Coming soon</Trans>
          </span>
        </h2>
        <p>
          <Trans>Ship translations, not tickets.</Trans>
        </p>
        <p>
          <Trans>
            The managed translation layer on top of Palamedes, our open-source i18n toolchain:
            translation runs with provider and model control, quality checks, and review workflows
            for teams that keep their catalogs in the repository.
          </Trans>
        </p>
        <a className={page.link} href="https://palamedes.dev">
          <Trans>Palamedes, the open core</Trans>
        </a>
      </section>
      <section className={page.section}>
        <p>
          <Trans>A third product is in preparation and will be announced here.</Trans>
        </p>
      </section>
    </main>
  )
}
