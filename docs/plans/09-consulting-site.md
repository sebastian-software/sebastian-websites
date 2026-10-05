# Rebuild the Consulting site here and cut it over

## Status

- Priority: P2
- Effort: L
- Risk: HIGH (replaces the production site that works today; profile PDFs are a deliverable
  used in recruiting)
- Depends on: 02, 03
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

Consulting comes last because it works today. It is rebuilt here so that all four sites share
one shell and one delivery chain ([ADR-0003](../adr/0003-greenfield-monorepo.md)), and its
long-pending domain cutover to pathless variants happens with this launch instead of in the old
repository.

## Current state

- Repository `sebastian-consulting.de`, in maintenance mode: profile maintenance and bug fixes
  only.
- Production is served by the legacy target `sebastian-consulting` with `/de` and `/en`
  prefixes and runtime language middleware (`apps/consulting/functions/bunnyMiddleware.ts`);
  the pathless targets `sebastian-consulting-de` and `sebastian-consulting-en` exist without
  domains.
- Routes: `/`, `/fastner`, `/fastner/projektprofil`, `/werner`, `/privacy`, `/imprint`.
  Content in `apps/consulting/app/data/*.ts` (profiles, featured and additional projects,
  technologies, trusted logos), offers in `apps/consulting/app/content/offers/*.md`,
  catalogs in `apps/consulting/app/locales/*.po` with German as source.
- PDF pipeline: `apps/consulting/scripts/generatePdfs.ts` renders the profile routes and the
  offers with Playwright, blocks external requests, and verifies A4 layout; outputs under
  `public/pdfs/`. Four dashboard edge rules redirect old PDF names until 2027-06-13.
- Booking goes to Terminaro or Calendly links (`apps/consulting/app/lib/untranslated.ts`).
- Information architecture: Services · How we work · Profiles · References · Book a call
  ([overall concept](../concept/overall-concept.md#information-architecture)).
- Personal domains `sebastianwerner.de` and `sebastianfastner.de` still point at the old
  Software site.

## Scope

In scope:

- `apps/consulting` on the shared shell: Home, Services (with the fixed-price offers), How we
  work, Profiles (Werner, Fastner, project profile), References, Contact, Legal.
- Copy of the profile data, offers, and the PDF pipeline from the old repository; the print
  layout is kept, the screen layout follows plan 01.
- English as source: the existing German catalog becomes the translation; the English
  catalog becomes source strings.
- English slugs: `/fastner/project-profile` with a redirect from `/fastner/projektprofil`;
  stable PDF file names.
- Settling the open points for this site with the owners: Rust in the offer, the service
  catalogue, cleared logos and references.
- Cutover: attach `sebastian-consulting.de` and `.com` to the new pathless targets, redirect
  `/de/*` and `/en/*`, the `www.` and profile subdomains, `profile.sebastian-software.de`, and
  the personal domains per [ADR-0010](../adr/0010-url-and-redirect-contract.md).

Out of scope:

- Changing the profile PDFs' document shape; they are a recruiting deliverable.
- Retiring the old repository and targets; that is plan 10.

## Verification commands

| Purpose | Command | Expected result |
| --- | --- | --- |
| Full check | `pnpm agent:check` | exit 0 |
| Variants | `pnpm --filter @sebastian-websites/consulting build:variants` | both variants; PDFs generated and verified |
| PDFs | `pnpm --filter @sebastian-websites/consulting generate:pdf` | A4 checks pass; file names unchanged |
| Redirects | the table-driven redirect tests | every Consulting rule of ADR-0010 passes, including the locale prefixes |
| Smoke after cutover | `curl -sI https://sebastian-consulting.de/de/fastner` | 301 to `/fastner` |

## Steps

### 1. Carry over content and the PDF pipeline

Copy the data files, offers, print components, and the PDF scripts. Allow the font host in the
Playwright request filter. Swap the catalog direction to English source.

### 2. Build the pages

Services, How we work, and References are new pages; write their copy after settling the open
points. Profiles keep their structure on the new shell.

### 3. Redirects and hosting

Add the Consulting rules, including the locale-prefix and subdomain rules, with tests. Reuse
or recreate the pathless targets through the delivery chain; express the PDF-name edge rules
as configuration.

### 4. Cut over

Attach the canonical domains to the new targets, move the personal domains, and verify all
redirect sources. Leave the legacy target in place until plan 10.

## Done criteria

- [ ] Both canonical domains serve pathless pages from the new targets.
- [ ] All profile and offer PDFs are reachable under their existing names.
- [ ] Every redirect source in ADR-0010 for Consulting answers with the documented target.
- [ ] The personal domains land on the Consulting profiles.
- [ ] Legal texts were reviewed before launch.

## Stop conditions

- Stop if the PDF verification fails on the new shell; the print layout must not regress.
- Stop before the cutover if the recruiter-facing project profile is not approved by Fastner.

## Maintenance and review focus

The profiles stay a document-shaped exception inside a marketing site. Reviewers should check
that shell changes do not leak into the print layout and that translations never alter PDF
file names.
