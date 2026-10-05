---
status: accepted
updated: 2026-10-05
---

# ADRs are living documents

An ADR in this repository describes a decision as it stands today. When the decision changes,
the ADR is edited in place and its `updated` date moves forward; Git history keeps the earlier
wording. The earlier website repository treated accepted ADRs as immutable and chained
replacements through "superseded by" links, which left readers to reconstruct the current state
from several files.

## Considered options

- **Immutable records with supersession links.** Rejected: the audit trail it provides already
  exists in Git, and it costs every reader the work of resolving the chain.

## Consequences

- Each ADR carries `status` (`proposed`, `accepted`, or `retired`) and `updated` in its
  frontmatter.
- A decision that no longer applies is marked `retired` and says why in one sentence. Numbers
  are never reused.
- An ADR states the decision and its reasons, not the history of how it was reached. Why a
  decision changed belongs in the commit message of the edit.
