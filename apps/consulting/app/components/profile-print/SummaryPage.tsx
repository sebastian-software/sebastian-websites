import type { ReactNode } from "react"

import { Plural, Trans } from "@palamedes/react/macro"
import { BunnyImage } from "@sebastian-websites/ui"

import { consultingTheme } from "~/lib/brand"
import { SHEET_PHOTO } from "~/lib/photos"
import { COMPANY_BRAND } from "~/lib/untranslated"

import type { Consultant } from "./types"

import { ContactIcon, type ContactIconName } from "./ContactIcon"
import * as editorial from "./editorial.css"
import { formatList } from "./helpers"
import * as styles from "./summary.css"

function ContactItem({
  children,
  icon,
  label,
}: {
  children: ReactNode
  icon: ContactIconName
  label: ReactNode
}): ReactNode {
  return (
    <div className={styles.contactItem}>
      <dt>
        <ContactIcon className={styles.contactIcon} name={icon} />
        <span className={editorial.visuallyHidden}>{label}</span>
      </dt>
      <dd className={styles.contactValue}>{children}</dd>
    </div>
  )
}

function PersonalDetails({
  consultant,
  lang,
}: {
  consultant: Consultant
  lang: "de" | "en"
}): ReactNode {
  return (
    <section aria-labelledby="profile-details">
      <h2 className={styles.summaryHeading} id="profile-details">
        <Trans>Personal Details</Trans>
      </h2>
      <dl className={styles.contactList}>
        <ContactItem icon="location" label={<Trans>Location</Trans>}>
          {consultant.location}
        </ContactItem>
        <ContactItem icon="languages" label={<Trans>Languages</Trans>}>
          {formatList(consultant.languages, lang)}
        </ContactItem>
        {consultant.workPreferences === undefined ? null : (
          <ContactItem icon="workModel" label={<Trans>Work Model</Trans>}>
            {consultant.workPreferences.preferredRegion}
          </ContactItem>
        )}
        <ContactItem icon="email" label={<Trans>Contact</Trans>}>
          <a className={editorial.link} href={`mailto:${consultant.email}`}>
            {consultant.email}
          </a>
        </ContactItem>
        {consultant.phone === undefined ? null : (
          <ContactItem icon="phone" label={<Trans>Phone</Trans>}>
            <a className={editorial.link} href={`tel:${consultant.phone.replaceAll(/\s/gv, "")}`}>
              {consultant.phone}
            </a>
          </ContactItem>
        )}
      </dl>
    </section>
  )
}

function IndustryPanel({ consultant }: { consultant: Consultant }): ReactNode {
  if (consultant.industryExperience === undefined || consultant.industryExperience.length === 0) {
    return null
  }
  return (
    <aside
      aria-labelledby="profile-industries"
      className={styles.factPanel}
      data-profile-box="industry-experience"
    >
      <h2 className={styles.factPanelHeading} id="profile-industries">
        <Trans>Industry Experience</Trans>
      </h2>
      <dl className={styles.industryList}>
        {consultant.industryExperience.map((experience) => (
          <div className={styles.industryRow} key={experience.industry}>
            <dt className={styles.industryName}>{experience.industry}</dt>
            <dd className={styles.industryYears}>
              {experience.years} <Plural one="year" other="years" value={experience.years} />
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

// The first page: identity, the consultant's own introduction, contact
// details and industry experience. The project reports start on page 2.
export function SummaryPage({
  consultant,
  lang,
}: {
  consultant: Consultant
  lang: "de" | "en"
}): ReactNode {
  return (
    <section className={styles.summaryPage} data-profile-page="summary">
      <img
        alt={COMPANY_BRAND}
        className={styles.brandLogo}
        src={consultingTheme.assets.logo.transparent}
      />
      <header className={styles.identity}>
        <div>
          <h1 className={styles.name}>{consultant.name}</h1>
          <p className={styles.jobTitle}>{consultant.title}</p>
          <p className={styles.specialties}>{consultant.focus}</p>
          {consultant.degree === undefined ? null : (
            <p className={styles.specialties}>{consultant.degree}</p>
          )}
        </div>
        {consultant.photo === undefined ? null : (
          <BunnyImage
            alt={consultant.name}
            className={styles.portrait}
            crop={consultant.photo.crop}
            height={SHEET_PHOTO.height}
            priority
            sizes="114px"
            src={consultant.photo.src}
            width={SHEET_PHOTO.width}
            widths={[SHEET_PHOTO.width]}
          />
        )}
      </header>
      <div className={styles.introduction}>
        {consultant.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.summaryColumns}>
        <PersonalDetails consultant={consultant} lang={lang} />
        <IndustryPanel consultant={consultant} />
      </div>
    </section>
  )
}
