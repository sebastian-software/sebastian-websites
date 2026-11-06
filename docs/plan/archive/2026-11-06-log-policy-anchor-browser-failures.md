# Log policy anchor browser failures

**Plan status:** Implemented

**Source:** Existing App Tracking browser-check failure at PR108, the investigation report dated 2026-11-06, `apps/app-tracking/scripts/check-browser.ts`, and the supplied execution receipt.

**Recommended workflow:** `effective-flow build` after explicit plan approval; this plan is limited to the diagnostic logging phase.

**Issue:** PR108's CI failure in `checkOfficialPolicy()` reports only that the policy section top failed the comparison against the header bottom. The failing locale, viewport, navigation lifecycle, and geometry are absent, so the root cause remains unknown. The parent delivery outcome is to make PR108's next run diagnostically actionable; this plan does not change its body or merge gate.

## Requirement

Add diagnostic logging only around the existing Software privacy-fragment check so a subsequent failure emits the causal state needed to distinguish navigation/layout timing, viewport reuse, and other observed conditions. Preserve the existing assertions, thresholds, viewport sequence, wait conditions, product navigation, and CSS. Do not fix the behavior, add the proposed upper-bound assertion, add font waits, change scroll offsets, or introduce telemetry, payload capture, new dependencies, or a workflow upload requirement.

## Outcome checkpoint

**Primary source:** `apps/app-tracking/scripts/check-browser.ts` and `investigation-2026-11-06-policy-anchor-browser-check-failure.md`.

**Original outcome:** Capture enough bounded, static browser state for both locale and viewport cases to explain the next failure while retaining the original failure condition and error.

**Last evaluated attempt:** Local full check passed; the CI failure was not reproduced. The prior observer was cancelled before execution because runtime slots were unavailable.

**No-progress count:** 0.

**Cumulative approach:** Read-only investigation established the exact assertion and its evidence gap; no implementation or product behavior has been changed.

**Continuation decision:** Implement the smallest stdout-visible trace in the existing check, then validate its failure path without shipping a permanent forced-failure switch.

## Architecture decisions

- Keep instrumentation in `check-browser.ts` unless a narrowly focused helper makes the trace clearer; do not create a telemetry service or general logging framework.
- Use a bounded in-memory trace with small structured JSON records written to the console. CI already retains stdout, so logs remain available when an assertion throws.
- Observe state through existing Playwright page/context APIs and static DOM geometry. Do not inject behavior-changing scripts, add waits or delays, or expose tokens, PII, report payloads, or application state.
- Snapshot the failing condition before any supplementary diagnostics. Diagnostic collection is best effort and must never replace the original assertion error; cleanup failures and trace failures are reported separately only when they do not obscure the original failure.
- Keep success output concise. Any local JSON or screenshot evidence is optional, best effort, and must use the existing ignored `apps/app-tracking/build/evidence` area without making CI artifact upload part of the minimal change.

## Affected files

| File                                         | Description                                                                                                                   |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `apps/app-tracking/scripts/check-browser.ts` | Add the bounded policy-navigation lifecycle and failure trace while preserving all current checks and control flow semantics. |
| Optional focused helper beside the script    | Only if extracting serialization/trace formatting materially improves clarity without expanding scope.                        |
| Optional `apps/app-tracking/README.md`       | Document the structured diagnostic output contract only if maintainers need a stable interpretation guide.                    |

## Implementation details

### Approach

1. Define the trace shape and a bounded recorder for one `checkOfficialPolicy()` case. Include locale, named viewport dimensions, and a case label distinguishing the existing reused-page desktop-to-mobile sequence from any separately labeled fresh-mobile observation.
2. Record lifecycle timestamps and events for navigation start, response/navigation outcome, DOMContentLoaded, load, font readiness/status, and assertion time. Record fresh-versus-reused page/document identity, URL and hash, `readyState`, and `scrollY`.
3. At the assertion boundary, collect viewport-relative rectangles for the target section, its heading, and the header, plus computed root `scroll-padding` and relevant font status. Keep values JSON-safe and bounded.
4. Evaluate the existing lower-bound condition exactly as it does today. On failure, synchronously preserve the actual failed geometry and emit the structured trace before supplementary actions; rethrow or report the original assertion failure unchanged. On success, retain only concise logging and continue the existing axe and screenshot checks.
5. Keep the original viewport iteration, `networkidle` navigation, thresholds, waits, navigation URL, assertions, and cleanup unchanged. If optional evidence files are attempted, catch their failures and preserve the original test result and failure context.
6. Add a validation-only, isolated fault-injection path in the check's execution procedure (not a permanent environment switch and not a changed assertion) that deliberately exercises the diagnostic failure handler, confirms JSON output contains the actual failed geometry and case context, and then removes/restores the probe before normal execution.

### Edge cases

- If navigation, page evaluation, font inspection, serialization, or logging fails, emit the available bounded state and retain the first/original assertion or navigation error as the authoritative failure.
- If the reused page changes document identity or viewport state unexpectedly, label that observation rather than resetting it or substituting a fresh page for the original case.
- A fresh-mobile comparison may be added only as a separately labeled diagnostic observation; it must not replace or alter the original desktop-to-mobile sequence.
- Missing optional local artifact directories or write permissions do not block stdout diagnostics and do not turn a passing or failing browser result into a different product verdict.
- The trace must not include storage contents, cookies, network bodies, tokens, personal data, or report data; rectangles and computed style values remain static geometry/state only.

## Acceptance criteria

- [x] A failure in the existing policy-anchor lower-bound assertion emits bounded structured JSON to stdout containing locale, named viewport dimensions, case/document identity, URL/hash, `scrollY`, ready state, lifecycle events/timestamps, font status, scroll-padding, and actual section/heading/header rectangles.
- [x] Both locale cases and both existing policy-check viewports produce observable context/events during a successful run or an equivalent focused diagnostic execution.
- [x] The original lower-bound assertion, threshold, viewport sequence, `networkidle` wait, navigation URL, supplementary assertions, and product/CSS behavior are unchanged.
- [x] The failure snapshot is emitted before supplementary actions, and diagnostic or cleanup errors cannot mask the original assertion error.
- [x] No tokens, PII, report payloads, external telemetry, dependency, workflow action, or permanent forced-failure switch is introduced.
- [x] An isolated validation-only fault injection proves the structured failure log is emitted with the failed geometry; the probe is not part of normal execution.
- [x] The focused App Tracking typecheck/lint/format checks pass after implementation. The existing browser check is run where available; its result is reported honestly, and the known product failure is not treated as fixed by logging.

## Validation plan

1. Inspect the resulting diff and confirm only the planned diagnostic files changed, the trace is bounded, and the original assertion/error path remains intact.
2. Run the repository-native focused App Tracking typecheck, lint, and format checks through `t3-project` after the required runtime inspection; record exact commands and outcomes.
3. Run the isolated validation-only fault injection and assert that stdout contains parseable structured failure output with the locale/viewport and failed section/header geometry, then remove the probe and verify no permanent failure control remains.
4. Run the existing App Tracking browser check through `t3-project` when the prepared Chromium/runtime is available. Confirm logs for both locales and desktop/mobile cases; report any original CI failure as an intentional unresolved behavior failure, not as an implementation failure or fix.
5. If useful, inspect best-effort ignored evidence artifacts without making artifact upload a prerequisite. No CI workflow edit is required because stdout is already retained.

## Scope and delivery constraints

- PR108 remains the parent delivery path; no new PR, issue, comment, or merge action is part of this plan.
- The diagnostic implementation is authorized only after parent approval of this plan. It is a logging-only change and does not select among the unproven timing, viewport-reuse, font, or product-layout hypotheses.
- The exact browser/runtime identity for the next CI failure will be whatever CI supplies; the trace records observable page state rather than claiming a root cause in advance.
- Planning review checks that instrumentation remains bounded, the original assertion is preserved, and no unproven behavior fix is included.

## Open points

- No open points.

## Implementation and validation

The browser checker now emits bounded policy-anchor JSON through the dedicated
`policy-anchor-trace.ts` helper. The assertion and its diagnostic snapshot use
the same section/header rectangles. Passive lifecycle and font observations do
not add synchronization waits. A separate fresh-mobile observation runs after
the original cases. Original errors remain authoritative if collection or
cleanup fails.

Validation through the prepared `software-ardo` project runtime:

- App Tracking typecheck, lint and format checks passed; lint reported twelve
  existing warnings.
- App Tracking and Software builds passed for both language variants.
- An isolated fault-injection probe passed: exact failed geometry and case
  context were emitted, and simulated diagnostic/cleanup failures preserved
  the original error. No permanent injection control was added.
- The complete App Tracking browser check passed with four original-case
  `POLICY_ANCHOR_PASS` records and two fresh-mobile observations.
- An earlier browser attempt failed before policy cases because Software build
  artifacts were absent. Building those prerequisites resolved that validation
  setup problem without changing the fixture server.

The original intermittent CI anchor failure remains unexplained. Logging does
not repair or waive that behavior. Final project validation passed: repository-native `pnpm agent:check`, focused
format checks and `git diff --check` all exited zero. Existing repository lint
and PDF warnings remain non-blocking.

## Documentation sync

- Inline comments explain the passive recorder and shared assertion sample.
- The App Tracking README documents trace labels, bounded fields and limitations.
- The root README already links the App Tracking operations guide; no change is
  needed for this diagnostic-only addition.
- AGENTS.md needs no new development rule.

## Review findings

No Critical or Important findings were found. One documentation Note was
corrected: general installation/cleanup errors may omit case identity. A second
Note concerned README discoverability; the existing root operations-guide link
was retained. The independent reviewer confirmed unchanged predicates, waits,
viewport order and product behavior, bounded output, shared comparison geometry
and preservation of original errors.
