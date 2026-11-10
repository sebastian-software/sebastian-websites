---
status: accepted
updated: 2026-11-10
---

# All websites use ordinary Ardo projects

Software, Consulting, Open Source, app-tracking, and Brand use Ardo. Each website
keeps its own application, configuration, and content. The paired language sites
run two ordinary monolingual builds from the same sources, preserving their
German and English domains and unprefixed paths. Brand remains one website.
A broader multi-domain configuration is a possible later simplification.

The former Software-only integration precompiled shared packages, copied the
application into isolated projects, and mirrored edits during development.
That preparation made the integration harder to maintain than an ordinary Ardo
project. All applications now consume their declared workspace packages directly.
Ardo still owns its React, React DOM, and Vite runtime; supporting installed
workspace sources does not permit arbitrary sibling imports or ancestor dependencies.

General workspace support belongs in Ardo. The temporary dependency patch in
`pnpm-workspace.yaml` carries [Ardo #534](https://github.com/sebastian-software/ardo/pull/534)
until a normal release is available; replace it with the released dependency rather than maintaining a fork.
Sebastian-specific presentation and optional Vite integrations belong in
`packages/site`. That package shares the branded shell and normal configuration;
it does not generate project copies, install packages, compile workspace libraries,
or run a separate filesystem watcher.

Palamedes compiles the active locale catalog and scopes the complete server
render. Its public Vite document-delivery API supplies browser import maps and
catalog preloads. Image originals and optimizer URLs retain the shared Bunny
pipeline. Public output still uses `build/<variant>/client`, including the
hosting-compatible branded 404. Data acquisition remains owned by each website:
Software shares one metrics observation between its domains; Open Source keeps
its committed fallbacks and browser refresh behavior.

Navigation uses ordinary document links everywhere. React Router and the dual
link/navigation modes are removed. Newsletter draft and feedback state may reset
between pages. Existing layouts, copy, language links, SEO, downloads, and PDF
results remain the migration's acceptance boundary.

The migration is reviewed as one complete branch before rollout. Its evidence
includes builds, existing repository checks, every localized route at desktop
and mobile widths, browser hydration/navigation, blog fixtures, and Consulting's
PDF artifact and layout checks. The existing Consulting PDF generator remains;
an optional general Ardo PDF exporter is a separate future feature.

This decision replaces the framework exceptions in
[ADR-0007](0007-no-ardo-for-company-sites.md) and
[ADR-0008](0008-technical-baseline-and-workspace.md). Revisit it if an application
again needs copied projects or custom package installation to use Ardo.
