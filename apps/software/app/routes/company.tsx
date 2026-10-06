import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import * as page from "~/components/Page.css"
import { variant } from "~/lib/site"

import type { Route } from "./+types/company"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Company – Sebastian Software` },
    {
      content: t`Sebastian Software GmbH: founded in 2014 in Mainz by Sebastian Fastner and Sebastian Werner. Our mission, our team, and how we build.`,
      name: "description",
    },
  ]
}

export default function Company(): ReactElement {
  const consulting = getSiteOrigin("consulting", variant.locale)
  return (
    <main className={page.main}>
      <h1 className={page.title}>
        <Trans>The company</Trans>
      </h1>
      <p className={page.lead}>
        <Trans>
          Sebastian Software GmbH was founded in 2014 by Sebastian Fastner and Sebastian Werner in
          Mainz. We are two engineers who build products, publish open-source tools, and help teams
          through Sebastian Consulting.
        </Trans>
      </p>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Software that lasts and inspires</Trans>
        </h2>
        <p>
          <Trans>
            We develop software that remains relevant not just today but also tomorrow. Quality and
            longevity are our top priorities. We use the latest technologies to create solutions
            that really make a difference. With our in-depth expertise, we combine ideas and create
            sustainable success. Our curiosity and passion drive us to keep getting better.
          </Trans>
        </p>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Technology that wins hearts and minds</Trans>
        </h2>
        <p>
          <Trans>
            We bring together experts from product management, design and development. The result?
            Products that not only work, but also inspire. Our clear architecture ensures
            sustainable experiences that inspire confidence. Our work is not only reliable – it
            leaves a lasting impression. Our customers notice this, and it makes us proud.
          </Trans>
        </p>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Knowledge is the key to real progress</Trans>
        </h2>
        <p>
          <Trans>
            Further training is our foundation. We invest in ourselves to keep our finger on the
            pulse. We actively exchange ideas at specialist conferences and developer meetings. This
            enables us to identify trends and make well-informed decisions. Not every innovation is
            right for us – we consciously select what really offers added value.
          </Trans>
        </p>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>Collaboration for outstanding results</Trans>
        </h2>
        <p>
          <Trans>
            Collaboration is at the heart of what we do. We share our knowledge and empower our
            partners' teams to achieve great things together. Our solutions are more than just
            technology – they improve product quality and increase user satisfaction. This creates a
            win-win situation for everyone.
          </Trans>
        </p>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>The team</Trans>
        </h2>
        <p>
          <strong>Sebastian Fastner</strong>
          {" – "}
          <Trans>
            Computer science as the foundation, classic and modern web technology firmly in hand, a
            command-line enthusiast with a focus on security and cloud solutions.
          </Trans>{" "}
          <a className={page.link} href={`${consulting}/fastner`}>
            <Trans>Profile</Trans>
          </a>
        </p>
        <p>
          <strong>Sebastian Werner</strong>
          {" – "}
          <Trans>
            More than twenty years of web technology, clear design and clever interfaces, UI
            frameworks, and open source since leading qooxdoo.
          </Trans>{" "}
          <a className={page.link} href={`${consulting}/werner`}>
            <Trans>Profile</Trans>
          </a>
        </p>
      </section>
      <section className={page.section}>
        <h2 className={page.heading}>
          <Trans>How we build</Trans>
        </h2>
        <p>
          <Trans>
            Small teams, clear architecture, and quality and longevity before speed. We publish the
            tools we work with, so anyone can check how we build.
          </Trans>
        </p>
      </section>
    </main>
  )
}
