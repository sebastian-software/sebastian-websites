import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { COMPANY } from "@sebastian-websites/legal"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import * as page from "~/components/Page.css"
import { CONTACT_EMAIL } from "~/lib/legal"
import { variant } from "~/lib/site"

import type { Route } from "./+types/contact"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Contact – Sebastian Software` },
    { content: t`How to reach Sebastian Software GmbH in Mainz.`, name: "description" },
  ]
}

export default function Contact(): ReactElement {
  const consulting = getSiteOrigin("consulting", variant.locale)
  return (
    <main className={page.main}>
      <h1 className={page.title}>
        <Trans>Contact</Trans>
      </h1>
      <p className={page.lead}>
        <Trans>Write to us; one of the two founders answers.</Trans>
      </p>
      <p>
        <a className={page.link} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
      <address className={page.address}>
        {COMPANY.name}
        <br />
        {COMPANY.address.street}
        <br />
        {COMPANY.address.postalCode} {COMPANY.address.city}
        <br />
        <Trans>Germany</Trans>
      </address>
      <section className={page.section}>
        <p>
          <Trans>Looking for project help? That is the job of Sebastian Consulting.</Trans>{" "}
          <a className={page.link} href={`${consulting}/`}>
            <Trans>To Sebastian Consulting</Trans>
          </a>
        </p>
      </section>
    </main>
  )
}
