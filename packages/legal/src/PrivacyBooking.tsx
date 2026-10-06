import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { LegalClassNames } from "./model"

export function PrivacyBooking({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="booking-terminaro">
      <h2 className={classes.sectionTitle}>
        <Trans>Appointment Booking via Terminaro</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          For online appointment booking, we use our own service Terminaro. Terminaro is operated by
          the same controller (Sebastian Software GmbH) – this therefore does not constitute a
          transfer of data to a third party within the meaning of Art. 4(10) GDPR, but rather an
          internal processing operation by the same controller.
        </Trans>
      </p>
      <p className={classes.text}>
        <Trans>
          When you schedule an appointment via the booking link, the data you enter (name, email
          address, company if applicable, phone number and booking reason) will be processed by
          Terminaro.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Legal Basis and Retention Period</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Processing is based on Art. 6(1)(b) GDPR for the initiation of a consulting engagement
          (pre-contractual measures). Booking data is automatically deleted 90 days after the
          appointment date. If a contractual relationship arises from the booking and tax or
          commercial law retention obligations apply (§ 257 HGB, § 147 AO), the relevant data will
          be retained for up to 10 years. Terminaro does not set any cookies on the public website
          and does not use tracking or web analytics.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Hosting and Sub-processors</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          User data is stored on servers of Hetzner Online GmbH in Germany. A data processing
          agreement pursuant to Art. 28 GDPR is in place with Hetzner. For the delivery of static
          content, Terminaro uses the CDN of Bunny.net (BunnyWay d.o.o., Slovenia), where data is
          processed exclusively transiently in working memory.
        </Trans>
      </p>
      <p className={classes.text}>
        <Trans>
          The information above covers all essential processing details regarding Terminaro. Since
          Terminaro is operated by the same controller, the data protection principles set out here
          apply equally. Additional technical details on data processing within Terminaro can be
          found in the{" "}
          <a
            className={classes.link}
            href="https://terminaro.eu/de/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terminaro privacy notice
          </a>
          , which specifies this policy for the booking service.
        </Trans>
      </p>
    </section>
  )
}
