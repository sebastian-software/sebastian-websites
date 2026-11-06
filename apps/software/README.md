# Software website

Ardo 6.3.0 renders the German and English websites from custom TSX routes. The
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
source, public files, Vite configuration, and the macro plugin are mirrored into
the generated Ardo project. Restart development after editing shared packages so
their JavaScript and CSS artifacts are rebuilt.

The build audits translations and fetches one metrics snapshot before rendering.
It compiles the shared dependency packages, stages regular installed packages
under `.variant-build`, and runs unchanged Ardo for each language. It writes
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
