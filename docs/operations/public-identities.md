# Public identities and profile reconciliation

Reviewed on 2026-11-17 for #130, #131, #138, #124, and #141. This is an
inventory of public evidence, not an account export or proof of account access.

## Sources and identity contract

- Legal name, registered contact address, directors, and telephone come from
  `packages/legal/src/company.ts`, rendered by the imprint on each domain.
- The footer identifies Sebastian Consulting as a registered brand of Sebastian
  Software GmbH. The brand is not a second employer or legal company.
- `packages/web-core/src/identities.ts` owns person IDs and public personal
  accounts. `frame.ts` owns company profile links and brand-specific mailboxes.
- The legal publisher is `https://sebastian-software.de/#organization` on every
  website and in both languages. Consulting's Brand ID is
  `https://sebastian-software.de/#consulting`.
- Each language website has its own `<canonical-origin>/#website`, its language,
  and the same publisher. OSS, the tech blog, and app-tracking remain Software
  publishing surfaces, not separate legal operators.
- Each consultant is `<German-Consulting-origin>/<key>#person`. The person's
  `url` is the full profile in the current reader's language. Compact profiles,
  articles, and visible bylines refer to that same person. Article IDs are the
  canonical article URL plus `#article`.
- The shared shell uses the existing public company logo and legal facts.
  Article markup uses authored dates, every visible author, and a real prepared
  cover when one exists. An unknown author gets their supplied name only.
  Structured data does not certify a rich result or citation.

## Official profile inventory

| Entity                  | Public profiles and verification                                                                                | Result / action                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Company                 | [GitHub](https://github.com/sebastian-software), [LinkedIn](https://de.linkedin.com/company/sebastian-software) | Both identify Sebastian Software GmbH and Mainz. Both are linked by the owned footer.                                                                           |
| Werner                  | [GitHub](https://github.com/swernerx), [LinkedIn](https://www.linkedin.com/in/swernerx/)                        | GitHub identifies Sebastian Werner and links the company. LinkedIn is the existing owned-profile link; its full public page was unavailable to the audit fetch. |
| Fastner                 | [GitHub](https://github.com/fastner), [LinkedIn](https://de.linkedin.com/in/sebastianfastner)                   | Both identify Sebastian Fastner and the company.                                                                                                                |
| Google Business Profile | No confirmed owned listing or authenticated management surface in this audit                                    | Ownership and current listing remain unverified. Do not create a duplicate or infer closure from this access gap.                                               |

The visible consultant GitHub links previously led to the organization. They now
lead to the verified personal accounts. The unused personal GitHub constants also
used guessed full-name handles; those are corrected. Employer markup previously
alternated between the Consulting brand and GmbH. It now references the legal
publisher consistently. No historical project role or recommendation was changed.

## External follow-up for the account owners

| Surface                          | Public observation                                                             | Desired check / owner                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Company GitHub                   | Website field uses `https://www.sebastian-software.de`                         | Company profile administrator can use canonical `https://sebastian-software.de/` to avoid the alias hop. The current URL remains functional.                          |
| Company LinkedIn                 | Website uses `http://www.sebastian-software.de`; primary address matches Mainz | Company profile administrator can use the HTTPS canonical URL.                                                                                                        |
| Company LinkedIn                 | Also lists a Hirschberg address                                                | Directors should confirm whether this is a current public business location. This audit cannot establish a contradiction; no extra office is added to website schema. |
| Fastner GitHub                   | Website field uses an HTTP/www company URL                                     | Fastner can replace it with the canonical HTTPS URL.                                                                                                                  |
| Fastner LinkedIn                 | Personal website uses an HTTP personal-domain alias                            | Fastner can select the current canonical Consulting profile. Availability and booking details require his current confirmation.                                       |
| Werner LinkedIn / Google listing | Full current fields unavailable                                                | Respective account owner should compare against the legal source and current full profile. This is an access gap, not a confirmed factual error.                      |

No external account, business listing, review, or directory entry was edited or
created. The abbreviated `Str.` versus `Straße` and brand-specific email addresses
are not address or ownership contradictions. A person's private location is not
an additional company office.

## Products and changing facts

The product inventory remains `apps/software/app/data/products.ts`:
[Terminaro](https://terminaro.eu) is described as early access;
Palamedes+ as coming soon, linking to the [open core](https://palamedes.dev);
VorOrt as coming soon, with the owned contact page as its next step. These are
the website's published statuses, not independently verified commercial
availability. Do not equate the available open core with a launched Palamedes+
service.

The directors own legal and brand facts; each consultant owns their personal
profile and availability; each product's release owner confirms product status.
Reconcile the owned page and external profiles whenever an address, contact,
role, availability, product stage, or primary destination changes. Recheck the
inventory during the next website release that changes any of those facts.
