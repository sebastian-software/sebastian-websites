---
status: accepted
updated: 2026-10-06
---

# The repository is public

This monorepo is public from the start. The company's stance is that the repository shows the
work, the old Software site's repository is already public, and the shared packages are then
open source without being published or versioned separately. Being public sets rules for what
may enter the repository:

- No font files. The licensed typefaces are served from our own CDN and never committed here.
- No personal data of third parties beyond what the sites themselves publish; in particular
  no portraits or details of testimonial authors taken over from the old Sanity dataset
  without clearance.
- No unannounced products by name. Until it is announced, a product in preparation is
  described only as such.
- No internal analyses. Research that counts customers or weighs internal contradictions stays
  outside; the concept documents here carry only confirmed statements.
- No secrets. The Bunny API key lives in GitHub Actions secrets and is never committed.

## Considered options

- **Private until the first launch, then public after a review.** Rejected: a later opening
  needs a history review as well; the rules are easier to keep from the first commit.
- **Private repository, shared packages published as open-source packages.** Rejected: it
  forces versioning and publishing on packages that have one consumer.

## Consequences

- Reviews check the rules above, and the concept documents are written to be read by
  outsiders.
- Deployment scripts call Bunny directly and need no private hosting npm package.
