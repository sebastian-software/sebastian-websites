---
status: accepted
updated: 2026-10-06
---

# Delivery model: one static artifact per variant, published from `main`

Each of the six variants (three sites, two languages) is built as its own static artifact for
exactly one domain, driven by one central, typed list of variants. Every push to `main` builds,
tests, and publishes every variant that has a build to its own origin host
(`<target>.b-cdn.net`); whether a variant is active in production only decides whether its
canonical domain is attached to that host. A pull request gets a preview for each variant it
affects. There are no releases, tags, or version numbers for websites, and
recovery only moves forward: a problem is fixed by a new commit on `main`, never by publishing
an earlier state again.

Publishing uses small repository-owned scripts that call the Bunny API directly, following
the existing `oss-metrics` deployment. CI reads the organization Actions secret
`BUNNY_API_KEY` into the deployment scripts' process environment.
There is no private hosting package, npm token, or required Limen integration for deployment.
GitHub Team makes the same organization secret available to all repositories, including
the private font repository. The websites, Metrics, and Fonts workflows read
`secrets.BUNNY_API_KEY`; rotation updates the central secret.

The deploying repository is the source of truth for its hosting configuration: edge rules,
redirects, and cache lifetimes are defined and applied there, never maintained only in the
dashboard. Website configuration lives in this monorepo; the private font repository owns
the font CDN configuration and deployment.

## Considered options

- **Release Please with tagged website releases.** Rejected: a website has no consumers that
  need versions, and the tag adds a step without adding safety.
- **Deploying an earlier revision to recover.** Rejected: it hides the fix from `main` and
  makes the live state differ from the repository.
- **Requiring the private hosting CLI.** Rejected by the owners on 2026-10-06 in favour of
  the repository-owned scripts; the CLI needs 1Password and a private npm token. Shared
  helpers may be extracted into a small reusable package once a second deploying repository
  shows the same code.

## Consequences

- Every production state corresponds to exactly one commit on `main`.
- Each variant has its own hosting target and can be published or rolled forward on its own.
- Deployment scripts apply the declared configuration, preserve unrelated resources, and
  verify both API readback and live delivery.
- Prerendered routes are directories holding an `index.html`, and Bunny Storage serves files
  only. A small middleware on every pull zone resolves extension-less paths to those files and
  redirects trailing slashes to the canonical path (ADR-0010); its source lives in `hosting/`.
