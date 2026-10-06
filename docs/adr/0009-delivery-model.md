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

Publishing uses small repository-owned scripts that call the Bunny API directly, following
the existing `oss-metrics` deployment. CI reads `BUNNY_API_KEY` from GitHub Actions secrets.
There is no private hosting package, npm token, or required Limen integration for deployment.
GitHub Free remains the baseline. The public website monorepo and Metrics share an
organization secret, available to all public repositories in the organization; the private
font repository stores a copy of the same Bunny key as a
repository secret, because organization secrets are unavailable to private repositories
on this plan. All workflows read `secrets.BUNNY_API_KEY`; key rotation must update both copies.

The deploying repository is the source of truth for its hosting configuration: edge rules,
redirects, and cache lifetimes are defined and applied there, never maintained only in the
dashboard. Website configuration lives in this monorepo; the private font repository owns
the font CDN configuration and deployment.

## Considered options

- **Release Please with tagged website releases.** Rejected: a website has no consumers that
  need versions, and the tag adds a step without adding safety.
- **Deploying an earlier revision to recover.** Rejected: it hides the fix from `main` and
  makes the live state differ from the repository.
- **Requiring the private hosting CLI.** Rejected: the direct Metrics scripts already show
  the necessary API operations. Shared helpers can be extracted once deployment scripts
  demonstrate repeated code with a clear common contract.

## Consequences

- Every production state corresponds to exactly one commit on `main`.
- Each variant has its own hosting target and can be published or rolled forward on its own.
- Deployment scripts apply the declared configuration, preserve unrelated resources, and
  verify both API readback and live delivery.
