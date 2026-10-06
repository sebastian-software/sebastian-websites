# Sebastian Websites

Monorepo for the websites of Sebastian Software GmbH: Sebastian Software, Sebastian Consulting,
Open Source, and Skills. One shared design system and brand bar, one static site per brand
site and language, hosted on Bunny.

**Status:** the workspace, shared packages, the Software application in German and English,
the brand asset application, checks, builds, and delivery are implemented: every push to
`main` publishes each target to its Bunny origin host. Canonical domains, previews, and the
design phase are still open.

The reusable legacy company copy is in [apps/software/content](apps/software/content/README.md).
Licensed font binaries stay in the private `sebastian-fonts` repository; their CDN configuration
and its deployment are owned there; [docs/operations/font-hosting.md](docs/operations/font-hosting.md) describes the integration.

- [Overall concept](docs/concept/overall-concept.md): what is decided and what is still open
- [Positioning basis](docs/concept/positioning.md): values, strengths, and audiences
- [GLOSSARY.md](GLOSSARY.md): the shared vocabulary
- [docs/adr/](docs/adr/): decisions and their reasons, kept current as living documents
- [docs/plans/](docs/plans/README.md): the work packages, in order
