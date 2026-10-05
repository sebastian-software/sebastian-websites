# Export the old Software site's content from Sanity and sort it

## Status

- Priority: P1
- Effort: S
- Risk: MEDIUM (the dataset is the only copy of the content; it contains third-party personal data)
- Depends on: none
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

The old Software site keeps every text, project, and testimonial in Sanity; nothing is in
Git ([ADR-0004](../adr/0004-content-as-files-no-cms.md)). Before the site is rebuilt and the
AWS stack removed, the content must be exported, and before anything enters this public
repository it must be sorted against [ADR-0012](../adr/0012-public-repository.md).

## Current state

- `sebastian-software-mono/studio/`: Sanity v3 studio; schema types `page` (home, mission,
  team, consulting, imprint, privacy-policy; Portable Text, document-level DE/EN), `project`,
  `company`, `testimonial`, `human`, `consultant`, `picture`, `address`
  (`studio/schemas/*.ts`).
- Project and dataset ids are in the environment variable names `SANITY_STUDIO_PROJECT_ID`
  and `SANITY_STUDIO_DATASET` (values in local `.env` files, not in Git).
- Raw source material in `sebastian-software-mono/assets/`: company logos, portraits of
  testimonial authors whose reuse needs a recorded permission, and technology logos.
- The live site shows 56 dated references from 2006 to 2025 (name, role, company, date) and
  the pages Mission, Team, Consulting, Imprint, Privacy.
- The Consulting site already owns the consultant profiles and projects
  (`sebastian-consulting.de/apps/consulting/app/data/*.ts`); its client logos are in
  `apps/consulting/app/assets/company/`.

## Scope

In scope:

- A full dataset export (`sanity dataset export`) including assets, stored in a private
  location outside this repository.
- A sorted inventory: which page copy, projects, testimonials, and logos are (a) already
  owned by the Consulting site, (b) worth carrying into the new Software or Consulting site,
  (c) not cleared for reuse.
- A clearance list for testimonials and portraits: who gave what permission, and when.

Out of scope:

- Writing new copy; the export is source material.
- Shutting down Sanity or AWS; that is plan 10.

## Verification commands

| Purpose | Command                                                                   | Expected result                                     |
| ------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Export  | `npx sanity dataset export <dataset> export.tar.gz` (in `studio/`)        | archive with `data.ndjson` and `images/`            |
| Count   | `tar -xOf export.tar.gz data.ndjson \| jq -r '._type' \| sort \| uniq -c` | counts per type, including `testimonial` and `page` |

## Steps

### 1. Export

Run the export with the studio's configured project and dataset. Store the archive privately
(not in any public repository) and record where.

### 2. Inventory and sort

List the pages, projects, testimonials, companies, and portraits. Mark each as owned by
Consulting, reusable, or not cleared. Note which copy (Mission, Team, Consulting) is worth
reading when the Software company page is written.

### 3. Clearance

For every testimonial and portrait that should appear again, record the permission or ask
for it. Everything without a record stays out.

## Done criteria

- [ ] The export exists outside Git and is readable.
- [ ] Every content type is sorted into owned, reusable, or not cleared.
- [ ] No portrait or testimonial is scheduled for reuse without a recorded permission.

## Stop conditions

- Stop if the dataset is not accessible with the owners' Sanity account; nothing else in
  this plan can proceed.

## Maintenance and review focus

The clearance list is what keeps the public repository clean later. Reviewers of plans 06 and
09 should check every reused testimonial against it.
