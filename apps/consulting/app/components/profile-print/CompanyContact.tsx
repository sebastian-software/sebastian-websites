import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"
import { contactEmail } from "@sebastian-websites/web-core"

import { consultingTheme } from "~/lib/brand"
import { appBuildDate, appBuildYear } from "~/lib/buildInfo"
import {
  COMPANY_ADDRESS,
  COMPANY_BRAND,
  COMPANY_LEGAL,
  COMPANY_NAME,
  COMPANY_WEBSITE,
  COMPANY_WEBSITE_DISPLAY,
} from "~/lib/untranslated"

import * as styles from "../ProfilePrintV2.css"

export function CompanyContact({ lang }: { lang: "de" | "en" }): ReactNode {
  const email = contactEmail("consulting", lang)
  return (
    <section className={styles.companyContact} data-profile-final-section>
      <img
        alt={COMPANY_BRAND}
        className={styles.companyContactLogo}
        src={consultingTheme.assets.logo.transparent}
      />
      <div className={styles.companyContactDetails}>
        <p className={styles.companyContactName}>{COMPANY_NAME}</p>
        <p className={styles.companyContactAddress}>
          {COMPANY_ADDRESS.street}
          <br />
          {COMPANY_ADDRESS.zip} {COMPANY_ADDRESS.city}
        </p>
        <p className={styles.companyContactInfo}>
          {COMPANY_LEGAL.court}
          <br />
          {COMPANY_LEGAL.vatId}
        </p>
        <p className={styles.companyContactLinks}>
          <a className={styles.link} href={`mailto:${email}`}>
            {email}
          </a>
          <br />
          <a className={styles.link} href={COMPANY_WEBSITE}>
            {COMPANY_WEBSITE_DISPLAY}
          </a>
        </p>
        <p className={styles.companyContactCopyright} data-profile-final-text="permission">
          <Trans>
            This profile may be shared, used, and stored for project inquiries and proposals.
          </Trans>
        </p>
        <p className={styles.companyContactCopyright} data-profile-final-text="last-updated">
          <Trans>As of:</Trans>{" "}
          {new Intl.DateTimeFormat(lang, {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
            year: "numeric",
          }).format(appBuildDate)}
        </p>
        <p className={styles.companyContactCopyright} data-profile-final-text="copyright">
          © 2014–{appBuildYear} {COMPANY_NAME}
        </p>
      </div>
    </section>
  )
}
