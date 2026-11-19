# External SEO check selection

Evaluated 17 November 2026 for the first external browser SEO check.

## Adoption and maintenance evidence

This snapshot uses public GitHub metadata, releases, merged changes, and npm's
download API. Stars/forks indicate interest; downloads include CI repeats and
are not counts of distinct users. Commit volume alone does not prove quality.

| Candidate                                                                     | Stars / forks | Latest release                                                                                          | Maintenance and fit                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)                | 7,153 / 734   | [0.16.1, 11 November 2026](https://github.com/GoogleChrome/lighthouse-ci/releases/tag/v0.16.1)          | Project since 2019 in GoogleChrome. Recent merged maintenance on 12 November; the release includes CLI correctness fixes. Direct static-directory support, assertions, local reports, and CI integration. Selected.   |
| [Unlighthouse](https://github.com/harlan-zw/unlighthouse)                     | 4,954 / 183   | [0.19.1, 3 October 2026](https://github.com/harlan-zw/unlighthouse/releases/tag/v0.19.1)                | Project since 2021, with recent fixes and merged contributions. Credible alternative for whole-site discovery and an interactive dashboard. Our explicit build/template sample fits Lighthouse CI's collection model. |
| [SiteOne Crawler](https://github.com/janreges/siteone-crawler)                | 1,015 / 97    | [2.5.1, 27 June 2026](https://github.com/janreges/siteone-crawler/releases/tag/v2.5.1)                  | Project since 2023; default-branch fixes observed in September. Rust crawler with optional browser support, useful for broader site exploration.                                                                      |
| [CodoSEO](https://github.com/SafrowLabs/CodoSEO)                              | 14 / 0        | [0.0.1, 5 October 2026](https://github.com/SafrowLabs/CodoSEO/releases/tag/v0.0.1)                      | Repository created in October 2026. Active work, but a short public history and little adoption evidence. Interesting SEO/AI-access checks; not selected as a release dependency.                                     |
| [Search Quality Kit](https://github.com/silesiansolutions/search-quality-kit) | 2 / 0         | [0.14.1, 29 October 2026](https://github.com/silesiansolutions/search-quality-kit/releases/tag/v0.14.1) | Repository created in July 2026, with dependency updates on the evaluation day. Relevant static-build rules, largely overlapping our existing gate; limited public adoption evidence.                                 |

For 10–16 November 2026, npm reports 2,750,059 downloads of `@lhci/cli` and
158,960 of `@unlighthouse/cli`. Reproduce through npm's public endpoints:

- `https://api.npmjs.org/downloads/point/last-week/@lhci/cli`
- `https://api.npmjs.org/downloads/point/last-week/@unlighthouse/cli`

The rolling interval will change. These signals support an established
Lighthouse integration; they do not guarantee future development investment.

## Integration

Pin development dependency `@lhci/cli` to 0.16.1. It uses Lighthouse 13.6.0 and
supports Node 22.19+, including this repository's pinned Node 26. Reuse the
workspace Playwright Chromium installation. No account, API key, database,
browser service, or publicly deployed preview is needed.

The [official configuration](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html)
supports local static directories, explicit URLs, a chosen Chrome executable,
audit assertions, and filesystem reports. Our small wrapper supplies the
existing variant/publication plan and report directories; Lighthouse performs
the browser audits.

Require all applicable automated Lighthouse SEO checks to pass on a bounded
sample of representative templates in both languages. The existing gate keeps
checking every indexable document and the cross-domain language, sitemap,
redirect, and deliberate exclusion contracts. Performance and accessibility
checks remain separate, avoiding a timing threshold in this SEO gate.

See [local commands and report locations](local-seo-checks.md).

### Dependency constraints

The introduction audit found affected `basic-ftp` and `zod` versions on the new
Lighthouse dependency paths. Narrow parent/version overrides select
`get-uri@8.0.1 → basic-ftp@6.2.4` and
`chromium-bidi@157.0.8090-0 → zod@4.6.6`. They do not update the unrelated
existing lint/test dependency paths.

The [basic-ftp 6.0 change](https://github.com/patrickjuchli/basic-ftp/releases/tag/v6.0.0)
disables separate FTP transfer hosts by default. The parent's Client API calls
remain available; our audit uses local HTTP and no FTP proxy. The
[6.2.4 release](https://github.com/patrickjuchli/basic-ftp/releases/tag/v6.2.4)
and [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) identify the
patched versions. Recheck and remove the overrides when upgrading Lighthouse CI
to a release whose dependency graph supplies those fixes itself.

## GEO scope

This checks technical search foundations in the delivered browser document.
It does not measure actual AI mentions, citations, answer correctness, or
acquisition. A locally computed GEO score cannot establish those outcomes.

[Google's AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features)
prescribes ordinary search eligibility and useful content, with no special AI
file or schema prerequisite. Real-answer observations need their own repeated
method and engine access. This integration adds no `llms.txt` requirement or
speculative content-scoring gate.
