---
status: accepted
updated: 2026-10-06
---

# Brand assets live here as brand.sebastian-software.com; the fonts live in a private repository and are served from the CDN

Logos, colour tokens, and the brand reference page move from the separate `sebastian-brand`
repository into this monorepo as `apps/brand`, published at `brand.sebastian-software.com`.
That site replaces the Vercel reference page that READMEs link to and serves tokens and SVGs by
URL with open CORS, so external consumers such as the presentation template and project sites
need no package. The private npm package `@sebastian-gmbh/assets` is retired.

The licensed typefaces are the one thing that must not be public
([ADR-0012](0012-public-repository.md)). They live in a separate private repository whose CI
uploads the woff2 files to Bunny storage, served under a fixed host such as
`fonts.sebastian-software.com`. Every site, the brand site, and the presentation template load
them by URL: one copy, cached across all sites.

## Considered options

- **Keep the brand repository and its private package.** Rejected: the package was private
  only because of the fonts, and a separate repository for a handful of SVGs and CSS files is
  more effort than it is worth.
- **Bundle the fonts into each site from a private package.** Rejected in favour of one shared
  copy on the CDN.

## Consequences

- The brand site is English only, is not part of the brand bar, and does not count as one of
  the four sites.
- The README theme's logo link and every README that points to the Vercel page move to
  `brand.sebastian-software.com` before the old repositories are archived.
- PDF rendering of the Consulting profiles must allow requests to the font host.
