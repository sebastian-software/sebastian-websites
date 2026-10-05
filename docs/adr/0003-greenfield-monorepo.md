---
status: accepted
updated: 2026-10-05
---

# Start a greenfield monorepo instead of extending the Consulting repository

All company websites live in this new repository, which starts empty. In July 2026 the
`sebastian-consulting.de` repository was chosen as the basis of the website monorepo and was to
be renamed `sebastian-websites`. The concept has changed materially since then: four sites
instead of three, a shared brand bar, a redesign that is not bound to the current Consulting
look, and eight language variants. A clean cut is cheap and reversible, because the Consulting
repository keeps serving production untouched until its successor here replaces it.

## Considered options

- **Extend the Consulting repository.** It keeps the working Bunny delivery pipeline, five
  shared packages, and the full history. It also carries a half-finished domain cutover, a
  `/de` and `/en` compatibility bridge, and a UI the redesign replaces anyway.
- **A new repository for concept and ADRs only, with code staying in the Consulting
  repository.** Rejected because it separates decisions from the code they govern.

## Consequences

- The Consulting repository is a reference. Parts are copied from it where that makes sense;
  nothing is inherited implicitly, and no history is imported.
- Its ADRs (0001 to 0003) and strategy documents are not in force here. Each of their
  decisions is either restated in this repository or dropped.
- Until the new Consulting site is live, Consulting code exists in two places. Only the old
  repository is production.
