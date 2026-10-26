# Recruiting and freelancer profile maintenance

Technical references updated: 2026-10-26. Portal status: historical snapshots from
2026-08-24 and 2026-08-25; no portal was checked during this migration.

This runbook keeps Sebastian Fastner's recruiting profiles consistent. It supports
multi-month React/TypeScript projects, preferably fully remote and at high capacity.
It is intended for Sebastian and assistants working on his behalf.

Adapted from the [profile maintenance runbook in the former Consulting repository](https://github.com/sebastian-software/sebastian-consulting.de/blob/1b7e3a5/docs/runbooks/profilpflege.md).
Etengo's completed setup was recorded separately in the August project sessions and
was missing from that document. This repository now owns website and profile changes.

Account status, availability, and rates below are snapshots. Read the saved state in
each portal before changing it. Keep passwords, security codes, and other secrets out
of this runbook, tickets, and maintenance records.

## Source of truth and update order

The website and its generated recruiting PDF are the source of truth. Maintain:

- [Consultant facts and skills](../../apps/consulting/app/data/fastner.data.ts)
- [Featured projects](../../apps/consulting/app/data/fastner.projects-featured.ts)
- [Additional projects](../../apps/consulting/app/data/fastner.projects-additional.ts)
- [Recruiting profile](../../apps/consulting/app/data/fastner.project-profile.ts): role,
  summary, availability, focus skills, project selection, and staffing text
- [Profile document matrix](../../apps/consulting/app/lib/untranslated.ts): routes,
  stored PDF paths, and download names

Follow the [Consulting communication guide](../../apps/consulting/BRAND.md) when
revising profile copy. Delivery follows the [delivery model](../adr/0009-delivery-model.md)
and [website hosting guide](../operations/website-hosting.md).

1. Update facts and positioning in this repository.
2. Run `pnpm agent:check`. Build both Consulting variants with
   `pnpm --filter @sebastian-websites/consulting build`; each build generates and
   verifies its PDFs. Follow the normal PR and `main` delivery process.
3. Check the published pages and PDF downloads in a private browser window.
4. Update portal profiles and stored PDFs in priority order below.
5. Check alerts, availability, and the public profile view.
6. Write a [maintenance record](#maintenance-record).

Do not copy portal fields blindly: length limits, currencies, daily versus hourly
rates, and the meaning of remote work differ between platforms.

## Channel matrix

Priority 1 is the source; priority 2 covers active recruiting channels; priority 3
covers supporting channels or status checks; priority 4 requires a new application decision.

| Channel                    | Historical status                                                                                             | Priority | Review interval                                      | PDF dependency                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------- | ------------------------------------------------- |
| Sebastian Consulting       | German/English consultant and project profiles available                                                      | 1        | Monthly and on changes                               | Generates the source PDFs                         |
| freelance.de               | Active and published                                                                                          | 2        | Every two weeks while searching; otherwise quarterly | Upload the current recruiting PDF where supported |
| freelancermap              | Active; last recorded rate EUR 95/hour                                                                        | 2        | Every two weeks while searching; otherwise quarterly | Upload the current recruiting PDF where supported |
| LinkedIn                   | Active; Featured and contact links configured                                                                 | 2        | Monthly while searching; otherwise quarterly         | Link the PDF only in a suitable section           |
| Hays                       | Profile, PDF, availability, and daily alert completed                                                         | 2        | Monthly while searching; otherwise quarterly         | Keep the stored recruiting PDF current            |
| Etengo                     | Active; project profile uploaded; React/TypeScript/Frontend alert enabled                                     | 2        | Every two weeks while searching; otherwise quarterly | Keep the uploaded project profile current         |
| Randstad Professional/GULP | Profile content complete; a recent reference recommended                                                      | 3        | Monthly while searching; otherwise quarterly         | Check both uploaded PDF and portal export         |
| XING                       | Active; PDF and link maintenance still to check                                                               | 3        | Quarterly                                            | Check the current profile link or PDF             |
| Arc                        | Account created and profile submitted; last recorded rate USD 120/hour; resume and completion status to check | 3        | Monthly while searching; otherwise quarterly         | Keep the English resume/PDF current               |
| Computer Futures           | Account and profile status unclear                                                                            | 3        | Establish the baseline once, then quarterly          | Decide after the baseline check                   |
| Toptal                     | No account; only screening researched                                                                         | 4        | Only after a decision to apply                       | Prepare an English resume for an application      |

The rates are historical examples, not pricing guidance. Before changing a rate,
check currency, billing model, desired positioning, and current market context.
SOLCOM, Malt, and Uplink were recommendations only; the August sessions did not
record completed portal setup for them.

## When to update

Update affected channels when availability, capacity, start date, remote preference,
travel, rate, contact details, or contracting arrangements change. Also update them
when a project starts or ends, a reference is cleared, an outcome is verified, the
role or focus skills change, or a new PDF is published. Recheck profiles that become
hidden, rejected, or incomplete because of new required fields.

- Availability changes: update the website and PDF the same working day, then
  priority-2 channels within 24 hours.
- Active search: check marketplaces every two weeks; check LinkedIn, Hays,
  Randstad Professional/GULP, and Arc at least monthly.
- During a project: check all profiles quarterly for consistency and visibility.
- Four to six weeks before the expected project end: update availability,
  reactivate alerts, and review all channels in priority order.
- Annually: review project history, references, skills, links, public details,
  and accounts that are no longer needed.

## Shared checklist

Establish these facts on the website and PDF first, then compare each portal:

- Title, short positioning, focus skills, and search terms
- Availability, capacity, earliest start, and preferred project duration
- Remote preference, on-site work, travel, and location
- Contracting through Sebastian Software GmbH
- Project history, roles, dates, technologies, and supported outcomes
- Current references and cleared client or product names
- Contact, booking, website, and PDF links
- Hourly/daily rate and currency where publishing them is intended
- Visibility, search status, notifications, and profile language

Do not add experience, evidence, or results that the source material does not support.

## Channels

### Sebastian Consulting and recruiting PDFs

Check these public pages and downloads:

- German: [consultant profile](https://sebastian-consulting.de/fastner) and
  [project profile](https://sebastian-consulting.de/fastner/project-profile)
- English: [consultant profile](https://sebastian-consulting.com/fastner) and
  [project profile](https://sebastian-consulting.com/fastner/project-profile)
- Recruiting PDFs: [German](https://sebastian-consulting.de/pdfs/projektprofil-sebastian-fastner-react-typescript-de.pdf)
  and [English](https://sebastian-consulting.com/pdfs/project-profile-sebastian-fastner-react-typescript-en.pdf)
- General CV PDFs: [German](https://sebastian-consulting.de/pdfs/cv-sebastian-fastner-de.pdf)
  and [English](https://sebastian-consulting.com/pdfs/cv-sebastian-fastner-en.pdf)

Maintain structured facts, project data, outcomes, availability, and translations.
Generate PDFs from those sources instead of editing a separate PDF version.
Check language, filename, page count, key content, booking, and LinkedIn links after
publication. A merged change may still be deploying: confirm production before
updating portal uploads. PDF name changes also affect existing uploads and public links.

The current canonical pages have no `/de` or `/en` prefix and use
`/fastner/project-profile`. Legacy URLs are covered by the
[redirect contract](../adr/0010-url-and-redirect-contract.md).

### freelance.de

Entry: [freelance.de](https://www.freelance.de/). Capture the public profile URL from
the preview during the next review and put it in the maintenance record.

The profile was active and published on 2026-08-24. Its title and summary focused
on senior React/TypeScript work, frontend architecture, Node.js, testing, and CI/CD.

Maintain title, summary, skills, keywords, projects, availability, full-time status,
location, remote/travel preferences, rate, website, PDF, and visibility. Mention the
GmbH in fields that support the contracting arrangement. Check preview, public view,
alerts, and inquiries; download an uploaded PDF and compare it with the website.
A visible rate may be stale. Full-time availability and visibility are separate settings.

### freelancermap

Public profile: [Sebastian Fastner](https://www.freelancermap.de/profil/sebastian-fastner).
Entry: [freelancermap](https://www.freelancermap.de/).

The profile was active; EUR 95/hour was last recorded on 2026-08-24.
Maintain title, text, skills, projects, availability, capacity, remote share,
location/travel, contracting arrangement, rate/currency, documents, and alerts.
Check the logged-out view, visible rate, availability, downloaded document, and
alerts for suitable contracting projects. Portal fields, uploaded files, and the
public view can have different update dates.

### LinkedIn

Public profile: [sebastianfastner](https://www.linkedin.com/in/sebastianfastner/).

The profile was active. A Featured entry named “Projekt-Fit in 15 Minuten” and
contact links were configured. LinkedIn rejected the direct Terminaro link in
Featured, so the Consulting profile was used there.

Maintain headline, About text, current GmbH role, projects, skills, availability
signal, location, contact details, Featured content, and booking links. Keep both
language profiles consistent if used. Check the logged-out view, links, and website
preview. Review the setting for sharing profile changes before saving: updates can
notify the network, and link acceptance varies by profile section.

### XING

Public profile: [Sebastian_Fastner](https://www.xing.com/profile/Sebastian_Fastner).

The profile was active; the PDF upload and new recruiting-profile link were still
to check. Maintain title, About text, skills, experience, search status,
availability, remote preference, location, contact/website links, and portfolio/PDF.
Check the public view and download any stored PDF. Old sections may remain visible
after editing a summary; check the current interface and visibility settings.

### Hays

Entries: [Mein Hays](https://www.hays.de/meinhays/willkommen),
[profile details](https://www.hays.de/meinhays/profildaten), and
[project search](https://www.hays.de/jobsuche/stellenangebote-jobs).

On 2026-08-24, contact details, availability, and the recruiting PDF were submitted.
The daily alert “React / TypeScript / Node.js – Contracting” was configured.

Maintain contact details, earliest start, capacity, remote/travel preference,
contracting arrangement, PDF, and alert terms, employment type, and interval.
The PDF carries much of the positioning because fewer skill fields are editable.
Read saved details after a fresh login; check PDF version and alert status, and
search React, TypeScript, Frontend, and Node.js under Contracting. Sessions expire
quickly. After a Cloudflare or session error, read the saved state before resubmitting.

### Etengo

Entry: [Etengo](https://www.etengo.de/). Capture the current login and profile URL
from the portal during the next review; no direct profile URL was preserved.

The completed August setup recorded an active profile, an uploaded project profile,
immediate availability, EUR 90/hour for remote work, five days per week, willingness
to travel within DACH, and an active React/TypeScript/Frontend project alert.
These are historical saved values, not current availability or rate instructions.

Maintain title, summary, skills, project history, PDF, availability, capacity,
remote/travel preferences, rate/currency, contracting through Sebastian Software
GmbH, and alert terms and interval. Check the saved profile after login, download
the uploaded document where possible, and verify that the alert is still enabled.
Review alerts promptly during an active search; a suitable match may warrant a
same-day response. Sending an application or message requires the user's authorization.

### Randstad Professional/GULP

Entry: [GULP](https://www.gulp.de/). Record the current Randstad Professional login
and profile domain during the next review.

The profile content was complete on 2026-08-24; an eight-page portal PDF export had
been checked. A recent reference was the next recommended improvement.
Maintain title, summary, skills, projects, references, availability, capacity,
remote share, location/travel, rate, contracting arrangement, PDF, and portal export.
Check the public/recruiter preview and compare the uploaded PDF with the generated
export. Use only cleared references. Names and domains may change, and the portal
export may shorten or reorder content.

### Arc

Entry: [Arc](https://arc.dev/). Capture a public profile URL from the dashboard if
one has been released.

The account was created and the profile submitted. USD 120/hour was last recorded;
resume upload and the full completion status were still to check.
Maintain English title/summary, skills, projects, time zone, working hours, remote
availability, contracting/capacity preferences, USD rate, resume, and screening status.
Read the dashboard status, check the public preview, download the resume, and
confirm rate/currency before deciding on further screening steps. Submitted does
not necessarily mean public, complete, or approved for matching. Consider fees,
payment arrangements, and the contract model when setting a USD rate.

### Toptal

Entry: [apply as a freelancer](https://www.toptal.com/talent/apply).

No account was recorded; only screening was researched. Contracting and billing
through the GmbH remained unresolved. Before applying, decide on screening time,
English resume, rate, interview preparation, remote/capacity preferences, and the
contract/payment structure. Register only after an explicit decision to apply;
record each step and do not assume GmbH eligibility.

### Computer Futures

Entry: [Computer Futures Germany](https://www.computerfutures.com/de-de/).
Verify and record the login/profile URL during the first baseline review.

The account and stored profile status were unclear. Establish whether an account
exists, then inventory contacts, CV, skills, projects, availability, remote/capacity
preferences, rate, contracting arrangement, consent, and notifications before editing.
Confirm the saved candidate record and filenames in the interface or with the
responsible contact. Recruiters may use internal systems instead of a public
profile; registration alone does not prove they hold the current PDF. Do not send
a confirmation request without authorization.

## Final public check

1. Open public profiles in a private browser window.
2. Compare title, first two paragraphs, availability, and any visible rate.
3. Follow website, booking, and LinkedIn links.
4. Download each stored PDF and check filename, language, and content date.
5. Check alerts for contracting/freelance work, suitable terms, and frequency.
6. Compare remote share, capacity, and start date with the source of truth.
7. Check confirmation emails and pending approvals without recording codes or contents.

## Maintenance record

Record each review in its work ticket or an appropriate access-controlled location.
Do not put credentials or security codes in it.

```text
Date/time:
Performed by:
Reason: scheduled | availability | project/reference | positioning | contact | rate | other
Published website commit:
Channels checked:
- Channel:
  Account status:
  Fields changed:
  PDF filename and visible date:
  Public URL checked: yes/no/not available
  Alert checked: yes/no/not available
  Result:
  Open action and owner:
Channels not checked and reason:
Next review date:
```

A channel is complete only after reading its saved state again and, where
available, checking the public view. A last-checked date describes that review;
it does not guarantee the portal will keep the same state afterward.
