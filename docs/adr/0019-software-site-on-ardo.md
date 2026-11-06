---
status: accepted
updated: 2026-11-06
---

# Software uses Ardo with locally built shared packages

The Software website uses Ardo to render its complete German and English variants.
This supersedes the Software-specific framework choice in
[ADR-0007](0007-no-ardo-for-company-sites.md) and
[ADR-0008](0008-technical-baseline-and-workspace.md). The other apps keep their
frameworks. The shared design, content, language-by-domain model, image helpers,
and static hosting contract remain in place.

Ardo owns rendering, route discovery, the client entry, and its React/DOM runtime.
The website supplies custom TSX routes and a document shell through public Ardo
APIs. Internal links use native document navigation. Newsletter draft and feedback
state may reset between documents; no email-address persistence is introduced.

Shared packages remain source-based workspaces for the other apps. Software builds
its dependency closure into temporary JavaScript/CSS packages, with public runtime
exports, compiled translation macros, and their assets. It materializes those
artifacts as regular installed packages in an isolated build directory. Ardo's
package validation remains enabled and unchanged. Registry dependencies come from
the root lockfile; the generated installation reuses those concrete versions.
Workspace source files do not enter Ardo's application graph. Typechecking continues
against the original workspace sources. These runtime artifacts need neither npm
publication nor a separately versioned distribution.

The application and built packages share one complete compiled translation catalog
per language build. Public Palamedes runtime APIs initialize the client, while
Ardo's `app/server.ts` / `withRenderContext` hook scopes the complete server render.
This deliberately replaces the former React Router split-catalog delivery. The
catalog's payload cost must be included in performance comparisons.

Neither workspace-source support
[Ardo #497](https://github.com/sebastian-software/ardo/issues/497) nor enhanced browser
error recovery [Ardo #498](https://github.com/sebastian-software/ardo/issues/498) is a
prerequisite. #497 is closed as not planned. #498 remains optional; the migration
accepts existing Ardo browser recovery limits. Static generation failures still
fail the build. The site supplies translated error/404 presentation through the
existing public exports, without a custom renderer or bootstrap.

A build fetches the metrics snapshot before rendering and fails on fetch errors.
Both language builds use that snapshot. The final artifact retains
`build/<variant>/client`, resource files, and `/404/index.html` so that the existing
Bunny middleware and targets apply. Ardo's own `/404.html` is normalized at the
consumer boundary. CI and Deploy check the generated Software artifacts before
publication. Creating this branch does not deploy it.

Validation covers every route in both languages, native navigation, translated
form feedback, 404 responses, SEO, generated assets, and browser comparison with
the previous build. Revisit this decision if maintaining regular package artifacts
requires bypassing Ardo's ownership checks or changing sibling apps' behavior.
