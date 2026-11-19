import type { ReactElement } from "ardo/react"

import { t } from "@palamedes/core/macro"
import { blocks, button, editorial, layout, Section } from "@sebastian-websites/ui"

import { CONTACT_EMAIL } from "~/lib/legal"
import { buildingPhoto } from "~/lib/photos"

import { Photo } from "./Photo"

/**
 * The closing call of every content page: headline, lead, the contact action,
 * and the building photo. The page ending introduces Sebastian Consulting.
 *
 * @returns The closing section.
 */
export function Closing(): ReactElement {
  return (
    <Section tone="white">
      <div className={blocks.finalGrid}>
        <div>
          <h2 className={editorial.featureHeading}>{t`Let's talk about what is meant to last.`}</h2>
          <p className={`${editorial.lead} ${blocks.finalLead}`}>
            {t`For products and partnerships, an email is enough. Project support is at Sebastian Consulting, directly with the two founders.`}
          </p>
          <div className={layout.ctas}>
            <a className={button.primary} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <Photo
          alt={t`The two founders in front of the building`}
          frame="landscape"
          image={buildingPhoto}
        />
      </div>
    </Section>
  )
}
