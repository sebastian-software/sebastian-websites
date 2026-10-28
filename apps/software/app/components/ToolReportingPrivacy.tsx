import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { legalClassNames as classes } from "@sebastian-websites/ui"

function AdditionalReportingChoices(): ReactElement {
  return (
    <>
      <h3
        className={classes.subsectionTitle}
      >{t`Separate choices for monthly history and profile linking`}</h3>
      <p
        className={classes.text}
      >{t`Ordinary usage consent does not include these additional uses. Each stays off until you choose it separately in a participating tool. Declining either choice leaves the tool, update checks, and ordinary reporting settings available. An upgrade or a shared local profile file does not grant permission.`}</p>
      <h3
        className={classes.subsectionTitle}
        id="tool-usage-history"
      >{t`Monthly usage history`}</h3>
      <p
        className={classes.text}
      >{t`With your separate consent, we retain screened monthly usage counts and monthly installation and repository totals for 24 months after the month ends, to understand trends and plan maintenance. Detailed reports still expire after 90 days. Only usage from the UTC date after the service acknowledges the choice is eligible. Minimum group sizes and contribution limits can make a month unavailable; they do not guarantee anonymity. This choice does not authorize public release.`}</p>
      <p
        className={classes.text}
      >{t`You can withdraw monthly-history consent without stopping ordinary reporting. Once acknowledged, withdrawal or deletion invalidates the affected monthly summaries. If the detailed source data has already expired, those months remain unavailable. Offline changes remain pending until acknowledged. The same processors, transfer safeguards, and rights described in this notice apply.`}</p>
      <h3
        className={classes.subsectionTitle}
        id="tool-usage-profiles"
      >{t`Optional cross-tool profile linking`}</h3>
      <p
        className={classes.text}
      >{t`With another separate consent, we link future local-use reports from participating tools to understand which tools are used together and improve them. Each tool requires its own choice. A random identifier and a separate reset credential are kept in a private local profile file; the service stores the profile identifier, a hash of its credential, tool links, and permission times. This does not identify a verified person or physical machine. Copied files represent the same profile. CI reports are excluded. Eligibility begins on the UTC date after acknowledgement; earlier reports are not linked.`}</p>
      <p
        className={classes.text}
      >{t`You can unlink one tool or reset the shared profile for all linked tools. A reset removes links, not the tools’ independently retained reports. Deleting a tool’s reports also removes its link. Failed or offline requests remain visibly pending. Profile metadata remains while active links exist; inactive or reset metadata expires after 90 days, followed by physical cleanup within 24 hours. Linking does not extend the 90-day detail limit, enable monthly history, or authorize public release. Profile identifiers and overlap statistics are not published.`}</p>
      <p
        className={classes.text}
      >{t`Both additional choices rely on consent under Article 6(1)(a) GDPR and, for the associated device storage and access, section 25(1) TDDDG. You can withdraw each choice in the same tool settings used to give it, without affecting the lawfulness of earlier processing. Public usage statistics remain disabled pending a separate disclosure assessment.`}</p>
    </>
  )
}

// cspell:words TDDDG subprocessor subprocessors
export function ToolReportingPrivacy(): ReactElement {
  return (
    <section
      className={classes.section}
      data-legal-section="tool-usage-reports"
      id="tool-usage-reports"
    >
      <h2 className={classes.sectionTitle}>{t`Optional usage reports from our developer tools`}</h2>
      <p
        className={classes.text}
      >{t`This section applies when one of our developer tools offers optional usage reporting through app-tracking, operated by Sebastian Software GmbH. Visiting our websites does not create these reports or grant permission for tool reporting.`}</p>
      <p
        className={classes.text}
      >{t`With your permission, we use reports to understand which tool versions, commands, and platforms are used and to decide what to maintain and improve. We measure participating installations and repositories, not individual people or everyone who uses a tool. Reporting views are restricted to authorized maintainers; we do not publish individual reports.`}</p>
      <h3 className={classes.subsectionTitle}>{t`Permission and legal basis`}</h3>
      <p
        className={classes.text}
      >{t`The legal basis for optional usage reporting is your consent under Article 6(1)(a) GDPR. Consent also covers the associated storage and access on your device under section 25(1) TDDDG. Reporting stays off until you agree in the tool. You may decline without losing tool functionality or its separately configurable update checks. CI reporting requires separate explicit authorization.`}</p>
      <h3 className={classes.subsectionTitle}>{t`Reporting data`}</h3>
      <p
        className={classes.text}
      >{t`Depending on the tool and reporting contract, reports contain the tool and version, UTC day, registered command or event category and count, local or CI context, batch ID, tool- and profile-scoped installation ID, and consent revision or grant time. Legacy installation and batch IDs contain creation times. The unified client uses random hexadecimal IDs and sends the grant time separately. Its system context can include operating system and version, executable architecture, CPU family, and Linux distribution and kernel version. Legacy invocation reports contain no system context.`}</p>
      <p
        className={classes.text}
      >{t`Where reliable repository metadata is available, the tool calculates a SHA-256 hash of the normalized repository URL locally. The original URL is not sent. Clones and developers of the same repository share its hash, including across our tools; forks have different hashes. Someone who knows or guesses a URL can calculate and match its hash. Reports are therefore pseudonymous, rather than anonymous. Reports exclude source code, file contents, command arguments, local paths, repository URLs, usernames, machine names, session IDs, and skill names or content.`}</p>
      <AdditionalReportingChoices />
      <h3 className={classes.subsectionTitle}>{t`Processors and international transfers`}</h3>
      <p
        className={classes.text}
      >{t`Reports are sent over HTTPS to our app-tracking service. BunnyWay d.o.o. (Bunny.net), Slovenia, hosts the API and processes connection metadata such as IP addresses. PlanetScale, Inc., United States, provides the database service for reporting data. Our database region for this service is AWS Frankfurt, Germany. A database region in Germany does not mean that all support, security, or subprocessor processing takes place in the EU.`}</p>
      <p
        className={classes.text}
      >{t`International transfers may occur through these providers and their subprocessors. PlanetScale’s data processing addendum provides for the European Commission’s standard contractual clauses for relevant transfers outside the EEA. The linked provider documents describe their processing and transfer arrangements. You can contact our privacy address above for information about applicable safeguards and a copy of them.`}</p>
      <p className={classes.text}>
        <a
          className={classes.link}
          href="https://planetscale.com/legal/data-processing-addendum"
        >{t`PlanetScale data processing addendum`}</a>
        {" · "}
        <a
          className={classes.link}
          href="https://planetscale.com/legal/subprocessors"
        >{t`PlanetScale subprocessors`}</a>
        {" · "}
        <a
          className={classes.link}
          href="https://bunny.net/gdpr/"
        >{t`Bunny processor information`}</a>
      </p>
      <h3 className={classes.subsectionTitle}>{t`Retention and backups`}</h3>
      <p
        className={classes.text}
      >{t`Usage data expires from active reporting after at most 90 days; physical cleanup follows within another 24 hours. Batch receipts expire 90 days after receipt. Active installation and consent state expire after 90 days without new accepted reports. Minimal revocation or expiry records remain for 90 days after that event, without usage or repository hashes. The unified event service also expires receipts and inactive identity state after 90 days. Expired records are physically removed within another 24 hours.`}</p>
      <p
        className={classes.text}
      >{t`Our reporting database backup policy is at most seven days. Backups are used for recovery, not reporting. Deleting active data does not edit existing backups in place. Restoring a backup can reintroduce data deleted after its recovery point; known deletion requests must then be applied again. Provider-owned security, transport, and account records follow the applicable provider agreements and policies. The reporting retention periods are not a universal limit for those separate records.`}</p>
      <h3 className={classes.subsectionTitle}>{t`Withdrawal, deletion, and your rights`}</h3>
      <p
        className={classes.text}
      >{t`You can withdraw consent in the tool at any time. Withdrawal stops new collection and uploads and discards unsent usage; it does not affect the lawfulness of earlier processing. Previously received reports remain until deletion or expiry. The tool can show its effective setting and preview queued data locally. Its documentation explains the available controls.`}</p>
      <p
        className={classes.text}
      >{t`You can separately request deletion of retained reports using the credential held locally by the tool. An offline request remains pending until the service acknowledges it. Losing or explicitly removing local state can prevent automatic deletion or retries. Contact our privacy address if you need help; loss of a credential does not remove your statutory rights. Do not send credentials or private repository URLs as proof of identity. The rights and complaint options described in this policy also apply to tool reporting.`}</p>
      <p className={classes.text}>
        <a
          className={classes.link}
          href="https://github.com/sebastian-software/app-tracking/blob/main/contracts/event-catalog.json"
        >{t`Current metric definitions`}</a>
        {" · "}
        <a
          className={classes.link}
          href="https://github.com/sebastian-software/app-tracking/blob/main/docs/telemetry-retention.md"
        >{t`Reporting retention and recovery policy`}</a>
      </p>
    </section>
  )
}
