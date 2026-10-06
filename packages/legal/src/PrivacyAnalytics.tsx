import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { LegalClassNames } from "./model"

export function PrivacyAnalytics({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="analytics-rybbit">
      <h2 className={classes.sectionTitle}>
        <Trans>Web analytics with Rybbit</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          This website uses Rybbit for statistical analysis of website usage. Rybbit is self-hosted
          on our own server at the domain t.sebastian-software.de. Data is not shared with third
          parties.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>How It Works</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Rybbit operates without cookies and without persistent identifiers. To count unique
          visitors, Rybbit generates a pseudonymised hash from the IP address and user agent. The IP
          address is processed only transiently in working memory for hash generation and is never
          permanently stored or logged. A daily rotating random component (salt) resets this
          identifier every day, so tracking across days is ruled out.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Processed Data</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>The following data is collected and stored exclusively in aggregated form:</Trans>
      </p>
      <ul className={classes.list}>
        <li>
          <Trans>Page views (URL, referrer)</Trans>
        </li>
        <li>
          <Trans>Device information (screen size, operating system, browser)</Trans>
        </li>
        <li>
          <Trans>
            Approximate geographic location (country level, derived from the IP address, which
            itself is not stored)
          </Trans>
        </li>
        <li>
          <Trans>
            Triggered interaction events (such as clicking the booking button or the PDF download),
            each without any personal reference
          </Trans>
        </li>
      </ul>

      <h3 className={classes.subsectionTitle}>
        <Trans>Legal Basis</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          The use of Rybbit is based on Art. 6(1)(f) GDPR. Our legitimate interest lies in analyzing
          website usage for the needs-based design and optimization of our website. This interest
          prevails because Rybbit is designed in such a way that no personal data is permanently
          processed and no conclusions can be drawn about individual users. Since Rybbit does not
          set cookies and does not access information already stored on the user's device, consent
          under § 25 TDDDG (German Telecommunications Digital Services Data Protection Act) is not
          required.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Hosting and Third-Country Transfer</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Rybbit is operated on our own server, hosted by Hetzner Online GmbH in Germany. No
          third-country transfer takes place. This does not constitute a data processor within the
          meaning of Art. 28 GDPR, as data processing takes place exclusively on our own
          infrastructure.
        </Trans>
      </p>

      <p className={classes.text}>
        <Trans>
          For more information about Rybbit, please visit the{" "}
          <a
            className={classes.link}
            href="https://www.rybbit.io/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Rybbit website
          </a>
          .
        </Trans>
      </p>
    </section>
  )
}
