---
status: accepted
updated: 2026-10-06
---

# Brand assets and typography CSS live here; font binaries are served from the shared asset CDN

Logos, colour tokens, and the brand reference page move from the separate `sebastian-brand`
repository into this monorepo as `apps/brand`, published at `brand.sebastian-software.com`.
That site replaces the Vercel reference page that READMEs link to and serves tokens and SVGs by
URL with open CORS, so external consumers such as the presentation template and project sites
need no package. The private npm package `@sebastian-gmbh/assets` is retired.

Licensed font binaries stay outside this public repository
([ADR-0012](0012-public-repository.md)). WOFF2 files are uploaded manually to
`fonts/` in the shared asset zone of ADR-0014. They need no dedicated publishing repository
or CI pipeline. The private `sebastian-fonts` checkout retains the source files and licenses.

The CSS is technical source code and belongs in Git. `apps/brand/public/fonts.css` (eight
core Glober and Elena faces), `fonts-all.css` (all 29 faces), and `typography.css` (fallback metrics, family
stacks, and typography utilities) are versioned here and deployed with the brand site.
Every site and external consumer can load that CSS; its font URLs point to the shared
asset host. Font binaries have immutable URLs, while CSS can evolve with the websites.
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
  the four sites.
- The README theme's logo link and every README that points to the Vercel page move to
  `brand.sebastian-software.com` before the old repositories are archived.
- PDF rendering of the Consulting profiles must allow requests to the font host.
- Asset publishing never deletes unrelated files uploaded manually into the shared zone.
