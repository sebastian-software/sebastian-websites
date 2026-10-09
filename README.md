# Sebastian Websites

Monorepo for the websites of Sebastian Software GmbH: Sebastian Software, Sebastian Consulting,
and Open Source. One shared design system and brand bar, one static site per brand site and
language, hosted on Bunny. The skills for coding agents, Effective Agent, keep their own site
in the skills repository and are presented here as an open-source product.

**Status:** the workspace, shared packages, the design system (`design/DESIGN.md`), the
Software application in German and English on that system, the brand asset application,
checks, builds, and delivery are implemented: every push to `main` publishes each target to
its Bunny origin host. Canonical domains, previews, and phone layouts are still open.

The reusable legacy company copy is in [apps/software/content](apps/software/content/README.md).
Font binaries and photographs are uploaded manually to the shared Bunny asset zone. The
typography CSS is versioned here in `apps/brand/public`; licensed binaries and source
backups stay outside this public repository. [docs/operations/font-hosting.md](docs/operations/font-hosting.md) describes the integration.

When building pages, use `BunnyImage` from `@sebastian-websites/ui` for responsive
raster images. Repository-owned images stay beside their components and use
`?bunny` imports. See [ADR-0015](docs/adr/0015-shared-bunny-image-component.md) for
the decision and a usage example, and the
[responsive images guide](docs/operations/responsive-images.md) for setup, crops,
art direction, and preloads. [AGENTS.md](AGENTS.md) records the guidance for agents.

- [Overall concept](docs/concept/overall-concept.md): what is decided and what is still open
- [Positioning basis](docs/concept/positioning.md): values, strengths, and audiences
- [GLOSSARY.md](GLOSSARY.md): the shared vocabulary
- [docs/adr/](docs/adr/): decisions and their reasons, kept current as living documents
- [docs/plans/](docs/plans/README.md): the work packages, in order
