import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type {
  LegalClassNames,
  LegalDocumentProperties,
  LegalSiteConfig,
  PrivacyActivity,
} from "./model"

import { LegalDocumentFrame } from "./LegalDocument"
import { getPrivacyProcessorIds } from "./model"
import { PrivacyAnalytics } from "./PrivacyAnalytics"
import { PrivacyBooking } from "./PrivacyBooking"
import { PrivacyHosting } from "./PrivacyHosting"
import { PrivacyRights } from "./PrivacyRights"

const RYBBIT_ACTIVITY: PrivacyActivity = "analytics:rybbit"
const TERMINARO_ACTIVITY: PrivacyActivity = "booking:terminaro"

function hasActivity(config: LegalSiteConfig, activity: PrivacyActivity): boolean {
  return config.privacyActivities.includes(activity)
}

function ControllerSection({
  classes,
  config,
}: {
  readonly classes: LegalClassNames
  readonly config: LegalSiteConfig
}): ReactNode {
  const { operator } = config

  return (
    <section className={classes.section} data-legal-section="controller">
      <h2 className={classes.sectionTitle}>
        <Trans>Controller</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          The controller within the meaning of the General Data Protection Regulation (GDPR) and
          other data protection legislation is:
        </Trans>
      </p>
      <address className={classes.address}>
        {operator.name}
        <br />
        {operator.address.street}
        <br />
        {operator.address.postalCode} {operator.address.city}
        <br />
        <Trans>Germany</Trans>
      </address>
      <dl className={classes.definitionList}>
        <dt className={classes.definitionTerm}>
          <Trans>Managing Directors:</Trans>
        </dt>
        <dd className={classes.definitionDescription}>{operator.managingDirectors.join(", ")}</dd>
        <dt className={classes.definitionTerm}>
          <Trans>Email:</Trans>
        </dt>
        <dd className={classes.definitionDescription}>
          <a className={classes.link} href={`mailto:${config.privacyEmail}`}>
            {config.privacyEmail}
          </a>
        </dd>
      </dl>
      <p className={classes.text}>
        <Trans>
          A data protection officer has not been appointed, as the legal requirements for this do
          not apply. For data protection inquiries, you can contact the email address listed above.
        </Trans>
      </p>
    </section>
  )
}

function OverviewSection({
  classes,
  config,
}: {
  readonly classes: LegalClassNames
  readonly config: LegalSiteConfig
}): ReactNode {
  const includesAnalytics = hasActivity(config, RYBBIT_ACTIVITY)
  const includesEmail = hasActivity(config, "contact:email")

  return (
    <section className={classes.section} data-legal-section="overview">
      <h2 className={classes.sectionTitle}>
        <Trans>Overview of Data Processing</Trans>
      </h2>
      {includesAnalytics && includesEmail ? (
        <p className={classes.text}>
          <Trans>
            This website does not process personal data beyond what is technically necessary. No
            cookies are set. For statistical analysis of website usage, we use Rybbit, which
            operates entirely without cookies and does not permanently store any personal data (see
            section "Web Analytics"). There is no contact form – contact is made exclusively by
            email.
          </Trans>
        </p>
      ) : (
        <>
          <p className={classes.text}>
            <Trans>
              This website does not process personal data beyond what is technically necessary. No
              cookies are set.
            </Trans>
          </p>
          {includesAnalytics ? (
            <p className={classes.text}>
              <Trans>
                For statistical analysis of website usage, we use Rybbit, which operates entirely
                without cookies and does not permanently store personal data (see section "Web
                Analytics").
              </Trans>
            </p>
          ) : null}
          {includesEmail ? (
            <p className={classes.text}>
              <Trans>There is no contact form – contact is made exclusively by email.</Trans>
            </p>
          ) : null}
        </>
      )}
    </section>
  )
}

function EmailContactSection({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="contact-email">
      <h2 className={classes.sectionTitle}>
        <Trans>Contact via Email</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          When you contact us by email, the data you provide (email address, name if applicable, and
          message content) will be processed to handle your inquiry. If your inquiry is aimed at
          concluding or performing a contract, the legal basis is Art. 6(1)(b) GDPR (pre-contractual
          or contractual measures). For general inquiries without a contractual context, the legal
          basis is Art. 6(1)(f) GDPR; our legitimate interest lies in the proper handling of
          incoming inquiries. This interest prevails, as processing is limited to what is necessary
          for responding and data is deleted upon completion. Your data will be deleted once the
          inquiry has been fully resolved. Where tax or commercial law retention obligations apply
          (§ 257 HGB, § 147 AO), the relevant data will be retained for up to 10 years.
        </Trans>
      </p>
    </section>
  )
}

function HetznerProcessorDescription({ config }: { readonly config: LegalSiteConfig }): ReactNode {
  const usesRybbit = hasActivity(config, RYBBIT_ACTIVITY)
  const usesTerminaro = hasActivity(config, TERMINARO_ACTIVITY)

  if (usesRybbit && usesTerminaro) {
    return <Trans>Hosting of the Terminaro application and the Rybbit analytics server</Trans>
  }
  if (usesTerminaro) {
    return <Trans>Hosting of the Terminaro application</Trans>
  }

  return <Trans>Hosting of the Rybbit analytics server</Trans>
}

function ProcessorSection({
  classes,
  config,
}: {
  readonly classes: LegalClassNames
  readonly config: LegalSiteConfig
}): ReactNode {
  const processors = getPrivacyProcessorIds(config)

  if (processors.length === 0) {
    return null
  }

  return (
    <section className={classes.section} data-legal-section="processors">
      <h2 className={classes.sectionTitle}>
        <Trans>Processors</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          We use the following processors pursuant to Art. 28 GDPR, with each of whom a data
          processing agreement is in place:
        </Trans>
      </p>
      <dl className={classes.definitionList}>
        {processors.includes("bunny") ? (
          <>
            <dt className={classes.definitionTerm}>
              <Trans>BunnyWay d.o.o. (Bunny.net), Slovenia</Trans>
            </dt>
            <dd className={classes.definitionDescription}>
              <Trans>CDN, hosting and edge scripting for this website</Trans>
            </dd>
          </>
        ) : null}
        {processors.includes("hetzner") ? (
          <>
            <dt className={classes.definitionTerm}>
              <Trans>Hetzner Online GmbH, Germany</Trans>
            </dt>
            <dd className={classes.definitionDescription}>
              <HetznerProcessorDescription config={config} />
            </dd>
          </>
        ) : null}
      </dl>
    </section>
  )
}

function ExternalLinksSection({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="external-links">
      <h2 className={classes.sectionTitle}>
        <Trans>External Links</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          This website contains links to third-party websites. When you click on these links, you
          will be redirected to the respective third-party site. The respective operators are
          responsible for data processing on these external sites. We recommend that you read the
          privacy policies of the linked sites.
        </Trans>
      </p>
    </section>
  )
}

function AutomatedDecisionSection({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="automated-decision-making">
      <h2 className={classes.sectionTitle}>
        <Trans>Automated Decision-Making</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          No automated decision-making, including profiling, pursuant to Art. 22 GDPR takes place.
        </Trans>
      </p>
    </section>
  )
}

export function PrivacyDocument({
  additionalSections,
  classes,
  config,
}: LegalDocumentProperties): ReactNode {
  const versionOn = config.privacyReview.versionOn
  const formattedVersion =
    versionOn === undefined
      ? undefined
      : new Intl.DateTimeFormat(config.locale, {
          dateStyle: "long",
          timeZone: "UTC",
        }).format(new Date(`${versionOn}T00:00:00.000Z`))

  return (
    <LegalDocumentFrame
      classes={classes}
      review={config.privacyReview}
      subtitle={
        formattedVersion === undefined ? undefined : <Trans>Last updated: {formattedVersion}</Trans>
      }
      title={<Trans>Privacy Policy</Trans>}
    >
      <ControllerSection classes={classes} config={config} />
      <OverviewSection classes={classes} config={config} />
      {hasActivity(config, "hosting:bunny") ? <PrivacyHosting classes={classes} /> : null}
      {hasActivity(config, RYBBIT_ACTIVITY) ? <PrivacyAnalytics classes={classes} /> : null}
      {hasActivity(config, "contact:email") ? <EmailContactSection classes={classes} /> : null}
      {hasActivity(config, TERMINARO_ACTIVITY) ? <PrivacyBooking classes={classes} /> : null}
      <ProcessorSection classes={classes} config={config} />
      <ExternalLinksSection classes={classes} />
      <AutomatedDecisionSection classes={classes} />
      <PrivacyRights classes={classes} privacyEmail={config.privacyEmail} />
      {additionalSections}
    </LegalDocumentFrame>
  )
}
