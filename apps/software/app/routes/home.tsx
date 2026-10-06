import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button, layout, Section, SectionHead, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"
import { Link } from "react-router"

import laptop from "~/assets/photos/shoot-19.jpg"
import wall from "~/assets/photos/shoot-39.jpg"
import { Closing } from "~/components/Closing"
import { Families } from "~/components/Families"
import { Founders } from "~/components/Founders"
import { LogoBand } from "~/components/LogoBand"
import { MetricsBand } from "~/components/MetricsBand"
import { Photo } from "~/components/Photo"
import { ProductCards } from "~/components/ProductCards"
import { formatCount, loadMetrics } from "~/lib/metrics"
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

// eslint-disable-next-line react-refresh/only-export-components -- React Router runs the loader at build time
export async function loader(): Promise<{ metrics: Awaited<ReturnType<typeof loadMetrics>> }> {
  return { metrics: await loadMetrics() }
}

function Hero({ repositories }: { readonly repositories: number }): ReactElement {
  return (
    <section className={blocks.hero}>
      <div className={`${layout.container} ${blocks.heroGrid}`}>
        <div>
          <h1 className={typography.display}>
            {t`Experience.`}
            <br />
            {t`Clarity.`}
            <br />
            <em className={typography.displayAccent}>{t`Enthusiasm.`}</em>
          </h1>
          <p className={`${typography.lead} ${blocks.heroLead}`}>
            {t`Sebastian Software is a small software company from Mainz. We build products that are meant to last and share the tools behind them as open source.`}
          </p>
          <p className={`${typography.text} ${blocks.heroMore}`}>
            {t`Founded in 2014 by Sebastian Fastner and Sebastian Werner after many years in large frontend projects and in the open-source world. Three things come out of our work today: our own products such as Terminaro and Palamedes, a family of open tools in Rust and TypeScript, and, as Sebastian Consulting, project support for teams that want their frontend architecture to carry.`}
          </p>
          <div className={layout.ctas}>
            <Link className={button.primary} to="/products">
              {t`Discover the products`}
            </Link>
            <Link className={button.secondary} to="/company">
              {t`The company`}
            </Link>
          </div>
          <dl className={blocks.facts}>
            <div>
              <dd className={blocks.factValue}>{t`Since 2014`}</dd>
              <dt className={blocks.factLabel}>{t`owner-led, Mainz`}</dt>
            </div>
            <div>
              <dd className={blocks.factValue}>{formatCount(repositories, variant.locale)}</dd>
              <dt className={blocks.factLabel}>{t`open-source projects, counted live`}</dt>
            </div>
            <div>
              <dd className={blocks.factValue}>{t`Two founders`}</dd>
              <dt className={blocks.factLabel}>{t`nothing in between`}</dt>
            </div>
          </dl>
        </div>
        <Photo
          alt={t`Sebastian Fastner and Sebastian Werner`}
          caption="Sebastian Fastner & Sebastian Werner"
          focus="center 72%"
          frame="square"
          priority
          src={wall}
        />
      </div>
    </section>
  )
}

function Stance(): ReactElement {
  const columns = [
    {
      text: t`Good architecture shows in how easy the next change is. So we choose the proven building block over the loud one, and we write down why. Software we build today should still be understandable in five years, for us and for those who work on it after us.`,
      title: t`Longevity before pace`,
    },
    {
      text: t`We quote no numbers we do not measure live and no references that cannot be checked. Our tools are open on GitHub, their use is counted every hour, and our products run in our own daily work before anyone else gets them.`,
      title: t`Proof instead of claims`,
    },
    {
      text: t`Two founders, no layer in between. Whoever works with us talks to the people who decide and build. That keeps paths short, decisions reasoned, and quality where it is made: in the code, not on slides.`,
      title: t`Small, personal, accountable`,
    },
  ]
  return (
    <Section>
      <SectionHead
        eyebrow={t`Our stance`}
        intro={t`In twenty years we have seen many technology waves come and go. What stayed was rarely the loudest, but what was well built, clearly documented, and honestly tested. That is how we direct our products, our open-source work, and our consulting.`}
        title={t`Software that lasts. Tools you can inspect.`}
      />
      <div className={layout.columns}>
        {columns.map((column, index) => (
          <div className={blocks.column} key={column.title}>
            <span className={blocks.columnNumber}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={typography.h3}>{column.title}</h3>
            <p className={typography.textMuted}>{column.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Products(): ReactElement {
  return (
    <Section tone="white">
      <SectionHead
        eyebrow={t`Products`}
        intro={t`Each of our products grew out of a gap we saw ourselves, and we use them in our own work wherever they fit. That is our standard: we would not sell anything we would not want to use ourselves. The products have their own sites with every detail; this is what they are for.`}
        title={t`We build what we need ourselves.`}
      />
      <ProductCards />
    </Section>
  )
}

function Company(): ReactElement {
  return (
    <Section tone="white">
      <SectionHead
        eyebrow={t`Company`}
        intro={t`Sebastian Fastner and Sebastian Werner have run the company themselves since 2014. Both have worked in professional software development since the early 2000s, for a long time in large frontend projects for corporations, in between on frameworks that many others have used.`}
        title={t`Two founders. Nothing in between.`}
      />
      <div className={layout.split}>
        <div className={typography.prose}>
          <p className={typography.text}>
            {t`We have stayed small on purpose. No juniors, no layer in between, no handover to third parties: whoever works with us works with us. That holds for our products as much as for the project support we deliver as Sebastian Consulting. It is the way of working we have come to know as the most reliable in twenty years.`}
          </p>
          <p className={typography.text}>
            {t`People who have worked with us tend to describe the same things: broad, current knowledge of web technologies; recommendations that are reasoned and traceable; a view of the whole system rather than only the framework; and the readiness to put a finger on the sore spot when a simpler path is possible. And that teams stand stronger after the collaboration, because knowledge, tools, and standards stay.`}
          </p>
          <p className={typography.textMuted}>
            {t`Learning is our foundation. We read, try, and measure before we recommend, and we choose deliberately what really adds value. Not every novelty suits us, not even in AI.`}
          </p>
        </div>
        <Photo
          alt={t`The two founders at the laptop`}
          focus="center 62%"
          frame="landscape"
          src={laptop}
        />
      </div>
      <Founders />
    </Section>
  )
}

function ProjectSupport(): ReactElement {
  const consulting = getSiteOrigin("consulting", variant.locale)
  const rows = [
    {
      text: t`Bringing interfaces and user-generated content into many languages without slowing the product down and without translations taking weeks. Palamedes grew out of this, and Palamedes+ will.`,
      title: t`Internationalizing large codebases`,
    },
    {
      text: t`Foundations on which several teams deliver in parallel, with conventions that prevail because they make everyday work easier. The Effective libraries are the tools we kept needing along the way.`,
      title: t`Monorepos and design systems`,
    },
    {
      text: t`Target picture, decision, migration path: reasoned, documented, and implemented together. Also for systems that have run for ten years and should run for ten more.`,
      title: t`Architecture reviews and modernization`,
    },
  ]
  return (
    <Section>
      <SectionHead
        eyebrow={t`Project support`}
        intro={t`Project support runs under Sebastian Consulting, with the same two people. Three kinds of work have recurred for years, and each has also produced something for our products and tools.`}
        title={t`What teams call us for.`}
      />
      <div className={blocks.lines}>
        {rows.map((row) => (
          <div className={blocks.lineRow} key={row.title}>
            <p className={blocks.lineTitle}>{row.title}</p>
            <p className={blocks.lineText}>{row.text}</p>
          </div>
        ))}
      </div>
      <p className={blocks.linesFoot}>
        <a className={button.ghost} href={`${consulting}/`}>
          {t`Services and profiles at Sebastian Consulting →`}
        </a>
      </p>
    </Section>
  )
}

export default function Home({ loaderData }: Route.ComponentProps): ReactElement {
  return (
    <main>
      <Hero repositories={loaderData.metrics.repositories} />
      <LogoBand />
      <Stance />
      <Products />
      <MetricsBand
        intro={t`Open source shaped our careers: qooxdoo at 1&1, Unify at Deutsche Telekom, Jasy at Zynga. What we build for our products today we share again, as families of open tools whose numbers stand here live. Every library, engine, and skill is on GitHub, with tests, benchmarks, and decisions.`}
        metrics={loaderData.metrics}
        title={t`Giving back, with tools you can inspect.`}
      />
      <Section follow>
        <Families />
      </Section>
      <Company />
      <ProjectSupport />
      <Closing />
    </main>
  )
}
