---
status: accepted
updated: 2026-10-05
---

# Content lives in the repository as files; no CMS

All four sites author content as `.tsx`, `.mdx`, or `.md` files in this repository, mixed as
each page needs, and translate it through Palamedes. The previous Sebastian Software site kept
all copy, projects, and testimonials in Sanity, with a hosted Studio, request-time queries, and
a live edit mode; Sanity is exported once and retired. The two authors already work in the
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
- The Sanity dataset is the only copy of the old site's content. It must be exported before
  the old site is switched off.
