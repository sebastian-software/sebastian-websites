# Loading baseline and local measurement

Measured 17 November 2026, 12:28–12:32 UTC. Related: #142.

The public pages loaded within 2.11 seconds at the largest observed LCP in this
small lab sample, with a maximum observed CLS of 0.033. The Software homepage's
photo was the LCP in all six runs while configured as lazy/automatic priority.
This change gives that single image `BunnyImage`'s existing `priority` behavior:
eager loading and high fetch priority. A post-deployment rerun must establish its
actual timing effect.

These are loading observations, **not real-user Core Web Vitals or an INP result**.
The public PageSpeed request returned HTTP 429. Field data could not be retrieved;
its availability and URL/origin sample sufficiency remain unknown.

## Reproduce locally

```bash
pnpm install --frozen-lockfile
pnpm --filter @sebastian-websites/consulting exec playwright install chromium
pnpm --filter @sebastian-websites/consulting measure:performance /tmp/performance-baseline.json
```

Use the pinned Node/pnpm versions. The script runs locally, loads the listed public
URLs, and writes JSON to the chosen path. It uses the repository's existing
Playwright dependency, performs no form submissions, and needs no analytics
account or deployment credentials. It exits unsuccessfully if a navigation fails
or returns a status other than 200; errors remain visible in the report.

An optional second argument adds the first article from a locally served Blog build:

```bash
pnpm --filter @sebastian-websites/consulting measure:performance /tmp/performance-with-article.json http://127.0.0.1:8792
```

That preview must serve `apps/blog/build/blog-de/client` with directory indexes.
The script appends `/posts/ui-strings-and-user-content`. Build and serve the Blog
before starting measurement; keep repository builds and other heavy workloads
stopped during the samples. A local preview's protocol, compression, and hosting
differ from the deployed CDN, so label it separately.

## Conditions

| Setting            | Mobile-sized profile | Laptop profile     |
| ------------------ | -------------------- | ------------------ |
| Viewport           | 390 × 844 CSS px     | 1440 × 1000 CSS px |
| Device pixel ratio | 1                    | 1                  |
| CPU throttle       | 4×                   | 1×                 |
| Download / upload  | 1.6 Mbps / 750 Kbps  | 10 Mbps / 5 Mbps   |
| Added latency      | 150 ms               | 40 ms              |

Chromium 153.0.8010.12, headless, darwin/arm64, `de-DE` locale. Each run uses a
fresh browser context and disables the HTTP cache through CDP. One browser
instance is reused; OS/network/CDN state is not controlled. The mobile-sized
profile retains Chromium's normal desktop user agent and is emulation rather
than a physical phone. Three sequential runs per page/profile produce 48 samples.
No repository builds ran during the baseline.

Observers start before navigation and record through `load` plus three seconds.
LCP uses the browser's latest largest-contentful-paint entry. CLS uses the maximum
shift session with a one-second gap/five-second limit, excluding recent input.
Long-task blocking is the sum of portions above 50 ms in this observation window;
it is **not Lighthouse TBT and does not measure INP**. Script/task durations are
CDP counters for the document's loading window. TTFB is responseStart minus
requestStart, excluding earlier navigation/connection work.

All 48 navigations returned 200, with supported LCP/layout-shift/longtask observers
and a recorded LCP. Raw observations, timestamps, resource timings, responsive
image URLs, loading attributes, preloads, and settings are in
[the JSON evidence](evidence/performance-2026-11-17.json). It records the public
deployment before this PR's image change. The additional local article uses
editorial PR #152 at `e5d360e` and is not yet a public page.

## Samples

LCP values are all three observations in milliseconds. CLS is the maximum across
both profiles; script time is the mobile median, and blocking is the mobile
maximum. The JSON retains FCP, request TTFB, and all individual counter values.

| Target             | Mobile LCP, ms   | Laptop LCP, ms | Max CLS | Mobile script, ms | Mobile blocking, ms |
| ------------------ | ---------------- | -------------- | ------- | ----------------- | ------------------- |
| software-home      | 1860, 1656, 1800 | 836, 584, 576  | 0.0003  | 110               | 28                  |
| software-products  | 1104, 1080, 1072 | 308, 360, 368  | 0.0001  | 104               | 28                  |
| consulting-home    | 1424, 1432, 1444 | 544, 452, 504  | 0.0327  | 104               | 21                  |
| consulting-service | 1240, 1256, 1252 | 372, 380, 344  | 0.0077  | 100               | 18                  |
| consulting-profile | 1988, 2028, 2108 | 400, 376, 384  | 0.0151  | 128               | 20                  |
| opensource-home    | 1652, 1400, 1360 | 320, 316, 332  | 0.0079  | 127               | 16                  |
| blog-home          | 1580, 1032, 1052 | 316, 316, 352  | 0.0003  | 104               | 21                  |
| local-blog-article | 2816, 2804, 2796 | 460, 472, 468  | 0.0006  | 109               | 17                  |

Public targets are `https://sebastian-software.de/` and `/products`,
`https://sebastian-consulting.de/`, `/services/architecture-review`, and `/werner`,
`https://oss.sebastian-software.de/`, and `https://blog.sebastian-software.de/`.
The local article is `http://127.0.0.1:8792/posts/ui-strings-and-user-content`.

## Element and resource findings

- **Software home:** the shared team photo is LCP in all mobile/laptop runs,
  using a 480px / 1280px responsive variant respectively. Mobile image requests
  start at 1228, 1161, and 1164 ms, near FCP, then take 626, 490, and 632 ms.
  The image is `loading="lazy"`, `fetchPriority="auto"`. This is concrete evidence
  for making the existing hero eager/high priority; its dimensions, crop, sources,
  and sizes stay the same. No extra preload is introduced.
- **Consulting home:** the team photo is also LCP, already eager/high priority.
  Mobile LCP is 1424–1444 ms. The largest recorded loading CLS is here, 0.033,
  below the usual 0.1 reference threshold; this bounded observation does not
  establish lifetime stability.
- **Text pages:** the products introduction, architecture-review introduction,
  Werner profile introduction, OSS heading, and Blog heading/empty-state text
  are the recorded LCP elements. Preloading their photographs or logos would
  not target their measured LCP.
- **Fonts:** the public brand font stylesheet imports the shared font stylesheet
  and typography CSS. `document.fonts.status` is loaded at collection in every
  sample. A separate Software-home check confirmed loaded Glober/Elena faces and
  no failed requests. Font-binary/cache behavior was not isolated, so these runs
  do not prove first-ever font-download cost or justify more preloads.
- **Main thread:** mobile script counters are 97–134 ms across public samples.
  The long Werner document has 1336–1415 ms of total CDP task time, compared with
  roughly 283–429 ms on the other public templates. Its observed long-task
  blocking remains 16–20 ms. This identifies a heavier document, without
  establishing an interaction problem or an isolated hydration cause.
- **Unreleased article:** its text heading is LCP at 2796–2816 ms on mobile.
  The local render-blocking entry stylesheet takes about 2.5 seconds in the
  first run, alongside slower local script transfers. The preview uses an
  uncompressed HTTP/1 server, unlike production. Treat this as a preview warning
  to remeasure on the CDN after launch, rather than a demonstrated production
  font or hydration regression.

## Actions and verification

1. **Small, supported correction:** prioritize only the Software homepage LCP
   photo. Both language builds must render it eager/high with unchanged sizing.
   After deployment, repeat the same six homepage samples; compare image-request
   start and LCP distributions, checking that text rendering/CLS do not regress.
   The baseline does not claim a measured improvement before that release.
2. **Blog release check (#22):** repeat the real article on its public URL once
   deployed. If the text still paints late, inspect the render-blocking stylesheet,
   font chain, and transfer sizes on the actual CDN before choosing a fix.
3. **Interaction follow-up:** test real navigation/menu/long-profile interactions
   and obtain field data when access permits. No broad code split, font preload,
   or framework rewrite is supported by the current loading observations.

The [LCP](https://web.dev/articles/lcp), [CLS](https://web.dev/articles/cls), and
[INP](https://web.dev/articles/inp) references distinguish laboratory observations
from the 75th percentile of real users. This report does not apply field
pass/fail labels to three loading runs.

## Future Therion collection

Keep this baseline independent of Therion. Once a reviewed collector interface
exists, consider one final LCP/CLS/INP observation per navigation, with metric
name/value, page template, release identifier, and relevant device class. Define
the consent behavior, endpoint contract, retention, and aggregation before adding
collection. Avoid full query strings, user content, persistent identifiers, and
duplicate events; flush on the appropriate page lifecycle boundary. Field p75
needs sufficient comparable samples and must remain separate from lab results.
No client collector or guessed Therion integration is added here.
