import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { LegalDocumentFrame } from "@sebastian-websites/legal"
import { legalClassNames as classes } from "@sebastian-websites/ui"

import { legalConfig, toolReportingPrivacyUrl } from "~/lib/legal"

import type { Route } from "./+types/privacy"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads page metadata.
export function meta(): Route.MetaDescriptors {
  return [{ title: t`Website privacy notice – app-tracking` }]
}

export default function Privacy(): ReactElement {
  const { operator } = legalConfig
  return (
    <main id="main">
      <LegalDocumentFrame
        classes={classes}
        review={legalConfig.privacyReview}
        title={t`Website privacy notice`}
      >
        <section className={classes.section}>
          <h2 className={classes.sectionTitle}>{t`Controller and contact`}</h2>
          <address className={classes.address}>
            {operator.name}
            <br />
            {operator.address.street}
            <br />
            {operator.address.postalCode} {operator.address.city}
            <br />
            {t`Germany`}
            <br />
            <a className={classes.link} href={`mailto:${legalConfig.privacyEmail}`}>
              {legalConfig.privacyEmail}
            </a>
          </address>
          <p className={classes.text}>
            {t`This notice concerns visits to this website. Usage reports from developer tools are a separate data flow, described in the reporting overview and the tool’s released privacy notice.`}{" "}
            <a className={classes.link} href="/#privacy">{t`Reporting data and controls`}</a>.
          </p>
          <p className={classes.text}>
            <a
              className={classes.link}
              href={toolReportingPrivacyUrl}
            >{t`Privacy notice for tool usage reports`}</a>
          </p>
        </section>
        <section className={classes.section}>
          <h2 className={classes.sectionTitle}>{t`Website delivery`}</h2>
          <p
            className={classes.text}
          >{t`Bunny hosts this static website. Our shared font and image assets are delivered through the company’s Bunny CDN. Requests process technical connection information, including IP address, requested URL, request time, and browser headers, to deliver and secure the website.`}</p>
          <p
            className={classes.text}
          >{t`The site adds no analytics service, cookies, browser storage, reporting identity, or usage-reporting SDK. Its navigation and language switch do not grant consent to tool reporting. There is no contact or newsletter form.`}</p>
          <p
            className={classes.text}
          >{t`Website delivery and security serve our legitimate interest in providing this information, under Article 6(1)(f) GDPR. Processing and subprocessors may involve international transfers. We do not claim EU-only processing or a universal retention maximum for provider-owned security records.`}</p>
          <p className={classes.text}>
            <a
              className={classes.link}
              href="https://bunny.net/gdpr/"
            >{t`Bunny processor and transfer information`}</a>
          </p>
        </section>
        <section className={classes.section}>
          <h2 className={classes.sectionTitle}>{t`Contact and privacy rights`}</h2>
          <p
            className={classes.text}
          >{t`If you contact us by email, we use the information you provide to answer your request. Please do not send reporting credentials or private repository URLs as proof of identity.`}</p>
          <p
            className={classes.text}
          >{t`You may contact us about access, correction, erasure, restriction, objection where applicable, and portability, or complain to a supervisory authority. Consent to tool reporting can be withdrawn in the tool. Deletion of received reports is a separate authenticated request.`}</p>
          <p
            className={classes.text}
          >{t`Links to Software, Consulting, source code, or provider information open the respective service. Their privacy notices govern the processing on those sites.`}</p>
        </section>
      </LegalDocumentFrame>
    </main>
  )
}
