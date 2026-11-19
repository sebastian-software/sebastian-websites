# Run SEO checks locally

Use the project's existing build and release checks as a local technical SEO
checker. They need no analytics account or paid crawling service.

```bash
pnpm install --frozen-lockfile
pnpm --filter @sebastian-websites/consulting exec playwright install chromium
pnpm seo:check
```

Use the Node and pnpm versions in `mise.toml` / `package.json`. Chromium is used
for the Consulting PDFs and built-page checks. The build can fetch public fonts
and assets; “local” does not mean that every dependency is available offline.

`seo:check` runs `pnpm build`, `pnpm hosting:plan`, and `pnpm seo:audit`:

- Ardo builds the static pages and checks internal links against the generated
  routes and anchors. A broken source link fails its owning build.
- The hosting check compares the two languages of every site and validates
  sitemap contents, self canonicals, reciprocal hreflang, document language,
  robots behavior, and the intentional single-language publication rules.
- Indexable acquisition pages require one nonempty title and description.
  Conflicting head tags fail. Legal descriptions remain optional; 404 and dark
  publication pages retain their separate indexing rules.
- Consulting's built-profile check verifies the known locale regression and
  matching search / Open Graph / Twitter descriptions in both languages.
- Build and image manifests are checked before the command reports that the
  output is ready for the deployment pipeline.
- Lighthouse CI audits representative indexable pages in local Chromium. Its
  applicable automated SEO checks must pass, including metadata, crawlability,
  link text/links, image alternatives, status, hreflang, and canonical checks
  implemented by the pinned Lighthouse version.

The command builds and inspects files in the checkout. It does not deploy or
require Bunny API credentials. A successful run establishes document and link
correctness for the build, not search indexing, rankings, or AI citations.

## Browser SEO audit

Run `pnpm seo:audit` on existing builds, or focus it with
`pnpm seo:audit software-de software-en`. Install the root browser with
`pnpm exec playwright install chromium`. It reuses the workspace Playwright version.

The sample covers every built site's homepage, Software products, Consulting's
architecture-review service and long Werner profile, and the first indexable
blog article when one exists: 16 pages before blog launch, 18 with the first
paired article. The existing hosting/fixture checks own intentional dark, draft,
future, absent-language, legal, and 404 publication behavior; those routes are
outside the browser sample. Planned variants without a build are not audited.

Each page gets one mobile Lighthouse SEO run. Performance and accessibility
scores are not collected or gated here. A failing SEO result fails the command;
remaining variants still run to preserve their reports.

HTML/JSON reports and a URL manifest are written under
`build/lighthouse/<variant>/reports/`. Rerunning a variant replaces its generated
directory. Files are served locally, without deployment or API keys; public
fonts/assets can still require network access. Results stay on disk. CI keeps
the `lighthouse-seo` GitHub artifact for 14 days, including failed-audit reports;
no Lighthouse cloud upload is used.

The [tool selection record](seo-tool-selection.md) documents adoption,
maintenance, and the static-build comparison behind this first integration.

## Focused checks

| Task                                                                         | Command                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Recheck already built variants                                               | `pnpm hosting:plan`                                             |
| Change the SEO validator itself                                              | `pnpm hosting:check`                                            |
| Verify blog drafts, scheduling, language pairs, and images with test content | `pnpm --filter @sebastian-websites/blog check:fixtures`         |
| Exercise the built blog fixtures in Chromium                                 | `pnpm --filter @sebastian-websites/blog check:browser:fixtures` |
| Run the complete repository gate after a code change                         | `pnpm agent:check`                                              |

Structured-data and author-link behavior is covered by the identity package's
unit and fixture/browser checks. Performance sampling is a separate loading
experiment; the measurement report records its actual conditions and limits.

For the currently deployed site, `pnpm hosting:smoke <variant>` checks public
HTTP behavior, including redirects. Run it after the matching deployment: an
unreleased branch's expected redirect behavior can differ from production.
Search Console/Bing data, external link availability, and actual AI answers
need their own public or authenticated observations. They cannot be inferred
from static HTML alone.
