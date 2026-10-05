---
status: accepted
updated: 2026-10-05
---

# The TLD selects the language; English is the source

Every site is published in German and English. The `.de` domain serves German and the `.com`
domain serves English; switching language means switching domain. Palamedes provides the
catalogs and the TLD switching. English is the source language of all four sites and German is
always a translation, so untranslated content appears in English everywhere.

## Considered options

- **English only for Open Source and Skills.** Rejected: all four sites follow one language
  rule, and the TLD switch behaves the same everywhere.
- **German as the source for Consulting and Software.** Rejected: gaps would then appear in
  German on the `.com` sites, and each site would follow a different rule.
- **Publish a page only when both languages are complete.** Rejected in favour of shipping and
  closing gaps as Palamedes improves.

## Consequences

- There are eight variants. `skills.sebastian-software.de` is new.
- Legal texts, navigation, and each site's primary call to action must be complete in both
  languages; a gap there fails the build. All other gaps are allowed and reported by the build.
- German visitors may see English passages until a translation or a Palamedes capability
  catches up.
