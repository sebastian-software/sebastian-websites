import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button, layout, Section, SectionHead, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import { Closing } from "~/components/Closing"
import { Families } from "~/components/Families"
import { MetricsBand } from "~/components/MetricsBand"
import { loadMetrics } from "~/lib/metrics"
import { variant } from "~/lib/site"

import type { Route } from "./+types/open-source"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Open source – Sebastian Software` },
    {
      content: t`The Ferramenta family of Rust engines, the Effective libraries and skills, and the live numbers behind them.`,
      name: "description",
    },
  ]
}

// eslint-disable-next-line react-refresh/only-export-components -- React Router runs the loader at build time
export async function loader(): Promise<{ metrics: Awaited<ReturnType<typeof loadMetrics>> }> {
  return { metrics: await loadMetrics() }
}

export default function OpenSource({ loaderData }: Route.ComponentProps): ReactElement {
  const openSource = getSiteOrigin("opensource", variant.locale)
  const reasons = [
    {
      text: t`Our careers began in open source: qooxdoo at 1&1, Unify at Deutsche Telekom, Jasy at Zynga. The tools and the people around them taught us most of what we know. Publishing what we build today is how we return the favor.`,
      title: t`Gratitude`,
    },
    {
      text: t`An open tool can be read, benchmarked, and corrected by anyone. That keeps us honest about quality and keeps our products on foundations that outlast any single vendor, including us.`,
      title: t`Trust through inspection`,
    },
    {
      text: t`Open standards over proprietary formats: Markdown, gettext catalogs, plain files in a repository. Whatever we build should leave your data in a form you can take elsewhere.`,
      title: t`Open standards`,
    },
  ]
  return (
    <main id="main">
      <Section>
        <SectionHead
          eyebrow={t`Open source`}
          intro={t`What we build for our products, we share again: a family of Rust engines and applications, a family of TypeScript libraries, and skills for coding agents. The full catalogue with every project lives on the Open Source site; this page explains why we do it and what belongs together.`}
          title={t`Giving back, with tools you can inspect.`}
          titleAs="h1"
        />
        <Families />
      </Section>
      <MetricsBand
        intro={t`Every number here is live from the metrics service, refreshed hourly from GitHub, npm, and crates.io, and republished with every build. We do not maintain figures by hand.`}
        metrics={loaderData.metrics}
        title={t`Counted, not claimed.`}
      />
      <Section tone="white">
        <SectionHead
          eyebrow={t`Why`}
          intro={t`Three reasons we keep publishing, even when a tool would be easier to keep to ourselves.`}
          title={t`Open source shaped our careers. We give back.`}
        />
        <div className={layout.columns}>
          {reasons.map((reason) => (
            <div className={blocks.column} key={reason.title}>
              <h3 className={typography.h3}>{reason.title}</h3>
              <p className={typography.textMuted}>{reason.text}</p>
            </div>
          ))}
        </div>
        <p className={blocks.linesFoot}>
          <a className={button.ghost} href={`${openSource}/`}>
            {t`All projects on the Open Source site →`}
          </a>
        </p>
      </Section>
      <Closing />
    </main>
  )
}
