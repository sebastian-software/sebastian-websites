# Build and launch the Open Source site

## Status

- Priority: P2
- Effort: M
- Risk: LOW (replaces a small, outdated site; one existing Bunny target)
- Depends on: 02, 03, 04
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

The current Open Source site is outdated: it lists 16 projects but none of Palamedes, Dalo, or
the newer Ferramenta engines, it is English only, and it runs on Ardo, which
[ADR-0007](../adr/0007-no-ardo-for-company-sites.md) rules out. The new site gives the two brand
families their place and actively promotes Consulting.

## Current state

- Repository `oss.sebastian-software.com`: React Router through Ardo 3, prerendered, English
  only, routes `/`, `/imprint`, `/privacy`. Projects are hard-coded in `app/data/projects.ts`
  (16 projects in five categories); star badges go through a Bunny edge proxy
  (`functions/bunnyMiddleware.ts`, `/ext/shields/*`).
- Hosting: Bunny target `opensource-sebastian-software` via the hosting CLI
  (`.github/workflows/deploy.yml`). The header still links to `oss.sebastian-software.de`,
  which does not exist yet.
- The metrics service lists about 26 repositories tagged `oss-project` (plan 04 adds status).
- Families: Ferramenta (`ferramenta/packages/family/src/family.ts` is its registry; site
  `ferramenta.dev`) and Effective (repositories listed in the overall concept; several need
  maintenance before they are shown). `effective-rison` is a fork and is dropped from the
  list.
- Information architecture: one long page with Highlights, the two family blocks, all
  projects by category, and a Consulting section
  ([overall concept](../concept/overall-concept.md#information-architecture)).

## Scope

In scope:

- `apps/opensource`: the long page, imprint, privacy, in both languages.
- The curated project list in this repository: seeded from the old `projects.ts` and the
  `oss-project` repositories, each with a one-liner, ecosystem, category, family, and link;
  numbers and status from the metrics service with a build-time snapshot.
- The highlights, chosen with the owners.
- Bunny targets `opensource-de` (new) and `opensource-en`; `oss.sebastian-software.de` as a
  new DNS record; the existing `.com` moved to the new target.
- Removal of the star-badge proxy.
- A nightly check that reports `oss-project` repositories missing from the curated list.

Out of scope:

- Project detail pages; the repository or project site is the home.
- Changes to the family sites.
- Archiving the old repository; that is plan 10. The README theme's logo must already load
  from the brand site (plan 03).

## Verification commands

| Purpose      | Command                                                       | Expected result                                     |
| ------------ | ------------------------------------------------------------- | --------------------------------------------------- |
| Full check   | `pnpm agent:check`                                            | exit 0                                              |
| Variants     | `pnpm --filter @sebastian-websites/opensource build:variants` | both variants; project cards carry snapshot numbers |
| List drift   | the nightly check                                             | reports zero missing repositories on launch day     |
| Live numbers | open the page, compare a star count with GitHub               | matches within the hour                             |

## Steps

### 1. Curate the list

Build the list from both sources, drop forks and archived repositories, assign families and
categories, and write the one-liners in English. Translate through the catalog.

### 2. Build the page

Highlights, family blocks (Ferramenta leading to ferramenta.dev; Effective with libraries and
skills leading to the Skills site), the category grid, the Consulting section.

### 3. Hosting and cutover

Create the targets and domains through the delivery chain, switch `oss.sebastian-software.com`
to the new target, add the `.de` record. Remove the old proxy edge script from the old target
only when it is retired in plan 10.

## Done criteria

- [ ] Both domains serve the new site; the `.de` one is new.
- [ ] Every listed project links to a working site or repository.
- [ ] Numbers on the page come from the metrics service, with a visible snapshot fallback.
- [ ] The Consulting section appears on the page and in both languages.

## Stop conditions

- Stop if the metrics service does not yet carry `archived` and `pushedAt` (plan 04); status
  cannot be derived without them.
- Stop if the Effective family would be shown with repositories the owners have not
  maintained yet; show the maintained ones only.

## Maintenance and review focus

Adding a project means adding an entry here; the nightly check is the reminder. Reviewers
should watch for numbers typed by hand.
