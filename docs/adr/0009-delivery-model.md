---
status: accepted
updated: 2026-10-06
---

# Delivery model: one static artifact per variant, published from `main`

Each of the eight variants (four sites, two languages) is built as its own static artifact for
exactly one domain, driven by one central, typed list of variants. Every push to `main` builds,
tests, and publishes all variants that are active in production; a pull request gets a preview
for each variant it affects. There are no releases, tags, or version numbers for websites, and
recovery only moves forward: a problem is fixed by a new commit on `main`, never by publishing
an earlier state again.

Publishing goes through our private hosting CLI (`@sebastian-gmbh/hosting`) to Bunny, from a
self-hosted CI runner. The repository is the single source of truth for hosting configuration:
edge rules, redirects, and cache lifetimes are defined here and applied to Bunny from here,
never maintained only in the dashboard.

## Considered options

- **Release Please with tagged website releases.** Rejected: a website has no consumers that
  need versions, and the tag adds a step without adding safety.
- **Deploying an earlier revision to recover.** Rejected: it hides the fix from `main` and
  makes the live state differ from the repository.

## Consequences

- Every production state corresponds to exactly one commit on `main`.
- Each variant has its own hosting target and can be published or rolled forward on its own.
- The hosting CLI must be able to apply the configuration kept here; if it cannot, that
  capability is added to it rather than worked around in the dashboard.
