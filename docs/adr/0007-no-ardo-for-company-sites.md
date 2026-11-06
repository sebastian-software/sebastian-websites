---
status: accepted
updated: 2026-10-05
---

# The company sites do not use Ardo

All three sites are built directly on React Router with the shared packages of this repository.
Ardo is our own documentation framework and the old Open Source site ran on it, so using it
here would be the expected choice. It is not, because Ardo is made for the documentation of
individual projects, while these are marketing sites that share one shell and one brand bar.
Ardo is showcased where it fits: on its own site and in the documentation of the projects.

## Software exception

The Software-specific framework choice is superseded by
[ADR-0019](0019-software-site-on-ardo.md). The original decision above remains the
historical rationale and still applies to the other sites.
