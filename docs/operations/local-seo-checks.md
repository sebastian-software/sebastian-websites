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

`seo:check` runs `pnpm build` followed by `pnpm hosting:plan`:

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

The command builds and inspects files in the checkout. It does not deploy or
require Bunny API credentials. A successful run establishes document and link
correctness for the build, not search indexing, rankings, or AI citations.

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
