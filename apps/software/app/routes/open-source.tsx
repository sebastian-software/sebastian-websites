import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import * as page from "~/components/Page.css"
import { variant } from "~/lib/site"

import type { Route } from "./+types/open-source"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Open source – Sebastian Software` },
    {
      content: t`The Ferramenta family of Rust engines, the Effective libraries and skills, and the tools Sebastian Software uses itself.`,
      name: "description",
    },
  ]
}

export default function OpenSource(): ReactElement {
  const openSource = getSiteOrigin("opensource", variant.locale)
  const skills = getSiteOrigin("skills", variant.locale)
  return (
    <main className={page.main}>
      <h1 className={page.title}>
        <Trans>Open source</Trans>
      </h1>
      <p className={page.lead}>
        <Trans>
          Open source shaped our careers. We give back with tools whose claims can be checked in
          their code, tests, and documentation.
        </Trans>
      </p>
      <section className={page.section}>
        <h2 className={page.heading}>Ferramenta</h2>
        <p>
          <Trans>
            A family of Rust-native engines and applications: regular expressions, syntax
            highlighting, Markdown, spell checking, translation catalogs, file walking, and PDF
            previews, plus Palamedes, Dalo, and Ardo built on them.
          </Trans>
        </p>
        <a className={page.link} href="https://ferramenta.dev">
          <Trans>Visit ferramenta.dev</Trans>
        </a>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>Effective</h2>
        <p>
          <Trans>
            Libraries and agent skills for everyday web work: a compile-time icon pipeline,
            engineering workflows for coding agents, and six skills covering product, web,
            engineering, delivery, marketing, and writing.
          </Trans>
        </p>
        <a className={page.link} href={`${skills}/`}>
          <Trans>Browse the skills</Trans>
        </a>
      </section>
      <section className={page.section}>
        <a className={page.link} href={`${openSource}/`}>
          <Trans>All projects on our Open Source site</Trans>
        </a>
      </section>
    </main>
  )
}
