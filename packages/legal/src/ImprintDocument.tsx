import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { LegalDocumentProperties } from "./model"

import { LegalDocumentFrame } from "./LegalDocument"

// eslint-disable-next-line max-lines-per-function -- shared, reviewed legal content
export function ImprintDocument({
  additionalSections,
  classes,
  config,
}: LegalDocumentProperties): ReactNode {
  const { operator } = config

  return (
    <LegalDocumentFrame
      classes={classes}
      review={config.imprintReview}
      subtitle={<Trans>Information pursuant to § 5 DDG</Trans>}
      title={<Trans>Legal Notice</Trans>}
    >
      <section className={classes.section} data-legal-section="address">
        <h2 className={classes.sectionTitle}>
          <Trans>Address</Trans>
        </h2>
        <address className={classes.address}>
          {operator.name}
          <br />
          {operator.address.street}
          <br />
          {operator.address.postalCode} {operator.address.city}
          <br />
          <Trans>Germany</Trans>
        </address>
      </section>

      <section className={classes.section} data-legal-section="managing-directors">
        <h2 className={classes.sectionTitle}>
          <Trans>Managing Directors</Trans>
        </h2>
        <ul className={classes.list}>
          {operator.managingDirectors.map((director) => (
            <li key={director}>{director}</li>
          ))}
        </ul>
      </section>

      <section className={classes.section} data-legal-section="contact">
        <h2 className={classes.sectionTitle}>
          <Trans>Contact</Trans>
        </h2>
        <dl className={classes.definitionList}>
          <dt className={classes.definitionTerm}>
            <Trans>Phone:</Trans>
          </dt>
          <dd className={classes.definitionDescription}>
            <a className={classes.link} href={operator.contact.phoneHref}>
              {operator.contact.phone}
            </a>
          </dd>
          {operator.contact.fax === undefined ? null : (
            <>
              <dt className={classes.definitionTerm}>
                <Trans>Fax:</Trans>
              </dt>
              <dd className={classes.definitionDescription}>{operator.contact.fax}</dd>
            </>
          )}
          <dt className={classes.definitionTerm}>
            <Trans>Email:</Trans>
          </dt>
          <dd className={classes.definitionDescription}>
            <a className={classes.link} href={`mailto:${operator.contact.email}`}>
              {operator.contact.email}
            </a>
          </dd>
        </dl>
      </section>

      <section className={classes.section} data-legal-section="register">
        <h2 className={classes.sectionTitle}>
          <Trans>Register Entry</Trans>
        </h2>
        <p className={classes.text}>
          <Trans>Entry in the Commercial Register</Trans>
        </p>
        <dl className={classes.definitionList}>
          <dt className={classes.definitionTerm}>
            <Trans>Register Court:</Trans>
          </dt>
          <dd className={classes.definitionDescription}>{operator.registerCourt}</dd>
          <dt className={classes.definitionTerm}>
            <Trans>Register Number:</Trans>
          </dt>
          <dd className={classes.definitionDescription}>{operator.registerNumber}</dd>
        </dl>
      </section>

      <section className={classes.section} data-legal-section="vat-id">
        <h2 className={classes.sectionTitle}>
          <Trans>VAT ID</Trans>
        </h2>
        <p className={classes.text}>
          <Trans>
            VAT identification number pursuant to § 27a of the German Value Added Tax Act:
          </Trans>
        </p>
        <p className={classes.text}>{operator.vatId}</p>
      </section>

      <section className={classes.section} data-legal-section="editorial-responsibility">
        <h2 className={classes.sectionTitle}>
          <Trans>Editorially Responsible pursuant to § 18(2) MStV</Trans>
        </h2>
        <address className={classes.address}>
          {operator.editorialResponsible}
          <br />
          c/o {operator.name}
          <br />
          {operator.address.street}
          <br />
          {operator.address.postalCode} {operator.address.city}
          <br />
          <Trans>Germany</Trans>
        </address>
      </section>

      <section className={classes.section} data-legal-section="brand-notice">
        <h2 className={classes.sectionTitle}>
          <Trans>Trademark Notice</Trans>
        </h2>
        <p className={classes.text}>
          <Trans>
            {operator.brand} is a registered trademark of {operator.name}. This website is operated
            by {operator.name}.
          </Trans>
        </p>
      </section>

      {additionalSections}
    </LegalDocumentFrame>
  )
}
