import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, button, layout, Section, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

import building from "~/assets/photos/shoot-26.jpg"
import { CONTACT_EMAIL } from "~/lib/legal"
import { variant } from "~/lib/site"

import { Photo } from "./Photo"

/**
 * The closing call of every content page: headline, lead, the two actions, and the
 * building photo.
 *
 * @returns The closing section.
 */
export function Closing(): ReactElement {
  const consulting = getSiteOrigin("consulting", variant.locale)
  return (
    <Section tone="white">
      <div className={blocks.finalGrid}>
        <div>
          <p className={layout.eyebrow}>{t`Contact`}</p>
          <h2 className={typography.h2Large}>{t`Let's talk about what is meant to last.`}</h2>
          <p className={`${typography.lead} ${blocks.finalLead}`}>
            {t`For products and partnerships, an email is enough. Project support is at Sebastian Consulting, directly with the two founders.`}
          </p>
          <div className={layout.ctas}>
            <a className={button.primary} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <a className={button.secondary} href={`${consulting}/`}>
              {t`To Sebastian Consulting`}
            </a>
          </div>
        </div>
        <Photo
          alt={t`The two founders in front of the building`}
          focus="center 76%"
          frame="landscape"
          src={building}
        />
      </div>
    </Section>
  )
}
