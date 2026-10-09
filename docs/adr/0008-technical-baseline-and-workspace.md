---
status: accepted
updated: 2026-10-06
---

# Technical baseline and workspace layout

All sites share one toolchain: Node 26, pnpm 12, React 19, React Router 8 in framework mode
with prerendering and no server rendering, Vite 8, and TypeScript 6. One root lockfile and the
pnpm workspace catalog pin the versions; an app does not pick a different framework version
without a new decision. Styling uses vanilla-extract, accessible controls come from Base UI,
and icons come from Streamline under the existing Pro licence, in a style still to be chosen.

The workspace has one app per site under `apps/` and shared packages under `packages/`.
Design tokens, the brand bar, the footer, legal texts, web fundamentals (variants, SEO, i18n),
and tooling configuration are shared from the start, because they are designed for three sites
at once. Content components move into a shared package only when a second site needs them.
Apps import packages; packages never import apps.

Builds are orchestrated with pnpm workspace commands, or Turborepo once caching pays off; there
is no custom orchestration script.

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
