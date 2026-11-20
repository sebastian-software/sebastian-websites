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
`build/evidence`. The home check also captures artwork scrolling under the
sticky header. CI saves the home, products, company and scrolled views in
`software-layout`.

### Visual comparisons

`pnpm --filter @sebastian-websites/software check:visual` compares the PNGs
from `check:browser` using Playwright Test. It covers the German homepage at
desktop and phone widths and one scrolled desktop view. Each snapshot allows
up to 150 differing pixels after Playwright's perceptual color threshold of
0.1. The HTML report contains the reference, the new image and the diff
when a comparison fails. Find it in `build/visual-report` or the CI artifact
`software-visual-diff`.

Pull requests also compare these views against the reference images on the
PR base, so changes remain visible when the PR updates its reference set.
For changed views, `pr-visual-review` contains annotated before-and-after
pairs, a Markdown section and the technical Playwright report. Open the
technical report during self-review and use the paired PNGs for the PR
description. Compare affected pages outside these three views separately.

Use `review:visual` to render pairs from a local Playwright comparison.
Set `SOFTWARE_VISUAL_BOXES` to `effective-web/scripts/visual-change-boxes.mjs`.
The command reads `build/visual-results` and writes `build/visual-review`.
To frame a whole card or section, set `SOFTWARE_VISUAL_REGIONS` to a JSON
file keyed by snapshot name without its extension. Each value is an array of
regions with a `label` and `before` and `after` rectangles in image pixels.
Each rectangle has `x`, `y`, `width` and `height`. Choose the rectangles
from the corresponding page captures, then inspect the rendered pair.

CI runs on Ubuntu 26.04 with the locked Playwright Chromium. For an intentional
change, review the diff and copy the approved PNGs from that run's
`software-layout` artifact into `scripts/visual-reference/` in the same change.
The initial references came from the
[CI run for `8baece3`](https://github.com/sebastian-software/sebastian-websites/actions/runs/44639455902).

For a local before-and-after comparison, save the original `build/evidence`
directory, rebuild and recapture, then point `SOFTWARE_VISUAL_REFERENCE` to
the saved directory. Use the same browser and operating system for both
captures. `SOFTWARE_VISUAL_EVIDENCE` can point at a different candidate
directory. Set `SOFTWARE_VISUAL_VIEWS` to the comma-separated PNG filenames
when comparing additional views. Use the same name in both directories in
the form `site-language-width-view.png`, for example `software-de-1440-products.png`.

Set `SOFTWARE_BASELINE_ROOT` to an earlier build directory containing
`software-de/client` and `software-en/client` to also compare metadata, layout,
images, and representative five-load LCP/CLS measurements in the same browser.

Internal navigation loads a new document. Newsletter input and feedback can reset
when leaving a page. Ardo's current browser error recovery remains in use;
optional upstream issue #498 is not required to build or run this website.
