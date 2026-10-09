---
status: accepted
updated: 2026-10-07
---

# Brand assets and font CSS live here; font definitions and binaries share the asset CDN

Logos, colour tokens, and the brand reference page move from the separate `sebastian-brand`
repository into this monorepo as `apps/brand`, published at `brand.sebastian-software.com`.
That site replaces the Vercel reference page that READMEs link to and serves tokens and SVGs by
URL with open CORS, so external consumers such as the presentation template and project sites
need no package. The private npm package `@sebastian-gmbh/assets` is retired.

Licensed font binaries stay outside this public repository
([ADR-0012](0012-public-repository.md)). WOFF2 files are uploaded manually to
`fonts/` in the shared asset zone of ADR-0014. They need no dedicated publishing repository
or CI pipeline. The private `sebastian-fonts` checkout retains the source files and licenses.

The CSS is technical source code and belongs in Git. One `assets/fonts/fonts.css`
includes all 26 Glober and full-featured Elena faces and declares their subset rules,
relative binary URLs, and simple family variables with system fallbacks. CI publishes
it to `fonts/` on the shared asset CDN without deleting its manually managed files.
It contains no brand-specific adjustments or utility classes.

`apps/brand/public/fonts.css` imports the asset stylesheet followed by
`typography.css`, which owns fallback metrics, adjusted family stacks,
semantic aliases, and typography utilities. These entry points are versioned here and
deployed with the brand site. Consumers can use either the standalone asset definitions
or the brand typography layer. Font binaries have immutable URLs, while CSS can evolve
through reviewed changes.
There is no separate core/all selection or per-family stylesheet. Declaring unused
faces does not download their binaries.
Glober and Elena use their explicit family and face names. Latin and extended WOFF2
subsets together preserve the Unicode coverage of each licensed original; CSS loads
rare characters only when needed. The reproducible preparation tool and delivery
contract are documented in [font hosting](../operations/font-hosting.md).

This supersedes the earlier separate font-host deployment. After the consumers migrated,
the old DNS record and pull zone were removed and the private publishing repository was
archived. The old storage remains a private backup; no licensed binary is copied into
the public tree.

## Considered options

- **Keep the brand repository and its private package.** Rejected: the package was private
  only because of the fonts, and a separate repository for a handful of SVGs and CSS files is
  more effort than it is worth.
- **Bundle the fonts into each site from a private package.** Rejected in favour of one shared
  copy on the CDN.

## Consequences

- The brand site is English only, is not part of the brand bar, and does not count as one of
  the three sites.
- The README theme's logo link and every README that points to the Vercel page move to
  `brand.sebastian-software.com` before the old repositories are archived.
- PDF rendering of the Consulting profiles must allow requests to the font host.
- Asset publishing never deletes unrelated files uploaded manually into the shared zone.
