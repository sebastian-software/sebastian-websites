import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { COMPANY } from "@sebastian-websites/legal"
import { blocks, button, layout, Section, SectionHead, typography } from "@sebastian-websites/ui"
import { getSiteOrigin } from "@sebastian-websites/web-core"

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
    <main>
      <Section>
        <SectionHead
          eyebrow={t`Contact`}
          intro={t`Write to us; one of the two founders answers. For products and partnerships an email is enough. If you are looking for project help, Sebastian Consulting is the right address, with the same two people.`}
          title={t`Let's talk about what is meant to last.`}
          titleAs="h1"
        />
        <div className={layout.columnsTwo}>
          <div className={blocks.column}>
            <h3 className={typography.h3}>{t`By email`}</h3>
            <p className={typography.textMuted}>
              {t`The general mailbox of the company. We answer within two working days.`}
            </p>
            <p className={blocks.columnLink}>
              <a className={button.primary} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <div className={blocks.column}>
            <h3 className={typography.h3}>{t`By post`}</h3>
            <address className={typography.textMuted} style={{ fontStyle: "normal" }}>
              {COMPANY.name}
              <br />
              {COMPANY.address.street}
              <br />
              {COMPANY.address.postalCode} {COMPANY.address.city}
              <br />
              {t`Germany`}
            </address>
          </div>
        </div>
      </Section>
      <Section tone="white">
        <SectionHead
          eyebrow={t`Project support`}
          intro={t`Architecture, delivery, and enablement for frontend teams: that is the job of Sebastian Consulting. Book a fifteen-minute intro call directly with one of the two founders.`}
          title={t`Looking for project help?`}
        />
        <p>
          <a className={button.secondary} href={`${consulting}/`}>
            {t`To Sebastian Consulting`}
          </a>
        </p>
      </Section>
    </main>
  )
}
