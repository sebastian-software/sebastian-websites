# App Tracking browser diagnostics

Run `pnpm --filter @sebastian-websites/app-tracking check:browser` after building
the App Tracking and Software variants. The browser check writes policy-anchor
diagnostics to stdout, which CI retains without an artifact upload.

- `POLICY_ANCHOR_PASS` records the original anchor assertion's observation.
- `POLICY_ANCHOR_FAILURE` precedes rethrowing the original case error. Its
  `assertion` contains the exact section/header rectangles used for the boolean
  comparison, plus the heading and document snapshot. Earlier navigation or
  evaluation failures receive a best-effort snapshot instead.
- `POLICY_ANCHOR_OBSERVATION` labels a separate fresh-mobile page after the
  original mobile observation. It supplies no assertion result.
- `POLICY_ANCHOR_DIAGNOSTIC_ERROR` reports best-effort collection or cleanup
  failures without replacing an existing browser-check failure.

Pass, failure and observation JSON lines identify the locale, viewport, page
and case. General installation or cleanup diagnostics may omit that context.
Original cases also identify the navigation attempt. Compare `snapshot.documentId` and
`timeOrigin` across desktop/mobile to detect document reuse, including same-URL
navigation. Document snapshots contain viewport-relative section/heading/header
rectangles, URL/hash (without query parameters), ready state, font status and
observed readiness time, scroll position/padding, and navigation timing.

Each document retains its latest 24 passive lifecycle/font/resize/scroll events,
with total/dropped counts; strings are limited to 240 characters. Each original
case retains up to eight navigation-stage records. Font readiness is observed
without waiting for it. Diagnostics contain no storage, cookies, response bodies
or report data, and do not establish the cause of an anchor failure.
