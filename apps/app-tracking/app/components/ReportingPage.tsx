import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { BunnyImage, editorialSizes } from "@sebastian-websites/ui"

import { toolReportingPrivacyUrl } from "~/lib/legal"

import workspace from "../assets/workspace.jpg?bunny"
import * as styles from "./ReportingPage.css"

const HERO_DESIGN_WIDTH = 480

// eslint-disable-next-line max-lines-per-function -- The function renders the static reporting disclosure.
export function ReportingPage(): ReactElement {
  return (
    <main className={styles.main} id="main">
      <div className={styles.introBand}>
        <section aria-labelledby="page-title" className={styles.intro}>
          <div>
            <h1 id="page-title">{t`How usage reports help us improve our tools`}</h1>
            <p className={styles.lead}>
              {" "}
              {t`We want to understand which commands, versions, and platforms matter in everyday use. Optional usage reports help us decide what to maintain and improve.`}{" "}
            </p>
            <p>
              {" "}
              {t`We run app-tracking at Sebastian Software GmbH in Mainz, Germany. Usage reports require your explicit permission. You can decline and still use the tool and its separately configurable update checks.`}{" "}
            </p>
            <a className={styles.primaryLink} href="#data">
              {t`What a report contains`} <span aria-hidden="true">{"\u2193"}</span>
            </a>
          </div>
          <BunnyImage
            alt=""
            className={styles.workspaceImage}
            height={400}
            priority
            sizes={editorialSizes(HERO_DESIGN_WIDTH)}
            src={workspace}
            width={600}
          />
        </section>
      </div>
      <div className={styles.document}>
        <p className={styles.scopeNote}>
          {" "}
          {t`This overview covers the invocation and unified-client reporting contracts. Your tool’s release and privacy notice specify which metrics and controls are available.`}{" "}
        </p>
        <section aria-labelledby="data-title" id="data">
          <h2 id="data-title">
            <svg
              aria-hidden="true"
              className={styles.sectionIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M8 4H5v17h14V4h-3M9 3h6v4H9zM8 11h8M8 15h8" />
            </svg>
            {t`What a report can contain`}{" "}
          </h2>
          <p>
            {" "}
            {t`After opt-in, the tool counts locally and normally sends daily batches over HTTPS while you use it. Reports help us compare participating installations and repositories; they do not count people or everyone who uses a tool.`}{" "}
          </p>
          <table>
            <caption className={styles.visuallyHidden}>
              {" "}
              {t`Fields allowed by the reporting contracts`}{" "}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t`Category`}</th>
                <th scope="col">{t`Details`}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t`Usage`}</th>
                <td>
                  {" "}
                  {t`Tool and version, UTC day, command or registered event category, and count. Dalo and Palamedes register command categories. Ferriki’s catalog registers download kind, language category, and explicit/dependency source. Catalog registration does not mean the consumer has enabled reporting.`}{" "}
                </td>
              </tr>
              <tr>
                <th scope="row">{t`System`}</th>
                <td>
                  {" "}
                  {t`The unified client’s current catalog selects OS family/version, executable architecture, and CPU family. Linux context can include distribution/version and kernel version. Raw hardware model strings are excluded. Legacy invocation reports have no system context.`}{" "}
                </td>
              </tr>
              <tr>
                <th scope="row">{t`Identifiers`}</th>
                <td>
                  {" "}
                  {t`Tool- and profile-scoped installation ID, batch ID, local/CI context, and consent metadata. Legacy IDs encode creation time and use a consent revision. Unified-client IDs are random hexadecimal values; the explicit grant timestamp is sent separately.`}{" "}
                </td>
              </tr>
              <tr>
                <th scope="row">{t`Repository`}</th>
                <td>
                  {" "}
                  {t`When reliable metadata exists, a SHA-256 hash of the normalized repository URL, calculated locally. The original URL is never sent. Different clones and developers share the same hash, including across our tools; forks have different hashes.`}{" "}
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>{t`Reports are pseudonymous rather than anonymous.`}</strong>{" "}
            {t`A known or guessed repository URL can be used to calculate and match its hash. Installation IDs connect reports within one tool.`}{" "}
          </p>
          <p>
            {" "}
            {t`Reports exclude source code, file contents, command arguments, local paths, repository URLs, usernames, machine names, session IDs, and skill names or content.`}{" "}
          </p>
          <p className={styles.referenceLinks}>
            {" "}
            {t`Exact definitions:`}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/contracts/event-catalog.json">{t`metric catalog`}</a>
            {","}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/event-batches.md">{t`unified events`}</a>
            {t`, and`}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/telemetry-api.md">{t`legacy invocations`}</a>
            {"."}{" "}
          </p>
        </section>
        <section aria-labelledby="controls-title" id="controls">
          <h2 id="controls-title">
            <svg
              aria-hidden="true"
              className={styles.sectionIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
              <path d="M8 3v6M16 9v6M10 15v6" />
            </svg>
            {t`Your controls`}{" "}
          </h2>
          <p>
            {" "}
            {t`Each integrating tool must provide the controls below. See its documentation for the exact commands. The unified SDK supplies the permission dialog and saved choice; a software update does not count as consent. CI reporting requires separate explicit authorization and isolated state.`}{" "}
          </p>
          <dl className={styles.controlsList}>
            <div>
              <dt>{t`Inspect`}</dt>
              <dd>
                {" "}
                {t`Check the effective setting and preview queued payloads locally without sending them. Preview is not a server-side access export.`}{" "}
              </dd>
            </div>
            <div>
              <dt>{t`Disable`}</dt>
              <dd>
                {" "}
                {t`Stop new collection and uploads and discard unsent usage. Previously received reports remain until deletion or expiry. Update checks keep their own settings.`}{" "}
              </dd>
            </div>
            <div>
              <dt>{t`Delete`}</dt>
              <dd>
                {" "}
                {t`Request deletion of retained active contributions using the tool’s locally held credential. Offline deletion is not confirmed until the tool reconnects and receives acknowledgement. The legacy invocation client marks deletion unverified after 90 days without confirmation; explicitly forgetting its local state can end retries earlier. If the credential is lost, contact us for assistance.`}{" "}
              </dd>
            </div>
          </dl>
          <h3>{t`More choices, if you want to help further`}</h3>
          <p>{t`Ordinary reporting stays limited to 90 days. Participating tools can separately ask to retain screened monthly summaries for 24 months or link future reports through a private random profile. Both choices are optional, start only after acknowledgement, and can be withdrawn independently. Existing consent and software updates enable neither.`}</p>
          <p>
            <a
              href={`${toolReportingPrivacyUrl.split("#")[0]}#tool-usage-history`}
            >{t`Monthly history and withdrawal`}</a>
            {" · "}
            <a
              href={`${toolReportingPrivacyUrl.split("#")[0]}#tool-usage-profiles`}
            >{t`Profile linking, unlinking, and reset`}</a>
          </p>
          <p>
            {" "}
            {t`Integrations must honor either shared off switch below, even with an existing opt-in. These local settings do not request deletion of received reports.`}{" "}
          </p>
          <pre aria-label={t`Environment variables to disable usage reporting`}>
            <code>{"export DO_NOT_TRACK=1\n# or\nexport APP_TRACKING_TELEMETRY=off"}</code>
          </pre>
        </section>
      </div>
      <div className={styles.privacyBand}>
        <section aria-labelledby="privacy-title" className={styles.document} id="privacy">
          <h2 id="privacy-title">
            <svg
              aria-hidden="true"
              className={styles.sectionIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M4 21V5l8-3 8 3v16M2 21h20M8 7v2M12 7v2M16 7v2M8 12v2M12 12v2M16 12v2M10 21v-4h4v4" />
            </svg>
            {t`How we handle reporting data`}{" "}
          </h2>
          <p>
            <a href={toolReportingPrivacyUrl}>{t`Privacy notice for tool usage reports`}</a>
          </p>
          <p>
            {" "}
            {t`We design reporting around the GDPR’s requirements for clear purposes, limited data and retention, and control over consent. Our policies make these requirements concrete through documented fields, explicit opt-in, access restrictions, and deletion controls.`}{" "}
          </p>
          <p>
            <strong>{t`Data lifetime.`}</strong>{" "}
            {t`Usage expires from active reporting after at most 90 days, with physical cleanup within another 24 hours. Receipts last 90 days from receipt. Legacy revocation records last 90 days after revocation, without usage or repository hashes. Generic-event receipts and inactive identity state separately expire after 90 days.`}{" "}
          </p>
          <p>
            <strong>{t`Backups.`}</strong>{" "}
            {t`The ordinary database backup policy is at most seven days. Backups are not queried for reporting. Deleting active data does not edit existing backups, and restoring a backup can roll back later deletions. The`}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/telemetry-retention.md#ordinary-provider-recovery">{t`recovery policy`}</a>{" "}
            {t`describes this boundary.`}{" "}
          </p>
          <p>
            <strong>{t`Hosting and access.`}</strong>{" "}
            {t`Bunny hosts the API; PlanetScale stores reporting data. Authorized maintainers can view reports. Additional monthly history requires its own consent; profile linking requires another choice. Public usage statistics remain disabled. Providers process network metadata, including IP addresses. Processing and subprocessors can involve international transfers; an EU database region does not mean EU-only processing.`}{" "}
          </p>
          <p>
            <strong>{t`Logs and verification.`}</strong>{" "}
            {t`Application and CDN request logging are disabled by policy. Provider transport and security records are separate; we do not assert a universal maximum retention for them. The`}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/operations.md">{t`activation runbook`}</a>{" "}
            {t`requires verification of actual settings and a released privacy notice before real reporting is enabled.`}{" "}
          </p>
          <p className={styles.referenceLinks}>
            {" "}
            {t`Further details:`}{" "}
            <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/telemetry-retention.md">{t`retention and provider records`}</a>
            , <a href="https://bunny.net/gdpr/">{t`Bunny processor information`}</a>
            {t`, and`}{" "}
            <a href="https://planetscale.com/legal/data-processing-addendum">{t`PlanetScale DPA`}</a>
            {"."}{" "}
          </p>
          <p>
            {" "}
            {t`For questions about access, deletion, correction, restriction, objection where applicable, or portability, write to`}{" "}
            <a href="mailto:info@sebastian-software.de">{t`info@sebastian-software.de`}</a>
            {t`. You can also contact a supervisory authority. The released tool notice must explain applicable rights, legal bases, processors, and transfer safeguards. Please keep credentials, private repository URLs, and real payloads out of public issues.`}{" "}
          </p>
        </section>
      </div>
      <section
        aria-labelledby="questions-title"
        className={[styles.document, styles.furtherInformation].join(" ")}
        id="questions"
      >
        <h2 id="questions-title">{t`Further information`}</h2>
        <p>
          <strong>{t`Update checks`}</strong>{" "}
          {t`use a separate public endpoint and work when reporting is declined or unavailable. They expose transport metadata like any network request.`}{" "}
          <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/version-api.md">{t`Version API documentation`}</a>
          {"."}{" "}
        </p>
        <p>
          <strong>{t`Future metrics.`}</strong>{" "}
          {t`All shipped product definitions currently require opt-in. No production baseline metric is registered. New purposes require a separate explanation and permission before they begin. Your tool’s released notice and settings describe which features it supports.`}{" "}
          <a href="https://github.com/sebastian-software/app-tracking/blob/main/docs/adr/0010-metrics-purposes-and-consent.md">{t`Proposed direction`}</a>
          {"."}{" "}
        </p>
        <p>
          <strong>{t`This website`}</strong>{" "}
          {t`does not opt you in or access your tool’s local state. It adds no analytics, cookies, or browser storage. Our font and image CDNs serve shared brand assets. Bunny processes request metadata to deliver and secure the page.`}{" "}
          <a href="/privacy">{t`Website privacy notice`}</a>
          {"."}{" "}
        </p>
        <p>
          {" "}
          {t`The`}{" "}
          <a href="https://github.com/sebastian-software/app-tracking">{t`source code and contracts`}</a>{" "}
          {t`are public. app-tracking is a focused service for our tools, separate from the OpenTelemetry framework.`}{" "}
        </p>
      </section>
    </main>
  )
}
