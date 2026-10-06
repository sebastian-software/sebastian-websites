import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { LegalClassNames } from "./model"

export type PrivacyRightsProperties = {
  readonly classes: LegalClassNames
  readonly privacyEmail: string
}

// eslint-disable-next-line max-lines-per-function -- shared, reviewed legal content
export function PrivacyRights({ classes, privacyEmail }: PrivacyRightsProperties): ReactNode {
  return (
    <>
      <section className={classes.section} data-legal-section="rights">
        <h2 className={classes.sectionTitle}>
          <Trans>Your Rights</Trans>
        </h2>
        <p className={classes.text}>
          <Trans>Under the GDPR, you have the following rights regarding your personal data:</Trans>
        </p>
        <ul className={classes.list}>
          <li>
            <Trans>Right of access (Art. 15 GDPR)</Trans>
          </li>
          <li>
            <Trans>Right to rectification (Art. 16 GDPR)</Trans>
          </li>
          <li>
            <Trans>Right to erasure (Art. 17 GDPR)</Trans>
          </li>
          <li>
            <Trans>Right to restriction of processing (Art. 18 GDPR)</Trans>
          </li>
          <li>
            <Trans>
              Right to data portability (Art. 20 GDPR) – applies only to processing based on a
              contract (Art. 6(1)(b) GDPR), that is, when booking appointments through Terminaro and
              for contract-related email communication
            </Trans>
          </li>
          <li>
            <Trans>Right to object (Art. 21 GDPR) – see separate section below</Trans>
          </li>
        </ul>
        <p className={classes.text}>
          <Trans>
            To exercise your rights, you may contact us at any time at:{" "}
            <a className={classes.link} href={`mailto:${privacyEmail}`}>
              {privacyEmail}
            </a>
          </Trans>
        </p>
      </section>

      <section className={classes.section} data-legal-section="right-to-object">
        <h2 className={classes.sectionTitle}>
          <Trans>Right to object (Art. 21 GDPR)</Trans>
        </h2>
        <p className={classes.text}>
          <strong>
            <Trans>
              Where we process your personal data on the basis of legitimate interests pursuant to
              Art. 6(1)(f) GDPR, you have the right to object to such processing at any time
              pursuant to Art. 21 GDPR. If you object, we will no longer process your personal data
              for these purposes unless we can demonstrate compelling legitimate grounds for the
              processing which override your interests, rights and freedoms, or the processing
              serves the establishment, exercise or defence of legal claims.
            </Trans>
          </strong>
        </p>
        <p className={classes.text}>
          <Trans>
            To exercise your right to object, you may contact us at any time at:{" "}
            <a className={classes.link} href={`mailto:${privacyEmail}`}>
              {privacyEmail}
            </a>
          </Trans>
        </p>
      </section>

      <section className={classes.section} data-legal-section="complaint">
        <h2 className={classes.sectionTitle}>
          <Trans>Right to Lodge a Complaint with a Supervisory Authority</Trans>
        </h2>
        <p className={classes.text}>
          <Trans>
            You have the right to lodge a complaint with a data protection supervisory authority
            regarding the processing of your personal data. The supervisory authority responsible
            for us is:
          </Trans>
        </p>
        <address className={classes.address}>
          <Trans>
            Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz
            <br />
            Postfach 30 40
            <br />
            55020 Mainz
            <br />
            <a
              className={classes.link}
              href="https://www.datenschutz.rlp.de"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.datenschutz.rlp.de
            </a>
          </Trans>
        </address>
      </section>
    </>
  )
}
