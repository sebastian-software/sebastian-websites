# Use Ardo's sitemap and robots file for the Software website

**Plan status:** Implemented
**Source:** effective-flow build
**Recommended workflow:** Feature (`effective-flow build`)

## Requirement

Return the Software website's sitemap to Ardo's standard generation. The Ardo migration
disabled Ardo's sitemap and robots output and wrote both files from `scripts/build.ts`,
using the hand-maintained path list `app/lib/pages.ts`. Every new page or blog article
therefore had to be added to that list by hand. Ardo already builds the sitemap from its
route manifest, using each variant's `siteUrl`, so each domain keeps its own sitemap as
[ADR-0010](../adr/0010-url-and-redirect-contract.md) requires.

Ardo's robots output (`User-agent: *`, `Allow: /`, `Sitemap: <siteUrl>/sitemap.xml`) is the
same file the custom helper wrote, so it moves to Ardo in the same change. The two
language builds remain unchanged.

## Architecture decisions

- Enable `seo.sitemap` and `seo.robots` in `apps/software/vite.config.ts`; keep `llms: false`.
- Exclude the not-found route from the sitemap with `sitemap.exclude`. ADR-0010 and the
  hosting contract keep it out of every sitemap.
- Accept Ardo's default `lastmod`, `changefreq` (`weekly`) and `priority` (`0.7`) entries.
  For TSX routes, `lastmod` is the source file's modification time in the build copy.
- Remove `app/lib/pages.ts`. The browser check reads its page list from the built
  `sitemap.xml`, so the sitemap stays the single source of indexable pages.
- `createSitemap()` and `createRobots()` stay in `web-core`; other apps still use them.

## Affected files

- `apps/software/vite.config.ts`: enable Ardo sitemap and robots, exclude `/404`.
- `apps/software/scripts/build.ts`: stop writing `sitemap.xml` and `robots.txt`.
- `apps/software/scripts/check-browser.ts`: derive checked pages from the build sitemap.
- `apps/software/app/lib/pages.ts`: remove.

## Acceptance criteria

- [ ] `build/software-de/client/sitemap.xml` and `build/software-en/client/sitemap.xml` list
      exactly `/`, `/products`, `/open-source`, `/company`, `/contact`, `/imprint` and
      `/privacy` on their own canonical origin, without trailing slashes, and without `/404`.
- [ ] Both `robots.txt` files allow crawling and name their own domain's sitemap.
- [ ] The hosting SEO build validation (`seoPlanFor` in `hosting/seo.ts`) passes for
      both Software variants.
- [ ] No source file references `app/lib/pages.ts` or writes the sitemap by hand.
- [ ] Typecheck, lint, and format checks pass for `@sebastian-websites/software`.

## Validation plan

- `pnpm --filter @sebastian-websites/software build`, then inspect both sitemaps and robots files.
- Run the hosting SEO validation against both built Software variants.
- `pnpm --filter @sebastian-websites/software agent:check` and `pnpm hosting:check`.

## Open points

- No open points.

## Build completion

**Date:** 2026-11-06

### Implementation details

- `apps/software/vite.config.ts` enables Ardo's sitemap with `exclude: ["/404"]` and Ardo's
  robots file; `llms` stays off. The 404 exclusion comes from the hosting contract in
  `docs/operations/website-hosting.md`; ADR-0010 itself names redirects, aliases and PDFs.
- `apps/software/scripts/build.ts` writes only `manifest.webmanifest` and the hosting 404 copy.
- `apps/software/scripts/check-browser.ts` reads its page list from the built `sitemap.xml`.
- `apps/software/app/lib/pages.ts` is removed; `apps/software/README.md` describes the new source.
- Ardo writes `lastmod` from the build copy's modification time, so each build carries its build
  time. Ardo 6.3.0 has no option to omit `lastmod`.

### Test results

- `pnpm --filter @sebastian-websites/software build`: both variants built; 8 pages prerendered each.
- Both sitemaps list exactly the seven canonical pages on their own origin, without `/404`.
  Both robots files read `User-agent: *`, `Allow: /`, `Sitemap: <origin>/sitemap.xml`.
- `seoPlanFor` passed for `sebastian-websites-software-de` and `sebastian-websites-software-en`.
- `pnpm --filter @sebastian-websites/software agent:check`, `pnpm hosting:check` (35 tests) and
  `pnpm --filter @sebastian-websites/web-core test` (39 tests) passed.
- `check:browser` was not run: Playwright Chromium is not installed in the build environment.
  CI or a local run must exercise the sitemap-driven page list.

## Review findings

**Date:** 2026-11-06
**Reviewer:** none (tooling-only change; technical validation by the code validator)

### Summary

| Status                 | Count |
| ---------------------- | ----: |
| Fixed                  |     1 |
| Open / Not implemented |     0 |

The fixed finding corrected a code comment that attributed the 404 exclusion to ADR-0010.
