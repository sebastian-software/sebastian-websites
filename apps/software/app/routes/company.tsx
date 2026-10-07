import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, layout, Section, SectionHead, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import { Closing } from "~/components/Closing"
import { Founders } from "~/components/Founders"
import { Photo } from "~/components/Photo"
import { laptopPhoto } from "~/lib/photos"
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

function Mission(): ReactElement {
  const themes = [
    {
      text: t`We develop software that remains relevant not just today but also tomorrow. Quality and longevity come first. We use current technology to create solutions that make a difference, and our curiosity drives us to keep getting better.`,
      title: t`Software that lasts and inspires`,
    },
    {
      text: t`We bring product thinking, design, and engineering together. The result is software that not only works but convinces, with a clear architecture that earns trust and leaves a lasting impression on the people who use it.`,
      title: t`Technology that wins hearts and minds`,
    },
    {
      text: t`Learning is our foundation. We read, try, and measure, and we exchange ideas at conferences and developer meetings. Not every innovation is right for us; we deliberately select what offers real value.`,
      title: t`Knowledge is the key to real progress`,
    },
    {
      text: t`Collaboration is at the heart of what we do. We share our knowledge and strengthen our partners' teams so that they achieve more together, long after a project has ended.`,
      title: t`Collaboration for outstanding results`,
    },
  ]
  return (
    <Section>
      <SectionHead
        eyebrow={t`Mission`}
        intro={t`Four themes have guided the company since 2014. They are written down here so that our partners and customers can hold us to them.`}
        title={t`What we stand for.`}
      />
      <div className={layout.columnsTwo}>
        {themes.map((theme) => (
          <div className={blocks.column} key={theme.title}>
            <h3 className={typography.h3}>{theme.title}</h3>
            <p className={typography.textMuted}>{theme.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default function Company(): ReactElement {
  const consulting = getSiteOrigin("consulting", variant.locale)
  return (
    <main id="main">
      <Section tone="white">
        <SectionHead
          eyebrow={t`Company`}
          intro={t`Sebastian Fastner and Sebastian Werner have run the company themselves since 2014. Both have worked in professional software development since the early 2000s, for a long time in large frontend projects for corporations, in between on frameworks that many others have used.`}
          title={t`Two founders. Nothing in between.`}
          titleAs="h1"
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
              {t`Sebastian Software GmbH is based in Mainz and registered at the local court of Mainz. The company has no investors and no plans for any: it is owned and run by the two founders.`}
            </p>
          </div>
          <Photo alt={t`The two founders at the laptop`} frame="landscape" image={laptopPhoto} />
        </div>
        <Founders profileOrigin={consulting} />
      </Section>
      <Mission />
      <Closing />
    </main>
  )
}
