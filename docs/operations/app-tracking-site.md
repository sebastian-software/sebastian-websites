# app-tracking website

`apps/app-tracking` owns the public explanation of update checks and optional tool
reporting. The API, Rust SDK, metric definitions, and production reporting controls
remain in [the service repository](https://github.com/sebastian-software/app-tracking).
This website never imports or initializes that SDK.

The app uses the shared `SiteHeader`, `SiteFooter`, brand fonts, fluid type and space
scales, and `BunnyImage`. The body keeps the restrained information-page design:
an introductory photograph, a field table, and continuous disclosure text. It is
light mode only. The newsletter and cross-brand promotional blocks are omitted;
the standard header still links to Consulting and the footer identifies the operator.

## Languages and domains

| Variant | Canonical domain                      | Bunny origin                                   |
| ------- | ------------------------------------- | ---------------------------------------------- |
| English | `app-tracking.sebastian-software.com` | `sebastian-websites-app-tracking-en.b-cdn.net` |
| German  | `app-tracking.sebastian-software.de`  | `sebastian-websites-app-tracking-de.b-cdn.net` |

English is the source. German uses the normal Palamedes catalog and the existing
shared frame and imprint translations. The reporting contracts remain authoritative
in English. `/`, `/imprint`, and `/privacy` are prerendered in both languages.
The source page's `#data`, `#controls`, `#privacy`, and `#questions` anchors remain.
The reporting overview and website privacy notice link to the official Software
policy at `/privacy#tool-usage-reports` on the matching `.com` or `.de` domain.
That section covers tool reports; the app's `/privacy` covers website visits.

Both variants start with `productionActive: false`. A main-branch deployment builds
and publishes them to the origin hosts through the existing workflow, without
attaching canonical domains. The normal build SEO and post-deployment checks apply.

## Cutover

1. Merge the app and verify both Bunny origin hosts, their reciprocal language
   links, images, privacy notices, and cookie behavior. The new website privacy
   notice records `review-required-before-production`; review its actual hosting
   settings and record the outcome before activation. Tool-reporting activation
   and its released privacy notice remain a separate service responsibility.
2. At the authoritative DNS provider (Bunny DNS for `.com`, Cloudflare for `.de`),
   add DNS-only CNAME records:
   `app-tracking.sebastian-software.com` to `sebastian-websites-app-tracking-en.b-cdn.net`,
   and `app-tracking.sebastian-software.de` to `sebastian-websites-app-tracking-de.b-cdn.net`.
   These are new names: preserve mail records and unrelated DNS settings.
3. Set both variants' `productionActive` values to `true` together. Deployment
   attaches the hosts, issues Bunny-managed certificates after DNS resolves,
   and enforces HTTPS. Confirm HTTPS, canonical/alternate links, 404 behavior,
   and first-party asset delivery on both public domains.
4. Only after those checks pass, update the service README and consumer links.
   Replace the old GitHub Pages site with a compatibility redirect that preserves
   anchors. Keep the existing page reachable until then; do not silently break
   already-published links or point them at unresolved domains.

On October 27, 2026 neither canonical subdomain had a CNAME. This document prepares
the records; it does not assert that DNS or certificates are already configured.

## Verify and maintain

```sh
pnpm --filter @sebastian-websites/app-tracking agent:check
pnpm --filter @sebastian-websites/app-tracking build
pnpm --filter @sebastian-websites/software build
pnpm --filter @sebastian-websites/app-tracking check:browser
```

The browser check covers both languages at four viewport sizes, the shared menu,
language links, keyboard navigation, local build images, light-mode behavior,
absence of cookies/storage, network destinations, and axe accessibility checks.
It also checks the localized links to the official Software policy and its
reporting section on desktop and mobile, including the direct anchor target.
It substitutes new hashed image URLs with the identical local build originals;
the normal hosting workflow verifies real CDN image delivery after publishing.
Font requests use the existing first-party brand and asset domains. Screenshots
are written to `apps/app-tracking/build/evidence` and are outside deployed clients.

The workspace photograph was generated with the built-in Imagegen tool for this
project, then resized and compressed for the original site. It depicts a generic
workspace, not the company's actual office. It is decorative and has empty alt
text. Its `?bunny` import follows the shared image pipeline. No brand logos or
fonts are copied into this app; they come from shared components and CDN hosting.

When reporting contracts or metric definitions change, review both translations.
Keep the legacy and unified-client payloads distinct, including their identifier,
system-context, consent, and deletion differences. Do not turn pseudonymous
repository hashes, German incorporation, or an EU database into an anonymity,
legal certification, or EU-only-processing claim.

## Privacy review boundary

This is implementation support and a draft disclosure, not a legal opinion or
production clearance. The German company operates an informational site for
developer-tool users. There are no accounts, sales, forms, newsletters, or
optional measurement integrations in this app. Website requests and email
contact are separate from tool reports.

| Surface                                 | Scope and status                                                     | Implementation and remaining decision                                                                                                                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operator identity                       | Germany; DDG section 5 likely applies                                | Reuse the shared company imprint and contact details.                                                                                                                                                                                                         |
| Website privacy notice                  | EU establishment; GDPR Articles 6 and 13 likely apply                | Describe hosting and contact. Before activation, confirm the DPA, actual recipients and transfer safeguards, retention criteria, email processing basis, and any applicable DPO details. Record the legitimate-interest assessment for delivery and security. |
| Optional browser storage or measurement | Germany; TDDDG section 25 conditional on device access               | The tested app adds none. Reassess if an integration changes this; visiting the site never grants tool-reporting permission.                                                                                                                                  |
| Tool reporting                          | EU/Germany; GDPR Articles 6, 7, 13 and TDDDG section 25 likely apply | The official Software notice covers reports. Tools link to it; consent contracts and activation evidence stay in the service repository.                                                                                                                      |

Sources checked on October 27, 2026: [DDG section 5](https://www.gesetze-im-internet.de/ddg/__5.html),
[TDDDG section 25](https://www.gesetze-im-internet.de/ttdsg/BJNR198210021.html),
[GDPR Articles 6 and 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng),
the [EDPB's lawful-processing guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_de),
and [Bunny's processor information](https://bunny.net/gdpr/). These identify review
requirements; they do not prove the account's operational settings. English is
the source of this new notice; the German translation needs the same review.

The official Software policy now includes a separate tool-reporting section in
both languages using the existing `PrivacyDocument.additionalSections` extension.
It does not add PlanetScale to website-only disclosures on Consulting, Open
Source, or Skills. Its source is the service's consent, retention, generic-event,
and metric-catalog contracts, not a provider's default settings. Software's
privacy review metadata records the new source and October 27, 2026 version;
the earlier website-only approval is not carried over to the new processing.
Confirm the effective PlanetScale agreement, transfer safeguards, Frankfurt
region, backup limits, and logging configuration under the service's activation
runbook before collecting real reports. Publishing this notice does not enable
reporting or record that operational review as complete.

Additional provider sources checked on October 27, 2026:
[PlanetScale DPA](https://planetscale.com/legal/data-processing-addendum)
(October 15, 2026 version, roles and Schedule 3 transfer clauses),
[subprocessors](https://planetscale.com/legal/subprocessors), and
[Postgres backups](https://planetscale.com/docs/postgres/backups). The public DPA
describes the contractual framework; it is not evidence of this account's
agreement or backup configuration.
