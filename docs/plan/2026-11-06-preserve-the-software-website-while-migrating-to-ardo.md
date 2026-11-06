# Preserve the Software website while migrating to Ardo

**Plan status:** Implemented on `feat/software-ardo`
**Source:** effective-flow plan
**Recommended workflow:** Refactoring (`effective-flow refactor`)

## Requirement

Plan moving `sebastian-software.de` to Ardo as the selected target. Preserve the current visual design and essential website behavior, while evaluating each framework difference as either a suitable website refactoring or a generally useful Ardo extension. Include `sebastian-software.com` because the language switch, shared routes, and reciprocal SEO links form one contract. Preserve content, design, accessible navigation, images, legal information, and public URLs. The repository migration retains the Refactoring workflow category; separately scoped upstream capabilities are Feature work. Exact SPA implementation semantics are no longer an unconditional requirement.

Ardo is the owner-selected direction as of November 6, 2026. The owner explicitly asks that differences be evaluated individually: adjust the website where appropriate, extend Ardo where the capability is reusable. Do not return to React Router merely because Ardo differs. Strict 1:1 is unavailable with unmodified Ardo 6.3.0 and the present workspace structure; visual/content parity remains the goal, with the explicit navigation adaptation below. The owner subsequently authorized recording extensions as Ardo issues, grouped under an epic when there is more than one. The owner subsequently authorized implementing the entire Software website on a branch without #497 or #498. Package releases and production deployment remain outside this delivery.

Planning baseline: repository HEAD `d39be3f`, November 6, 2026; working tree clean before this plan. Evidence describes the repository implementation, not a captured production browser session. Before implementation, confirm the deployed source revision and compare it with this baseline; reconcile any live differences before declaring production parity.

## Outcome checkpoint

**Primary source:** User request to plan the Software website's move to Ardo and assess user-visible 1:1 feasibility.
**Original outcome:** An evidence-backed plan and 1:1 assessment; no implementation, deployment, or other-site migration authorized in this planning run. Owner clarification on November 6, 2026 sets Ardo as the target and permits case-by-case website adaptations or useful Ardo extensions, replacing the earlier strict-parity-only direction.
**Current delivery:** Complete Software website on `feat/software-ardo`, rendering both languages with unchanged Ardo 6.3.0. Both baseline and Ardo builds, the full repository build, browser comparison, failure probes, and development source synchronization have succeeded. Repository checks, all 250 package/app tests, and all 35 hosting tests passed. Branch publication is the final delivery step. No upstream extension or production publication is required for this branch.
**No-progress count:** 0.
**Cumulative approach:** Repository and pinned Ardo source inspected; regular and deep interactive plan reviews completed. Owner subsequently rejected the workspace-source extension: #497 is closed as not planned. Build shared dependencies into regular package artifacts on the consumer side, retaining Ardo's existing package boundary. Client recovery #498 remains an optional upstream enhancement under epic #496; it is not a migration dependency. No custom router, fork, storage service, or new deployment target was introduced.
**Continuation decision:** Implement the migration without #497. First prove regular built packages against unchanged Ardo package validation; no registry publication is required. Use existing Ardo recovery APIs; #498 is an optional enhancement and is not a delivery gate. Baseline capture and package preparation can proceed independently. Stop dependent port work if the bounded package/pilot proof fails and report the specific limitation; do not reopen workspace-source support silently. Package releases and production deployment require their own authorized delivery step.

## Architecture decisions

- Assessment baseline: exact npm version `ardo@6.3.0`; inspected release source [834005a](https://github.com/sebastian-software/ardo/tree/834005a07f42cb796890dc29c7f80c272972cb68). Resolve and record registry integrity in the lockfile during implementation; the Git commit is source evidence, not an npm integrity assertion.
- Use Ardo's TSX routes and a custom document shell, preserving the current frame, CSS, page components, content data, fonts, and Bunny image helpers. Keep Ardo's existing package boundary unchanged. Build shared dependencies into regular JavaScript/CSS package artifacts and install them as ordinary package artifacts for the Software build, rather than relying on workspace-source symlinks. Keep this a local consumer build step; no npm publication or independent versioning service is required. Verify actual installed resolution in the pilot. #497 is closed as not planned. Pin unchanged Ardo 6.3.0; neither #497 nor #498 is required.
- Retain two independent, root-path builds with their existing origins. Ardo's locale subdirectories are not a replacement for the cross-domain contract in ADR-0006. Keep custom canonical/hreflang generation and the language switch.
- Keep Palamedes catalogs and macros through supported public APIs. Precompile shared-library macros to `@palamedes/runtime`, load one complete compiled catalog for the selected locale before client rendering, and use `app/server.ts` / `withRenderContext` with `createServerI18nScope` for complete SSR isolation. This replaces React Router's split-catalog document delivery with a single locale catalog shared by the application and built packages. Verify translation parity, hydration and bundle/performance cost; no new Ardo lifecycle API or application-bound runtime alias is needed.
- Preserve one compatible React instance across Ardo and workspace packages. Ardo exposes `ardo/react` and DOM entry points, while shared packages import React directly. Verify bundler resolution, hook identity, JSX configuration, and dependency compatibility before proceeding; do not globally change React for sibling apps to make the pilot pass.
- Preserve `packages/ui` compatibility for the Consulting and Open Source apps. `SiteLink`, `SiteHeader`, and `RouteFocus` depend on React Router. For Software use native links and document navigation, through a narrow injected navigation/path interface; retain current React Router defaults for other apps. Plain anchors and `location.assign` are deliberate Ardo behavior, not a missing router feature. Do not add a hidden router or request a new SPA engine solely for this site.
- Treat the full reload and reset of page-local newsletter input/status on ordinary internal navigation as documented website adaptations. Preserve validation, pending/failure/unavailable/success feedback within a document and prevent duplicate submissions. Do not add cookies, local/session storage, a server draft store, or cross-page persistence just to emulate the old shell. Test browser Back/Forward restoration without assuming every browser restores form state identically. Preserve accessible document navigation and sensible anchor/history behavior, not the exact SPA focus implementation.
- Retain Bunny middleware and its directory-index artifact contract. Normalize Software output into `apps/software/build/<variant>/client`, including `/404/index.html`, rather than changing every target to Ardo's `/404.html`. Validate ordinary page layout as well as 404 output; add no public redirects just to accommodate output differences.
- ADR-0007 currently rejects Ardo for company sites. This plan proposes a narrow Software exception only after pilot proof; it does not silently supersede that ADR. Update its rationale and the Software-relevant technical documentation in the eventual migration change.

### Verified capability and remaining proof

Ardo's [layout documentation](https://ardo-docs.dev/v6/guide/layout-and-navigation) documents custom root composition and document control using `Layout`, `ArdoHead`, and `ArdoScripts`. Its [release manifest](https://github.com/sebastian-software/ardo/blob/834005a07f42cb796890dc29c7f80c272972cb68/packages/ardo/package.json) exposes React/DOM entry points and includes Vanilla Extract and Vite. Its [static renderer](https://github.com/sebastian-software/ardo/blob/834005a07f42cb796890dc29c7f80c272972cb68/packages/ardo/src/vite/static-site.ts) is the authority for generated paths. Documentation URLs are mutable; check the pinned source before relying on exact APIs.

These capabilities support a custom site in principle. The pinned [package-boundary tests](https://github.com/sebastian-software/ardo/blob/834005a07f42cb796890dc29c7f80c272972cb68/packages/ardo/src/vite/project-packages.test.ts#L76) explicitly reject linked workspace sources. The pinned [page context](https://github.com/sebastian-software/ardo/blob/834005a07f42cb796890dc29c7f80c272972cb68/packages/ardo/src/runtime/page-context.ts#L79) documents full navigation through `location.assign`. These are known incompatibilities, not unanswered pilot questions. The implementation has now demonstrated Palamedes translation/hydration, stylesheet geometry, resource output, and compatible React identity in both language builds; see the delivery evidence below.

### Difference decisions and ownership

| Difference                                    | Selected treatment                        | Why and required proof                                                                                                                                                                                                                |
| --------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Declared workspace source packages            | Website package build                     | Prebuild and install regular package artifacts. Preserve package exports, declared dependencies, styles, translations, and one Ardo-managed runtime under unchanged Ardo validation. No source-support extension.                     |
| Full-document internal navigation             | Website adaptation                        | Appropriate for a static marketing site; no custom SPA router. Preserve URLs, native link behavior, usable history, focus, and scroll. Document the reload and local-state reset.                                                     |
| Newsletter state between pages                | Website adaptation                        | No cross-page draft persistence guarantee. Preserve within-page feedback and accessibility; do not introduce storage of email addresses. Current default action is `subscribeUnavailable`, not an active subscription service.        |
| Cross-domain languages and canonical URLs     | Website integration                       | Keep two variants and repository SEO helpers. Do not replace them with locale-prefix URLs or broaden Ardo's i18n model solely for these domains.                                                                                      |
| Palamedes render scope/catalog delivery       | Website integration through existing hook | Start from `app/server.ts` / `withRenderContext`, already used by Ardo's own Palamedes integration. Variant locale, complete-render scope, manifests and hydration still need proof. An extension requires a demonstrated limitation. |
| Client error recovery                         | Existing Ardo behavior accepted           | Use supported error/404 exports with website copy. #498 is optional and must not block delivery. Do not claim catch coverage for pre-hydration or later render failures that the pinned runtime does not provide.                     |
| Build-time live metrics                       | Website build preparation                 | Fetch once into temporary build data, fail on errors; no React Router loader emulation in Ardo.                                                                                                                                       |
| Bunny image processing                        | Website integration                       | Keep `?bunny`, `BunnyImage`, and `responsiveImage`; verify plugin and asset publication compatibility. No Bunny provider implementation in Ardo.                                                                                      |
| Directory-index output and branded 404        | Website artifact normalization            | Preserve current Bunny targets and HTTP behavior without adding a global Ardo hosting mode solely for this repository.                                                                                                                |
| General navigation/a11y defect found in pilot | Fix at responsible owner                  | App-shell defects stay in the website. Ardo defects belong upstream only with a reduced reproduction against its own default behavior. Native page reload itself is not a defect.                                                     |

### Consumer package artifact contract

Build the Software dependency closure (`ui`, `legal`, `web-core`, `content`, and transitive `tokens`) into regular package artifacts before Ardo processes the site. Preserve runtime public exports; typecheck against the existing workspace source declarations before building. The temporary runtime packages are private build artifacts rather than a separately published library distribution. Compile TypeScript/JSX and translation macros, emit usable CSS and referenced assets, and retain the required build-time image plugin entry points. Declare all external imports in each owning package. Do not bundle a second React/DOM or Palamedes runtime; prove that the installed artifacts resolve against the intended Ardo-managed runtime and shared translation context. Prebuilding alone does not establish runtime compatibility.

Use a temporary consumer installation/build area with ordinary installed package artifacts; never assume that changing `exports` to `dist` makes a workspace symlink acceptable. Keep outputs outside committed source and preserve existing source-based workflows for sibling apps. No npm publication, permissive alias, validation bypass, source copying into Software, or Ardo package-policy change is part of this approach. A bounded package fixture must exercise the real UI-to-tokens/web-core/legal graph, built subpaths, emitted CSS/assets, transformed translations, hooks, and context. A failing package proof stops dependent port work and returns a concrete limitation before broadening scope.

### Transformed translation imports

Include real transformed `packages/ui` frame/error copy and `packages/legal` translation macros in the built-package fixture. The baseline Software configuration sets `runtimeModule: "~/lib/i18n"`, generating an edge from shared code back to an app module; `packages/config/src/workspaceBoundaries.ts` forbids shared packages depending on apps. Do not carry that app alias into installed package artifacts.

For Software, plan to point macro-generated calls at the public `@palamedes/runtime` package entry that already supplies `getI18n`, declaring that runtime dependency in every owning package whose transformed code imports it. Remove Software's application alias as the macro runtime binding. Verify the installed Palamedes macro API, server scope, catalog discovery/delivery, and one shared runtime/context instance before accepting this replacement. Keep sibling apps working with their existing macro configurations. If the public runtime cannot provide equivalent catalog/context behavior, stop and define a narrow host-runtime binding contract separately; do not silently permit package-to-app imports or arbitrary alias escapes.

### Existing error behavior and optional #498

The migration uses unchanged Ardo 6.3.0. Static route-load, metadata and render failures must fail the build; branded 404 rendering remains a separate valid page. Provide translated website error copy through supported root error APIs and retain useful static HTML/native links. Do not introduce custom bootstrap machinery or promise comprehensive browser failure recovery.

The owner explicitly accepts that Ardo 6.3.0 does not catch all module-load, pre-hydration, fatal hydration or later render failures. #498 records an optional improvement, not a prerequisite, acceptance gate, or release dependency for this branch. No implementation or release of #497 or #498 is part of this migration. Validate successful hydration, native navigation and the branded 404; document current recovery limits rather than simulate an upstream feature.

## Affected files

| File                                                                                                                      | Description                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/software/package.json`, `tsconfig.json`, `vite.config.ts`, `app/env.d.ts`                                           | Pin Ardo, configure JSX/types and plugins, retain variant constants and image/translation integration, replace framework-specific scripts.                |
| `apps/software/react-router.config.ts`, `app/routes.ts`                                                                   | Replace route/build configuration after pilot success; preserve the full URL inventory.                                                                   |
| `apps/software/app/root.tsx`, `app/entry.server.tsx`, new `app/server.ts`                                                 | Replace the React Router server entry using supported `withRenderContext`; migrate document/frame/metadata and the existing supported Ardo error exports. |
| `apps/software/app/routes/*`, `app/lib/pages.ts`, `app/lib/metrics.ts`                                                    | Port seven content routes plus 404 and resource outputs; replace generated React Router types, metadata exports, and loaders.                             |
| `apps/software/app/lib/i18n.ts`, `app/locales/*.po`, relevant shared-package manifests                                    | Preserve catalog delivery/translations; declare generated runtime imports, remove Software's app-bound macro alias, and verify transformed shared copy.   |
| `packages/ui/src/SiteLink.tsx`, `RouteFocus.tsx`, `frame/SiteHeader.tsx` and related exports/tests                        | Inject native-link/current-path behavior for Software while preserving current React Router defaults and tests for sibling apps; no SPA-router emulation. |
| `packages/web-core/src/seo.ts`, `sites.ts`, `packages/ui/src/BunnyImage.tsx`                                              | Reuse existing contracts; change only if the pilot identifies an essential integration adjustment.                                                        |
| `hosting/targets.ts`, `middleware-logic.ts`, `seo.ts`, `smoke.ts` and corresponding tests                                 | Keep public behavior/output paths; add actual response MIME checks for sitemap, robots, and manifest on both origins.                                     |
| `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`                                                                | Preserve checks and publishing targets; integrate Software parity checks and normalized output.                                                           |
| `pnpm-workspace.yaml`, `pnpm-lock.yaml`, shared-package manifests and package build scripts                               | Resolve Ardo and build/install ordinary consumer package artifacts with exports, styles, assets and types; preserve sibling apps' source workflows.       |
| `docs/adr/0007-no-ardo-for-company-sites.md`, `0008-technical-baseline-and-workspace.md`, `0019-software-site-on-ardo.md` | Record the Software exception and consumer package/canonical build contract; preserve the delivery model in ADR-0009.                                     |

There are no upstream prerequisites. Ardo 6.3.0 remains unchanged; #497 is closed and #498 is optional. Do not edit Ardo source, package validation, or startup boundaries for this migration.

### Issue-first upstream work

- Epic: [#496 — resilient client startup](https://github.com/sebastian-software/ardo/issues/496), retained with scope narrowed after the owner decision.
- [#497 — explicitly declared workspace source packages](https://github.com/sebastian-software/ardo/issues/497) is closed as not planned. Consumer-owned package artifacts replace it; it is not a prerequisite or an implemented capability.
- [#498 — localized client loading and render recovery](https://github.com/sebastian-software/ardo/issues/498) remains an optional upstream enhancement. It is not part of branch completion.

Owner rule: record every Ardo extension as an issue before implementing it. When there is more than one extension issue, create an epic and link the issues beneath it. Reuse this epic for related follow-up extensions discovered by this migration; check for existing issues before creating another. Each issue must state its consumer need, general framework contract, scope, evidence, and acceptance tests. Palamedes uses the existing render hook and needs no speculative feature issue. A newly proven limitation requires an issue before work starts.

Neither upstream issue gates this migration. #498 may be pursued separately; branch completion is measured against existing Ardo behavior and the accepted differences above.

New Ardo configuration, a temporary build-data module, output normalization, and a Software browser regression spec may be needed under `apps/software/`; choose exact filenames against the pinned CLI during the pilot. Do not add T3 runtime definitions or wrappers to the repository.

## Implementation details

### Approach

1. **Build consumer package artifacts and capture the baseline.** First prove the package artifact contract against unchanged Ardo validation, including styles, transformed translations and runtime identity. Do not depend on #498; use pinned Ardo 6.3.0 throughout. Confirm deployed revision, then build both existing Software variants. Inventory `/`, `/products`, `/open-source`, `/company`, `/contact`, `/imprint`, `/privacy`, `/404`, `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest`. Record declared legacy redirects/410s, response headers, navigation behaviors, and external requests. Capture deterministic baselines with fixed metric data, year, fonts, viewport, and browser; use the same data for old/new comparisons and a separate real metrics fetch check.
2. **Prove a representative pilot.** In the future implementation checkout, exercise `/`, `/open-source`, and `/404` in both variants using Ardo, the existing frame, and at least one responsive Bunny image. Prove translation SSR, document hydration/navigation, legal/frame copy, metadata, one React instance, unchanged CSS, and existing error/404 behavior without claiming #498 coverage. Verify the declared reload/form-state adaptations and accessibility against the difference table rather than demanding SPA lifecycle identity. Verify route discovery does not expose resource generators as HTML pages. Keep pilot outputs separate from deployable paths until normalization passes. This stage is prerequisite to all remaining port work.
3. **Resolve data and rendering integration.** Fetch metrics before prerender into temporary build output, shared by routes and client hydration. A failed fetch must fail the build; do not substitute zero or stale values. Never add generated source to version control. Prove Palamedes root and route catalogs are available during rendering, navigation, and error handling. If Ardo lacks a supported hook needed for this, isolate a reduced reproduction and design a bounded, reusable render lifecycle extension as a separate Ardo Feature package before continuing. Do not patch internal render functions or add a custom site renderer. A substantial framework expansion requires a new scope decision. Start specifically from the existing `app/server.ts` / `withRenderContext` integration in pinned `docs/app/server.ts`; its existence is verified, not an open question. Include transformed shared frame/error/legal macros in this proof, not just a synthetic dependency graph.
4. **Port the complete site.** Transfer remaining pages and metadata, preserving current components and copy. Implement the narrow navigation/path injection with native links and equivalent error handling. Keep resource generators using repository URL/SEO helpers, avoiding duplicate Ardo-generated sitemap/robots output. Preserve canonical origins for preview artifacts as the current hosting checks require.
5. **Normalize artifacts and protect consumers.** Emit both existing Software build directories and directory-index pages. Map Ardo's generated 404 internally to the established artifact path and verify status 404 on unknown requests. Preserve asset-zone publication for `?bunny` imports. Check all other app builds/tests after shared UI changes. Remove obsolete Software React Router configuration only after the full replacement is validated.
6. **Integrate and publish through the established delivery model.** Record the narrow ADR exception and run the parity suite and normal repository checks. Both Software variants are already production-active: their origin targets also serve their canonical domains. Do not treat an upload to these targets as pre-production previewing. The Deploy workflow runs independently of CI; add validation of the exact deployment build inside `.github/workflows/deploy.yml` before `hosting/deploy.ts` or any other remote mutation. CI-only browser checks are not a deployment gate. Use local artifact comparisons before publication, then existing-origin smoke checks as post-publication verification. No separate remote staging target is planned; adding one would require a separate scoped decision. Preserve ADR-0009: publish from `main`; recovery uses a corrective/revert commit published forward from `main`, not an earlier artifact. Planning itself authorizes no publishing or activation.

### Accessibility

Preserve landmarks, skip links, names, headings, mobile menu keyboard behavior, visible focus, usable page titles, Back/Forward, fragment targeting, and reduced-motion preferences. For document navigation use browser-native focus/history restoration; do not unconditionally focus main on load or promise exact React Router scroll restoration. Verify keyboard and screen-reader orientation after a page change. Ardo defaults must not add duplicate landmarks, headings, or navigation. Verify modified-click and external-link behavior in the navigation adapter.

### Edge cases

- Unknown URLs return the branded page with HTTP 404, no canonical/alternate links, and a language switch to the other home page.
- Trailing slash, legacy redirects, gone paths, query strings, fragments, and asset requests retain their existing status/destination semantics.
- Static route/render/metadata failures block publication. Browser load/hydration/later render failures retain Ardo 6.3.0's limitations. Enhanced recovery in #498 is optional; exporting `ErrorBoundary` is not a claim of comprehensive recovery. Metrics/translation build failures also prevent incomplete artifacts from publishing.
- No new analytics, reporting, consent behavior, storage, cookies, or external requests are enabled through framework defaults. Compare the existing request inventory and legal disclosures; do not assume Ardo has no telemetry simply because the site uses a custom shell.

## Acceptance criteria

Completion means all items below pass for both Software variants, preserving the website contract with only the explicit difference-table adaptations. A new behavior difference must receive an individual disposition and named check before completion:

- [x] The representative pilot builds and hydrates in both languages with Palamedes, existing styles, Bunny images, and one compatible React runtime, using supported Ardo APIs.
- [x] Regular installed package artifacts pass unchanged Ardo package validation and the built-package contract above, including public subpaths, CSS/assets, generated translation imports and a single managed runtime. Record the consumed Ardo version and reproducible package build/install evidence; no workspace-source support is used.
- [x] Every baseline URL retains its content, title/description, document language, canonical/alternate links, structured metadata where present, status, and destination. Sitemap, robots, and manifest expose the same semantic data with correct MIME types.
- [x] All seven content routes and the branded 404 match deterministic baseline screenshots at 390px and 1440px widths; review every diff and allow only documented browser antialiasing noise, not layout or typography drift.
- [x] Browser regression checks pass for internal links, brand navigation, the cross-domain language switch, mobile menu, keyboard focus, browser-native history/scroll behavior, Back/Forward, fragment links, newsletter submission/error behavior where present, and external links.
- [x] Enter newsletter data, navigate internally, and return: document reload and possible input/status reset are expected, recorded adaptations; no application draft persistence is promised. Submission feedback within the same document, keyboard orientation, skip-link access, and native history/fragment behavior remain usable. No storage-based email persistence is introduced.
- [x] Responsive image candidates, sizes, crops, alt text, intrinsic dimensions, and priority behavior match the original placements; no new external requests or storage behavior appear.
- [x] Metrics fetch failure and missing translations fail builds; successful metrics appear in prerendered HTML and remain consistent after hydration.
- [x] Real transformed shared frame/error/legal copy imports a declared public runtime, never an app alias; both variant builds, catalog delivery and hydration use the intended runtime/context instance without weakening workspace boundaries.
- [x] Existing Ardo error/404 exports integrate with translated website copy; ordinary hydration succeeds and static render failure blocks publication. Current browser recovery limits are documented and accepted; #498 is not required.
- [x] Hosting tests and local browser checks prove directory-index delivery, legacy rules, resource contents, and branded HTTP 404. Software paths still match `hosting/targets.ts`. Extend origin smoke checks with MIME assertions; actual production-origin execution is post-publication work and is not required for branch completion.
- [x] Deploy validates the exact Software artifacts before its first remote mutation. Post-publication checks remain in the deployment flow; no production upload is part of this branch delivery.
- [x] Repository checks, full tests, and all app builds pass without reducing existing coverage or regressing sibling apps; ADR-0007 documents only the proven exception.
- [x] Same-browser comparison shows no repeatable median LCP regression greater than 10% over five runs per representative route/viewport, no increased CLS, and no hydration errors. Freeze the baseline conditions before comparisons; investigate failures instead of widening the budget.

## Validation plan

All future project installs/checks/builds run through `t3-project`, after reading the manifests, lockfiles, version files, and CI, then `doctor` and `inspect --worktree`. Select the external environment from that inspection; no host tooling install. Use Node 26.x and pnpm 12.10.1 as required by the current manifest, rechecking on execution.

- Baseline and migrated Software: `pnpm --filter @sebastian-websites/software build` must produce both variants. Preserve an immutable baseline outside the deploy output before changing framework code.
- Existing repository gates: `pnpm agent:check`, `pnpm test`, `pnpm hosting:test`, and `pnpm build`, all exit 0. The full build needs Consulting's Playwright Chromium as shown in `.github/workflows/ci.yml`.
- New Software parity spec: wire a named script into Software's manifest and CI during implementation, reusing installed Playwright conventions from `apps/app-tracking`. The implemented `check:browser` script covers both built variants and supports comparison against a previous build through `SOFTWARE_BASELINE_ROOT`.
- Extend `hosting/smoke.ts` and tests to inspect actual `Content-Type` headers for `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` on both Software origins, normalizing optional charset parameters. Assert XML-compatible sitemap, `text/plain` robots, and manifest-compatible JSON media types; establish the exact allowed types from the current live baseline and standards before implementation, not from a fixture server's MIME table. Existing status/Location/SEO-body checks do not prove these headers, and the manifest needs an explicit case. Artifact contents are checked before publication; actual Bunny response headers are checked afterward.
- Existing `pnpm hosting:smoke` needs the configured deployed origins. Run on the active origins only after authorized publication as post-publication verification; report it as pending beforehand. Local deterministic parity validation must run in Deploy before upload/provisioning, independently of CI scheduling.
- Format changed files with repository Prettier and run relevant repository checks during implementation. Record actual build/parity evidence without treating this plan as proof.

## Assumptions and open points

- Scope interpretation: German Software site plus its English counterpart; Consulting, Open Source, Brand, and App Tracking retain their frameworks. Shared UI changes must preserve them.
- Workspace-source support is not selected; #497 is closed as not planned. Regular installed package artifacts are the selected consumer adaptation. Client-router identity is intentionally replaced with document navigation. Palamedes integration, runtime identity, package/CSS/asset output, Ardo-generated resource paths, and build data remain pilot gates. Failure blocks dependent port work and triggers a bounded reassessment.
- Preserve design, accessibility, privacy, SEO, and hosting. The owner allows justified website adaptations and useful Ardo extensions; that does not authorize an unrestricted framework rewrite. Track every additional difference with its reason, owner, consumer impact, and test in this plan before treating it as accepted.
- Pilot effort is bounded to the three named routes and two variants after the built-package prerequisite. Do not build a second generic site framework around Ardo. If proof fails, keep production unchanged and return a specific Ardo integration proposal; the selected target remains Ardo.

## Implementation evidence — November 6, 2026

- Pinned `ardo@6.3.0` is recorded with registry integrity in `pnpm-lock.yaml`. Five shared packages are compiled into ordinary installed runtime artifacts; Ardo's package validation and managed React resolution remain enabled. Every route uses the public Ardo renderer.
- Baseline: committed `d39be3f`, built for both languages before comparison. `pnpm build` completed for every app and variant, including Consulting PDFs. Ardo prerendered eight Software pages per language. A final Software-only rebuild also passed after development configuration was completed.
- `check:browser` passed for both languages against that baseline at 390px and 1440px widths. It compares translated headings, metadata, geometry within 2px, fonts/colors, and responsive image attributes, and exercises hydration, document navigation, newsletter feedback/reset, mobile menu, skip links, language links, Back, branded HTTP 404 and no-JavaScript navigation. After explicitly decoding lazy images on both pages before capture, all 32 screenshot pairs were pixel-identical. The initial three differences were unloaded baseline photos, not application layout differences. Screenshots and the pixel comparison report are retained in the ignored `apps/software/build/evidence` directory.
- Representative LCP/CLS comparisons use the same Chromium process, fixed external asset bytes, alternating origin order, and five warmed document loads per route/viewport. The completed second series measured baseline → Ardo median LCP: desktop home 172 → 128ms, open source 104 → 104ms, 404 96 → 92ms; mobile home 152 → 120ms, open source 100 → 88ms, 404 108 → 76ms. CLS stayed within the unchanged tolerance. The first series exceeded the 10% LCP budget on mobile home (132 → 156ms); that regression did not repeat in the bounded repeat. These are local comparative measurements, not field performance guarantees.
- Isolated failure probes proved nonzero exits for a route metadata/render failure (1), a missing German translation (5), and a metrics fetch failure (1). Generated probe inputs were restored; final publishable artifacts were not modified by the probes.
- The development server successfully rendered a newly created original-source route and a subsequent edit. Directory-based watches also preserve atomic editor saves of configuration and macro-plugin files. The consumer mirrors source changes into the Ardo project; Vite prebundles the complete runtime imports and polls the copied files on mounted filesystems. Shared package changes require restart, as documented in `apps/software/README.md`.
- Shared UI checks passed with 27 tests, preserving the Router defaults used by sibling apps. `pnpm agent:check` and `pnpm test` passed across the repository: 250 package/app tests and 35 hosting tests. Existing spelling, refresh, and build-tool warnings remain nonblocking.
- No production deployment occurred. The exact artifact check is wired into Deploy before provisioning/upload. Production-origin smoke execution remains post-publication work; its new MIME checks are covered locally.

## Plan review

### Review of the initial strict-parity plan — November 6, 2026

**Result:** Revision required

### Summary

Independent plan-level review completed November 6, 2026. Three important findings were verified against repository and pinned upstream source. The plan now captures them; the migration remains blocked by the first two decisions.

| Area            | Critical | Important | Note |
| --------------- | -------: | --------: | ---: |
| Architecture    |        0 |         1 |    0 |
| Security        |        0 |         0 |    0 |
| Data protection |        0 |         0 |    0 |
| Error cases     |        0 |         1 |    0 |
| Testability     |        0 |         1 |    0 |
| Scope           |        0 |         0 |    0 |
| Maintainability |        0 |         0 |    0 |

### Findings

- Architecture, Important: Ardo rejects linked workspace sources, invalidating direct package reuse. Incorporated as a known prerequisite and stop condition; packaging/upstream scope needs an owner decision.
- Error cases, Important: full-document navigation cannot preserve the assumed router and newsletter state contract through a narrow hook adapter. Incorporated as a known prerequisite, decision, and explicit state/focus regression scenario.
- Testability, Important: origin uploads affect already-active production, and CI does not gate Deploy. Incorporated by requiring exact-artifact validation inside Deploy before remote mutation and classifying origin smoke checks as post-publication.
- Review transport requested research `gpt-5.6-luna`/medium and judgment `gpt-6.1-sol`/high. T3 reports those models, but no supported exact-child execution evidence adapter was available; execution model/effort compliance remains unverified. This does not establish runtime parity.

### Revision after owner clarification — November 6, 2026

**Result:** Approved

Ardo is now fixed as target. The difference decisions replace the earlier recommendation to retain React Router. Workspace integration is a bounded generic upstream prerequisite; native document navigation and local newsletter reset are deliberate website adaptations. Packaging an entire shared UI distribution, adding a router, and new staging infrastructure are not selected. The initial review above is historical.

Independent judgment of this revision found no actionable findings after checking the difference ownership, workspace boundaries/dependency ownership/React identity, native navigation/accessibility/newsletter behavior, bounded pilot and failure stops, acceptance checks, exact-artifact deployment gates, and planning-only authority against repository source and pinned Ardo `834005a`.

| Area            | Critical | Important | Note |
| --------------- | -------: | --------: | ---: |
| Architecture    |        0 |         0 |    0 |
| Security        |        0 |         0 |    0 |
| Data protection |        0 |         0 |    0 |
| Error cases     |        0 |         0 |    0 |
| Testability     |        0 |         0 |    0 |
| Scope           |        0 |         0 |    0 |
| Maintainability |        0 |         0 |    0 |

No findings. Approval concerns the plan, not runtime compatibility or user-visible parity, which remain unproven until the planned gates pass. The review was read-only. Requested judgment model/effort was `gpt-6.1-sol`/high; T3 reported the selected model, but exact-child execution compliance remains unverified as described in the historical review. Project formatting and application checks were not run; the earlier runtime inspection found no bound project environment for this checkout. Mechanical plan lint is separate from Prettier validation.

### Deep interactive review — November 6, 2026

**Result:** Approved

One important finding required an ownership decision; the owner selected an Ardo extension. Three notes were incorporated directly. The findings below describe the review history; the subsequent resolution records the current readiness.

| Area            | Critical | Important | Note |
| --------------- | -------: | --------: | ---: |
| Architecture    |        0 |         0 |    2 |
| Security        |        0 |         0 |    0 |
| Data protection |        0 |         0 |    0 |
| Error cases     |        0 |         1 |    0 |
| Testability     |        0 |         0 |    1 |
| Scope           |        0 |         0 |    0 |
| Maintainability |        0 |         0 |    0 |

- Error cases, Important: pinned Ardo does not catch every route-loading/bootstrap/render failure merely through an `ErrorBoundary` export. Added a phase-specific error contract and failure-injection criteria; the owner assigned implementation ownership to Ardo, tracked in #498.
- Architecture, Note: `app/server.ts` / `withRenderContext` already supports Palamedes scope and document transforms. Named that hook and upstream example, added the affected file, and restricted extension work to a demonstrated gap.
- Architecture, Note: the workspace fixture must include actual macro-generated imports from shared copy. Planned public runtime dependencies instead of Software's app alias, with catalog/context/hydration proof and a stop if that contract cannot hold.
- Testability, Note: existing origin checks omit resource MIME assertions and manifest verification. Added explicit `hosting/smoke.ts` header checks and tests on both origins; fixture MIME handling is not evidence of Bunny delivery.

The deep review inspected repository and pinned upstream sources read-only. No runtime experiment, application change, or publication occurred. Requested/reported judgment model was `gpt-6.1-sol` with requested high effort; supported exact-child execution compliance remains unverified.

### Owner resolution and issue publication — November 6, 2026

**Result:** Approved

The owner selected generic Ardo recovery and required extension issues before implementation, with an epic when multiple issues are needed. Created epic #496 and native sub-issues #497/#498 in `sebastian-software/ardo`, then read back the parent-child relationships. Scope, release gates, consumer sequence, affected integration, and failure-injection criteria are updated accordingly. No blocking planning decisions remain; the unimplemented Ardo capabilities are explicit delivery dependencies, not evidence of runtime success.

All deep-review findings are now incorporated: error-recovery ownership is decided; the existing Palamedes render hook is identified; generated translation imports are covered; resource MIME checks are explicit. No additional code review, implementation, release, or deployment was performed. Application tests/builds remain unrun; mechanical plan lint does not establish runtime compatibility.

### Owner decision: keep Ardo package boundaries — November 6, 2026

The owner rejected #497 and instructed migration without a workspace-source extension. #497 is closed as not planned, and epic #496 is narrowed to client recovery #498. Earlier review approvals describe the previous source-support approach; they do not validate this revised artifact-build approach. The current architecture, scope, sequence and acceptance criteria now require ordinary installed package artifacts prepared by the consumer, without npm publication or a change to Ardo package validation. CSS, macro output, exports, assets, dependency declarations and runtime identity remain explicit proof gates. No application implementation, package build or migration validation is claimed by this plan update.

### Owner decision: complete website branch without upstream extensions — November 6, 2026

The owner authorized implementing the complete German/English Software website on a branch using existing Ardo, without #497 or #498. #498 is an optional improvement; current browser recovery limitations are accepted. Neither issue or a new upstream release is a prerequisite. This supersedes the earlier recovery gate. Deliver the branch and validated site artifacts, without production deployment.

## Open points

- No open points.
