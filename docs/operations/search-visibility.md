# Search visibility baseline and review

Use this procedure for #127 and the content map in
[Search questions and content homes](../concept/search-intent.md). It separates public
delivery, search-engine indexing, acquisition, and outcomes. A page returning HTTP 200 or
appearing in a sitemap does not prove indexing or a ranking.

## Public baseline

The 16 November 2026 public audit inspected Software, Consulting, Open Source, Blog, and
app-tracking in German and English: ten sitemaps and all 56 URLs listed at the time. Those
URLs returned HTTP 200 with self canonicals and German/English language references. The
robots endpoints allowed crawling and referenced their own sitemap. Sampled HTTP/www
redirects and unknown-path 404/noindex behavior were correct.

This is a dated delivery observation, not an index-coverage report. The three new
Consulting service routes add six language-specific URLs after deployment. Recount the
deployed sitemaps rather than treating the original count as a permanent assertion.

## Property and sitemap inventory

First inspect existing Search Console and Bing Webmaster Tools properties. A suitable
verified domain property may already cover its subdomains; do not create one property per
row blindly. The German and English TLDs are separate domains. Record the responsible
account owner in the appropriate private working record.

| Site         | German sitemap                                           | English sitemap                                           |
| ------------ | -------------------------------------------------------- | --------------------------------------------------------- |
| Software     | `https://sebastian-software.de/sitemap.xml`              | `https://sebastian-software.com/sitemap.xml`              |
| Consulting   | `https://sebastian-consulting.de/sitemap.xml`            | `https://sebastian-consulting.com/sitemap.xml`            |
| Open Source  | `https://oss.sebastian-software.de/sitemap.xml`          | `https://oss.sebastian-software.com/sitemap.xml`          |
| Tech blog    | `https://blog.sebastian-software.de/sitemap.xml`         | `https://blog.sebastian-software.com/sitemap.xml`         |
| app-tracking | `https://app-tracking.sebastian-software.de/sitemap.xml` | `https://app-tracking.sebastian-software.com/sitemap.xml` |

For each row and language, record the covering property, verification status, sitemap
submission/status, last successful read, and any access gap. Include Search Console and
Bing separately. Do not store account identifiers, access tokens, private exports, or
ownership-verification secrets in an issue or this repository.

## Initial account inspection

1. Check indexed/excluded pages and the reasons for exclusion. Separate intentionally
   removed URLs, 404s, and the blog's prelaunch publication from acquisition pages that
   should be indexed. Check any manual-action/security notices without assuming one
   exists.
2. Inspect representative URLs: Software home/products, Consulting home/services and the
   three new services after deployment, both people, OSS home, and the blog home plus a
   real article after launch. Include both languages.
3. Record the requested URL, inspection date, last crawl, crawl/index eligibility,
   user-declared canonical, engine-selected canonical, and whether the indexed content is
   current. A live inspection and an index record answer different questions.
4. Compare the engine's observations with the current page, sitemap, meta robots,
   `X-Robots-Tag`, and public edge response. Investigate a concrete discrepancy before
   changing robots or canonical behavior.
5. Submit the correct sitemap where missing. Request individual reinspection/recrawl only
   for a few important corrected pages. Neither action guarantees indexing.

Account inspection was not available to the 16 November audit. Opening Search Console in
the available browser reached its public introduction page rather than a signed-in
property. Property ownership, submission, actual indexing, selected canonicals, query
performance, and Bing account coverage remain **unverified**. Finish these account checks
in #127; this document does not mark that issue complete.

## Acquisition baseline

Use a dated window of recent available history, and record whether it includes a launch,
migration, or substantial content change. Prefer a complete comparable period; label a
short history rather than manufacturing a trend.

Record impressions, clicks, CTR, average position where available, queries, and landing
pages. Separate language/domain, branded and nonbranded queries, and the reader tasks in
the content map. A name query and a consulting decision query should not be averaged into
one success claim. Keep private query-level exports in the existing restricted account or
working record; publish only a useful nonsensitive summary.

Once outcome measurement is available, distinguish an outbound click, a booked
conversation, and a qualified inquiry. Analytics integration is separate work in #35 and
#144. Their availability does not block index inspection or the content map. Search/AI
mentions, visits, and outcomes are separate observations, not causal proof of revenue.

## Review and release checks

Review the baseline monthly while the content is establishing a history, and after a
domain, route, canonical, or publication change. The account owner reviews index/query
data; the content owner checks which questions and proof need improvement. Name these
owners in the working issue rather than inventing assignments here.

Before and after deployment, inspect the changed route's response, initial text, metadata,
canonical, language links, and sitemap inclusion. Reuse repository checks:

```sh
pnpm agent:check
pnpm build
pnpm hosting:plan
```

Consulting's build also verifies its rendered service pages and profile artifacts. The
hosting plan compares both language builds; the live deployment checks do not replace
authenticated URL inspection. Keep a failed delivery check separate from delayed indexing.

Official references: [Search Console properties](https://support.google.com/webmasters/answer/34592),
[URL Inspection](https://support.google.com/webmasters/answer/9012289),
[sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview),
and [Google's AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
