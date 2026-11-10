# Software website

Ardo renders the German and English websites from custom TSX routes. The
shared frame, content, legal documents, images, and cross-domain language links
are preserved. See [ADR-0019](../../docs/adr/0019-software-site-on-ardo.md) for the
framework and package-boundary decisions.

Run these commands from the repository root with its configured Node and pnpm:

```sh
pnpm --filter @sebastian-websites/software dev
pnpm --filter @sebastian-websites/software build
pnpm --filter @sebastian-websites/software check:browser
```

Development defaults to English. For German, use
`pnpm --filter @sebastian-websites/software dev software-de`. Changes to app
source and shared workspace components are handled directly by Ardo and Vite.
There is no copied application or separate filesystem watcher.

The repository checks audit translations. The build fetches one metrics snapshot
and runs ordinary Ardo builds for each language, directly from source. It writes
`build/software-de/client` and `build/software-en/client`. Ardo generates each
domain's sitemap from its routes, leaving out `/404`, and its robots file. The
build adds the manifest and the hosting-compatible `404/index.html`.

Browser checks require Playwright Chromium (`pnpm --filter
@sebastian-websites/software exec playwright install chromium`). They exercise
every page in each built variant's sitemap and write screenshots under
`build/evidence`. Set `SOFTWARE_BASELINE_ROOT` to an earlier build directory containing
`software-de/client` and `software-en/client` to also compare metadata, layout,
images, and representative five-load LCP/CLS measurements in the same browser.

Internal navigation loads a new document. Newsletter input and feedback can reset
when leaving a page. Ardo's current browser error recovery remains in use;
optional upstream issue #498 is not required to build or run this website.
