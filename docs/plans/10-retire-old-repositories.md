# Retire the old repositories and infrastructure

## Status

- Priority: P3
- Effort: M
- Risk: HIGH (irreversible removals; credentials; hot-linked assets)
- Depends on: 06, 07, 08, 09, each after its observation period
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

Four sites and the brand assets leave five repositories and three hosting setups behind.
Leaving them running costs money, keeps stale content reachable, and leaves credentials alive.
Removing them too early breaks hot-links and loses the only copy of some content.

## Current state

- `sebastian-software-mono`: AWS stack via SST (Lambda, CloudFront, two static sites, a
  DynamoDB table never used), DNS on Cloudflare, the Sanity studio at
  `studio.sebastian-software.de`. The credentials used for AWS, Cloudflare, Sentry, and Sanity
  must be rotated or deleted with the stack.
- `oss.sebastian-software.com`: Bunny target `opensource-sebastian-software` with the
  star-badge edge script. Its `app/assets/logo-software.svg` is hot-linked by the README
  theme until plan 03 repoints it.
- `skills.sebastian-software.com`: GitHub Pages for the site part until plan 08; the
  repository itself stays alive as the home of the skills.
- `sebastian-consulting.de`: legacy target `sebastian-consulting` with middleware, the preview
  zone and storage, four PDF-name edge rules (earliest safe removal 2027-06-13), and the
  frozen dependency on `@sebastian-gmbh/assets` 1.6.0.
- `sebastian-brand`: the npm package, the Vercel project `sebastian-brand.vercel.app`, the
  presentation template, and the social banners under `services/`.

## Production observation dates

Software, Open Source, and Consulting moved to their new canonical targets on 2026-10-07
([cutover record](../operations/domain-cutover-2026-10-07.md)). Their earliest retirement
review is 2026-11-06, after 30 incident-free days. This is an eligibility date, not an
instruction to remove resources: existing aliases and hot-links must be migrated first.
Skills and other successors retain their own observation periods. The Consulting PDF-name
rules remain protected until 2027-06-13.

## Scope

In scope, each after at least 30 days of the successor in production without incidents:

- AWS: `sst remove` for both stages, deletion of leftover buckets and the DynamoDB table,
  removal of the Cloudflare DNS records that pointed at AWS, rotation or deletion of the AWS
  and Cloudflare credentials, closure of the Sanity project after plan 05 confirmed the
  capture.
- Bunny: removal of the old Open Source target and edge script, the legacy Consulting target
  and preview resources, and any pull zone not in the variant list; the PDF-name rules only
  after 2027-06-13.
- GitHub: archive `sebastian-software-mono`, `oss.sebastian-software.com`,
  `sebastian-consulting.de`, and `sebastian-brand`; unpublish nothing on npm (the package
  stays frozen; mark it deprecated instead).
- Vercel: delete the brand project after every README that linked it points at the brand
  site.
- Move the presentation template and the social banners from `sebastian-brand` to a place
  the owners choose before archiving.

Out of scope:

- Deleting any repository; archiving only.
- The analytics host `t.sebastian-software.de`; it stays.

## Verification commands

| Purpose   | Command                                                                                                                                                                | Expected result                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Hot-links | `grep -rl "sebastian-brand.vercel.app\|oss.sebastian-software.com/main/app/assets" /Users/sebastian/Workspace/*/README.md* /Users/sebastian/Workspace/sebastian-theme` | no matches                             |
| AWS       | `sst remove --stage production` and `--stage development` (in the old repository)                                                                                      | no resources left                      |
| Domains   | `curl -sI` on every alias and personal domain                                                                                                                          | the ADR-0010 target, served from Bunny |

## Steps

### 1. Confirm the successors

For each old site, confirm 30 days in production, the redirect tests green, and the readable
capture of plan 05 stored.

### 2. Remove the hot-link dependencies

Run the hot-link search; fix every remaining README and the theme before anything is archived.

### 3. Tear down AWS and Sanity

`sst remove`, remove DNS records, rotate or delete credentials, close the Sanity project.

### 4. Clean up Bunny and Vercel

Remove the old targets and resources listed above, respecting the 2027-06-13 date for the
PDF-name rules.

### 5. Archive

Archive the four repositories with a final README note pointing to this repository. Deprecate
the npm package.

## Done criteria

- [ ] No AWS or Vercel resource of the old sites remains; the old credentials are rotated or
      deleted.
- [ ] Every alias and personal domain answers from Bunny as ADR-0010 states.
- [ ] No README or theme hot-links the old repositories or the Vercel page.
- [ ] The four repositories are archived, not deleted.

## Stop conditions

- Stop if any successor had an incident in its observation period; retire nothing until it is
  resolved.
- Stop if the content capture of plan 05 cannot be located and read.
- Stop before touching the PDF-name edge rules before 2027-06-13.

## Maintenance and review focus

Everything here is irreversible. Reviewers should insist on the hot-link search output and the
capture location being attached to the pull request that archives a repository.
