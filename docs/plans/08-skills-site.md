# Build the Skills site here and take it out of the skills repository

## Status

- Priority: P2
- Effort: M
- Risk: MEDIUM (moves a live site off GitHub Pages and changes a public repository's CI)
- Depends on: 02, 03, 04
- Planned at: f007192, 2026-10-06
- Working state: paused on 2026-10-09; see "Decision" below

## Decision of 2026-10-09

The Skills site stays standalone. The skills are to become an open-source product of their
own (working name "Effective Agent") with its own identity, which makes a project site the
right home, as for Palamedes or Dalo, rather than an area under Software. The existing site
at skills.sebastian-software.com is reworked in its repository; this repository presents
Effective Agent as a featured open-source product on the Open Source site and on the Software
open-source page. Like the other products, it has no entry in the site header. The `skills`
variants stay defined but unused. The overall concept, the glossary, and ADR-0005 were updated
the same day; the build of this plan's app was discarded.

## Why this matters

The Skills site is hand-written HTML in the public skills repository, deployed to GitHub Pages,
English only, with CI checks that tie its numbers to the skill folders. The concept separates
site and skills ([ADR-0005](../adr/0005-curated-lists-live-numbers.md)) and makes the site
bilingual on the shared shell.

## Current state

- Repository `skills.sebastian-software.com`: six skills under `skills/effective-*/`, two
  instruction packs under `instructions/`, the site under `site/` (`index.html`,
  `comparisons.html`, `skills/<skill>/index.html`, `styles.css`, `script.js`, `CNAME`,
  `sitemap.xml`, `robots.txt`).
- Deployment: `.github/workflows/pages.yml` uploads `site/` to GitHub Pages on changes under
  `site/**`; `ci.yml` runs `scripts/validate-site.py`, which fails when cards, counts, install
  commands, GitHub links, or sitemap dates drift from the repository.
- Other scripts tied to the site: `scripts/render-site-assets.mjs`,
  `scripts/render-model-seals.mjs`, `scripts/test-site-layout.mjs`, `.github/workflows/site-layout.yml`,
  and `scripts/check-links.py`, which remaps `skills.sebastian-software.com` URLs to `site/`.
- The site loads its heading font from a hashed asset on the Consulting production site.
- The README of the skills repository links to the site pages per skill.
- Information architecture: Skills · Instruction packs · Install · Consulting, with one page
  per skill ([overall concept](../concept/overall-concept.md#information-architecture)).

## Scope

In scope:

- `apps/skills`: home, six skill pages, instruction packs, install, the Consulting section,
  legal; English source, German translation. Visitor copy per skill written here; numbers
  from the metrics service.
- The comparisons page only if the owners want to maintain it; otherwise a redirect to home.
- Bunny targets `skills-de` and `skills-en`; `skills.sebastian-software.com` moved from GitHub
  Pages to Bunny; `skills.sebastian-software.de` as a new record.
- In the skills repository: remove `site/`, `pages.yml`, `site-layout.yml`,
  `validate-site.py`, the render scripts, and the site remap in `check-links.py`; keep the
  README links to the site; keep `validate-readmes.py` and the DALO catalog checks.
- A nightly check here that reports skills present in the repository but missing on the site.

Out of scope:

- Any change to the skills themselves or to DALO.
- Rendering or linking the individual references.

## Verification commands

| Purpose              | Command                                                   | Expected result                         |
| -------------------- | --------------------------------------------------------- | --------------------------------------- |
| Full check           | `pnpm agent:check`                                        | exit 0                                  |
| Variants             | `pnpm --filter @sebastian-websites/skills build:variants` | both variants with six skill pages each |
| Skills repository CI | its `ci.yml` after the removal                            | passes without site steps               |
| Links                | `mise run links:check` in the skills repository           | no broken links to the new site         |

## Steps

### 1. Write the skill pages

Six pages with scope, routes, and install command, written for visitors, in English, then
translated. Decide the comparisons page with the owners.

### 2. Build the app

Home with the six skills, membership of the Effective family, install, instruction packs,
the Consulting section.

### 3. Cut over

Create the targets through the delivery chain. Point `skills.sebastian-software.com` at Bunny
and add the `.de` record. Remove the Pages deployment and the site files from the skills
repository in one pull request, and update `check-links.py`.

## Done criteria

- [ ] Both domains serve the new site; GitHub Pages is off for the skills repository.
- [ ] The skills repository's CI passes without any site check.
- [ ] Every skill in the repository has a page here (nightly check reports none missing).
- [ ] The site loads fonts from the font host, not from the Consulting site.

## Stop conditions

- Stop if the metrics service has no `skills` section yet (plan 04).
- Stop before removing files from the skills repository if its README or DALO documentation
  links to paths under `site/` other than the public URLs.

## Maintenance and review focus

A new skill needs an entry here; the nightly check is the reminder. Reviewers should check
that the numbers shown match the repository and that the German pages do not translate skill
names or install commands.
