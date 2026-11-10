---
status: accepted
updated: 2026-11-10
---

# Technical baseline and workspace layout

All sites share one toolchain: Node 26, pnpm 12, React 19, Ardo with static prerendering,
Vite 8, and TypeScript 6. One root lockfile and the
pnpm workspace catalog pin the versions; an app does not pick a different framework version
without a new decision. Styling uses vanilla-extract, accessible controls come from Base UI,
and icons come from Streamline under the existing Pro licence, in a style still to be chosen.

The workspace has one app per site under `apps/` and shared packages under `packages/`.
Design tokens, the brand bar, the footer, legal texts, web fundamentals (variants, SEO, i18n),
and tooling configuration are shared from the start, because they are designed for three sites
at once. Content components move into a shared package only when a second site needs them.
Apps import packages; packages never import apps.

Builds are orchestrated with pnpm workspace commands, or Turborepo once caching pays off; thin website scripts select the two domain builds and invoke app-owned data or
PDF steps. Ardo owns rendering and compilation.

## Considered options

- **Keep lucide icons** as the old Consulting site did. Rejected in favour of the licensed
  Streamline set.
- **Share code only once two sites need it**, the July 2026 rule. Kept for content components,
  dropped for the shell, because a shell designed for three sites is shared by definition.

## Consequences

- Node 26 is not yet an LTS release at the time of writing; CI, deployment scripts, and Playwright
  must be verified against it.
- Whether the icon pipeline runs through our own effective-icon depends on its support for a
  custom Streamline pack; that is decided during implementation.

## Ardo integration

[ADR-0019](0019-software-site-on-ardo.md) defines the common Ardo integration,
source workspace boundaries, and native navigation for every implemented site.
