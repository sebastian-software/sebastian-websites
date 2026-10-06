import type { ReactNode } from "react"

import { Trans } from "@palamedes/react/macro"

import type { LegalClassNames } from "./model"

// eslint-disable-next-line max-lines-per-function -- shared, reviewed legal content
export function PrivacyHosting({ classes }: { readonly classes: LegalClassNames }): ReactNode {
  return (
    <section className={classes.section} data-legal-section="hosting-bunny">
      <h2 className={classes.sectionTitle}>
        <Trans>Hosting and Content Delivery Network</Trans>
      </h2>
      <p className={classes.text}>
        <Trans>
          This website is operated via the infrastructure of Bunny.net (BunnyWay d.o.o., Slovenia,
          EU). Bunny.net provides the following services:
        </Trans>
      </p>
      <ul className={classes.list}>
        <li>
          <Trans>
            CDN (Content Delivery Network) for delivering static files (HTML, JavaScript, CSS)
          </Trans>
        </li>
        <li>
          <Trans>Edge Scripting for server-side logic at Bunny.net nodes</Trans>
        </li>
        <li>
          <Trans>Storage for static files and assets</Trans>
        </li>
      </ul>

      <h3 className={classes.subsectionTitle}>
        <Trans>Processed Data</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Each page request processes the following categories of technical connection data: network
          identification data (IP address), time-related metadata (timestamp), usage data (requested
          URL), technical metadata (browser type, operating system, and device information), and the
          language preference transmitted by the browser (Accept-Language). According to a
          contractual assurance by Bunny.net, this data is held exclusively in working memory (RAM)
          and automatically deleted after 20–30 seconds. According to this assurance, no persistent
          storage takes place.
        </Trans>
      </p>
      {/*
       * The edge script also tries to persist the resolved locale in a
       * `preferred-locale` cookie (Max-Age one year). The pull zone carries
       * `disableCookies: enabled` and strips it: four requests across both
       * domains and three paths returned no `Set-Cookie` (verified 2026-08-07).
       * The sentence below reports that observed behaviour. Turning the zone
       * setting off would make it false and would require a cookie disclosure.
       */}
      <p className={classes.text}>
        <Trans>
          The language preference is used solely to route the request to the matching language
          version. Since the German version is located at sebastian-consulting.de and the English
          one at sebastian-consulting.com, this redirect may also lead to the respective other
          domain. No cookie is set in the process.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Legal Basis</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Processing is based on Art. 6(1)(f) GDPR. Our legitimate interest lies in ensuring the
          availability, integrity and security of the website. This interest outweighs the data
          subjects' interest in non-processing, as, according to a contractual assurance by
          Bunny.net, connection data is processed exclusively transiently in working memory and
          automatically deleted after a few seconds. Insofar as information on the user's terminal
          device is accessed (e.g. through edge scripting), this is permissible without consent
          pursuant to Section 25(2)(2) TDDDG, as the access is strictly necessary to provide the
          service explicitly requested by the user.
        </Trans>
      </p>

      {/*
       * Was „Drittlandtransfer" until the pull zone was pinned to the EU routing
       * filter. There is no third-country transfer of connection data left to
       * disclose, so the paragraph states the restriction instead — and the note
       * about the Standard Contractual Clauses and the Transfer Impact Assessment
       * went with it. Neither existed: the signed bunny.net DPA contains no SCCs,
       * and an assessment of a transfer presupposes a transfer that no longer
       * happens. See sebastian-software/datenschutz#1.
       *
       * The restriction is a configuration, not a contract clause: the pull zone
       * `sebastian-consulting` carries `RoutingFilters: ["eu"]` (verified
       * 2026-08-07). Geo zones alone would not do it — they are continental and
       * include European non-EU locations. If the routing filter is ever removed,
       * this paragraph becomes false.
       */}
      <h3 className={classes.subsectionTitle}>
        <Trans>Place of Processing</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          Bunny.net is based in Slovenia (EU/EEA). This website is delivered exclusively via nodes
          located in EU member states; no connection data is transferred to third countries.
          Bunny.net contractually commits that connection data on CDN nodes is only processed
          transiently and not stored permanently. Furthermore, a data processing agreement pursuant
          to Art. 28 GDPR is in place, in which Bunny.net ensures that sub-processors implement
          adequate data protection measures in accordance with the GDPR.
        </Trans>
      </p>

      <h3 className={classes.subsectionTitle}>
        <Trans>Obligation to Provide Data</Trans>
      </h3>
      <p className={classes.text}>
        <Trans>
          The transmission of your IP address is technically necessary to access this website.
          Without this data transmission, no connection to the server can be established and the
          website cannot be displayed. There is no legal or contractual obligation to provide any
          further personal data.
        </Trans>
      </p>

      <p className={classes.text}>
        <Trans>
          Further information can be found in the{" "}
          <a
            className={classes.link}
            href="https://bunny.net/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Bunny.net privacy policy
          </a>{" "}
          and on the{" "}
          <a
            className={classes.link}
            href="https://bunny.net/gdpr"
            rel="noopener noreferrer"
            target="_blank"
          >
            Bunny.net GDPR page
          </a>
          .
        </Trans>
      </p>
    </section>
  )
}
