import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import {
  BunnyImage,
  editorial,
  frameImageSizes,
  Illustration,
  layout,
  Section,
} from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import missionRadio from "~/assets/illustrations/radio.image.mdx"
import { Closing } from "~/components/Closing"
import { Founders } from "~/components/Founders"
import { laptopPhoto } from "~/lib/photos"
import { seoMeta } from "~/lib/seo"
import { variant } from "~/lib/site"

import * as styles from "./company.css.ts"

const WIDE_IMAGE_WIDTH = 1040
const TEAM_IMAGE_HEIGHT = 693
const RADIO_HEIGHT = 520

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return seoMeta({
    description: t`Sebastian Software GmbH: founded in 2014 in Mainz by Sebastian Fastner and Sebastian Werner. Our mission, our team, and how we build.`,
    path: "/company",
    title: t`Company – Sebastian Software`,
  })
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
      <div className={styles.sectionHead}>
        <h2 className={editorial.featureHeading}>{t`What we stand for.`}</h2>
        <p className={editorial.bodySerif}>
          {t`Four themes have guided the company since 2014. They are written down here so that our partners and customers can hold us to them.`}
        </p>
      </div>
      <Illustration
        alt={t`A radio with its front panel removed, showing the speaker and wiring.`}
        className={styles.missionImage}
        height={RADIO_HEIGHT}
        sizes={frameImageSizes}
        src={missionRadio}
        width={WIDE_IMAGE_WIDTH}
      />
      <div className={layout.columnsTwo}>
        {themes.map((theme) => (
          <div className={editorial.prose} key={theme.title}>
            <h3 className={editorial.heading}>{theme.title}</h3>
            <p className={editorial.body}>{theme.text}</p>
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
      <section aria-labelledby="company-title" className={styles.companyIntro}>
        <BunnyImage
          alt={t`The two founders at the laptop`}
          className={styles.companyPhoto}
          crop={laptopPhoto.crop}
          height={TEAM_IMAGE_HEIGHT}
          priority
          sizes={frameImageSizes}
          src={laptopPhoto.src}
          width={WIDE_IMAGE_WIDTH}
        />
        <div className={styles.sectionHead}>
          <h1 className={editorial.featureHeading} id="company-title">
            {t`Two founders. Nothing in between.`}
          </h1>
          <div className={editorial.prose}>
            <p className={editorial.bodySerif}>
              {t`Sebastian Fastner and Sebastian Werner have run the company themselves since 2014. Both have worked in professional software development since the early 2000s, for a long time in large frontend projects for corporations, in between on frameworks that many others have used.`}
            </p>
            <p className={editorial.bodySerif}>
              {t`We have stayed small on purpose. No juniors, no layer in between, no handover to third parties: whoever works with us works with us. That holds for our products as much as for the project support we deliver as Sebastian Consulting. It is the way of working we have come to know as the most reliable in twenty years.`}
            </p>
            <p className={editorial.bodySerif}>
              {t`People who have worked with us tend to describe the same things: broad, current knowledge of web technologies; recommendations that are reasoned and traceable; a view of the whole system rather than only the framework; and the readiness to put a finger on the sore spot when a simpler path is possible. And that teams stand stronger after the collaboration, because knowledge, tools, and standards stay.`}
            </p>
            <p className={editorial.body}>
              {t`Sebastian Software GmbH is based in Mainz and registered at the local court of Mainz. The company has no investors and no plans for any: it is owned and run by the two founders.`}
            </p>
          </div>
        </div>
        <Founders profileOrigin={consulting} />
      </section>
      <Mission />
      <Closing />
    </main>
  )
}
