# Build the shared foundation: workspace, packages, variants, delivery

## Status

- Priority: P1
- Effort: L
- Risk: MEDIUM (everything else builds on it; the delivery chain touches production hosting)
- Depends on: 01 for the look of the shell; the mechanics can start earlier
- Planned at: f007192, 2026-10-06
- Working state: clean

## Why this matters

Four sites in eight variants need one workspace, one shell, one variant model, and one way to
publish. [ADR-0008](../adr/0008-technical-baseline-and-workspace.md) and
[ADR-0009](../adr/0009-delivery-model.md) fix the shape; this plan builds it once so each site
plan only adds an app.

## Current state

- This repository holds documents only (`README.md`, `GLOSSARY.md`, `docs/`).
- The Consulting repository is the reference to copy from. Proven, non-visual parts and their
  locations in `/Users/sebastian/Workspace/sebastian-consulting.de`:
  - `packages/config`: TypeScript, ESLint and Oxlint, Prettier, Vitest configuration; the
    affected-workspace runner and the workspace boundary checker.
  - `packages/web-core/src/siteMatrix.ts`: the typed variant list with canonical origin,
    hosting target, and production flag; validation of language pairs and TLDs.
  - `packages/web-core/src/seo.ts` and `apps/consulting/scripts/generateSitemap.ts`:
    canonical, hreflang, x-default, sitemap, and robots generation.
  - `packages/legal`: imprint and privacy documents with a typed per-site configuration.
  - `scripts/buildSiteVariants.ts`, `scripts/printProductionMatrix.ts`: variant builds and the
    CI job matrix (to be replaced by pnpm filters or Turborepo, see ADR-0008).
  - `.github/workflows/deploy.yml`, `.github/workflows/preview-cleanup.yml`,
    `apps/consulting/functions/previewMiddleware.ts`, `.github/scripts/*`: verify, preview
    per pull request with an HMAC-gated preview zone, production deploy per variant, and
    preview cleanup.
  - `docs/operations/consulting-preview.md` and
    `docs/operations/consulting-build-deployment-inventory.md`: the Bunny resources and the
    dashboard-only rules that must become configuration in this repository.
- The hosting CLI is the private `@sebastian-gmbh/hosting` (source in the private
  `ssoft-hosting-setup` repository); installation needs `NPM_PRIVATE_PACKAGE_TOKEN`.
- Palamedes: catalogs per app, English as source, `.mdx` compiled by Palamedes; see
  `/Users/sebastian/Workspace/palamedes/docs/mdx.md`. The Consulting repository pins
  `@palamedes/*` 1.12.0; current is 1.25.x.
- Org standards: the `standards` CLI stamps `.repometa.json` and seeds shared configuration
  (`/Users/sebastian/Workspace/standards/README.md`).

## Scope

In scope:

- Workspace: `pnpm-workspace.yaml` with catalog, root `package.json` (`pnpm@12`, Node 26
  engines), `.node-version`, `.repometa.json` via `standards init --visibility oss`.
- `packages/config`, `packages/tokens` (brand hues, roles, spacing, type scale from plan 01),
  `packages/ui` (brand bar, footer, page shell, primitives on Base UI, icons via Streamline),
  `packages/legal`, `packages/web-core` (variants, SEO, Palamedes setup, metrics client with
  build-time snapshot).
- The variant list with eight variants plus the English-only brand site, and the rule that
  legal texts, navigation, and the primary call to action must be complete in both languages.
- One placeholder app that renders the shell in both languages, used to prove the chain.
- CI: `pnpm agent:check`, variant builds, previews per affected variant, production deploy per
  variant, hosting configuration applied from the repository.

Out of scope:

- Any real site content; that is plans 06 to 09.
- The fonts host and the brand site; that is plan 03. Until then the shell loads fonts from
  the private package as the Consulting repository does.

## Verification commands

| Purpose | Command | Expected result |
| --- | --- | --- |
| Full check | `pnpm agent:check` | exit 0 |
| Build one variant | `pnpm --filter @sebastian-websites/placeholder build:variant -- placeholder-en` | `dist/placeholder-en/index.html` exists with `lang="en"` |
| Preview chain | open a pull request | preview URL commented on the pull request and reachable |

## Steps

### 1. Scaffold the workspace

Create the root files, run `standards init`, add the catalog with the ADR-0008 baseline, and
make `pnpm install` succeed on Node 26. Verify the hosting CLI and Playwright run on Node 26;
if not, stop (see Stop conditions).

### 2. Copy and adapt the non-visual packages

Bring over `config`, `web-core`, and `legal` from the Consulting repository as copies, rename
the scope to `@sebastian-websites/*`, remove Consulting-specific pieces, and extend the
variant list to four sites plus the brand site. Add the translation-completeness check for
legal texts, navigation, and primary calls to action.

Verify: `pnpm agent:check` -> exit 0

### 3. Build tokens and the shell

Implement `packages/tokens` and `packages/ui` from the approved drafts of plan 01: brand bar
(two groups, language switch, collapsed form), footer, page shell, primitives. Fixtures render
the shell for all four site contexts in both languages.

Verify: `pnpm --filter @sebastian-websites/ui test` -> fixtures pass

### 4. Add the placeholder app and the build

One app using the shell, prerendered in `de` and `en` through Palamedes with English source.
Builds run through pnpm filters; add Turborepo only if build times justify it.

### 5. Deliver

Port the deploy and preview workflows. Create the Bunny targets for the placeholder, express
the preview zone, redirects, and cache lifetimes as configuration in the repository, and apply
them through the hosting CLI. If the CLI cannot apply a needed setting, extend the CLI (it is
ours) rather than configuring the dashboard by hand.

## Done criteria

- [ ] `pnpm agent:check` passes on a clean checkout with Node 26 and pnpm 12.
- [ ] The placeholder renders the shell in both languages from one English source.
- [ ] A pull request produces a preview; a push to `main` publishes the placeholder variants.
- [ ] Every Bunny setting in use is defined in the repository.
- [ ] No Consulting-specific code was copied along.

## Stop conditions

- Stop if the hosting CLI or Playwright does not run on Node 26; decide with the owners
  whether to fix the tool or pin Node 24 for now (ADR-0008 would change).
- Stop if Palamedes cannot compile `.mdx` on the chosen Vite version; ADR-0004 expects it.
- Stop before creating any Bunny resource whose name or domain is not in the variant list.

## Maintenance and review focus

The variant list is the contract every later plan extends. Reviewers should check that no app
code leaks into packages, that the completeness check cannot be bypassed, and that secrets
appear only as CI variables.
