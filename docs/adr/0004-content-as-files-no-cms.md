---
status: accepted
updated: 2026-10-06
---

# Content lives in the repository as files; no CMS

All four sites author content as `.tsx`, `.mdx`, or `.md` files in this repository, mixed as
each page needs, and translate it through Palamedes. The previous Sebastian Software site kept
all copy, projects, and testimonials in Sanity, with a hosted Studio, request-time queries, and
a live edit mode; the public content was captured once from the live site (plan 05), and
Sanity is retired with the old stack. The two authors already work in the
repository, and one content path for every site is part of what integration means here.

## Considered options

- **Keep Sanity and query it at build time**, rebuilding on a webhook. Rejected because it
  keeps a second hosting target, a preview environment, and a separate translation model alive
  for two developer-authors.

## Consequences

- Content changes go through a pull request; there is no editing interface.
- Where Palamedes cannot translate a format yet, that content stays in its source language
  until Palamedes is improved ([ADR-0006](0006-language-by-tld-english-source.md)). Palamedes
  is our own product, so the gap is ours to close.
- The readable capture and sorted inventory of the old public content must be retained
  before the old site is switched off. They live outside Git because they also include
  testimonials and portraits. Reusable company copy is transferred into this repository;
  third-party material follows the clearance rules of ADR-0012.
