---
status: accepted
updated: 2026-10-06
---

# URL and redirect contract

Equivalent German and English pages share the same English slug on their respective domains,
so a language switch only replaces the domain. Slugs are never translated, because Palamedes
does not route translated slugs, and paths carry no trailing slash. Every page declares itself
as canonical, links its counterpart in the other language, and names the `.com` page as the
default for unknown languages. Each domain publishes its own sitemap and robots file;
redirects, aliases, and PDFs appear in no sitemap.

Redirects are permanent (301) and exist only for known paths. An unknown path stays 404, and
content that was removed on purpose answers 410. Alias and personal domains stay registered
and redirect indefinitely: `www.` variants and typo domains to the canonical domain,
`sebastianwerner.de`, `sebastianfastner.de`, and `profile.sebastian-software.de` to the
Consulting profiles. Removing one of them needs its own decision.

Legacy paths of the old Software site: `/consulting` redirects to the Consulting site in the
matching language, `/mission` to the new company page, `/privacy-policy` to `/privacy`;
`/team` keeps its path; `/testimonials` redirects to the Consulting references once they
exist and answers 410 until then. The old Consulting path `/fastner/projektprofil` becomes
`/fastner/project-profile` with a redirect.

## Considered options

- **Locale prefixes such as `/de` and `/en`.** Rejected: the domain already carries the
  language, and a prefix would double it.
- **Redirecting removed pages to the home page.** Rejected: it hides broken links and tells
  crawlers that unrelated content is an equivalent replacement.

## Consequences

- The redirect matrix of `sebastian-consulting.de` (its ADR-0002) is the reference for the
  concrete rules and is copied, not re-derived.
- Redirects live in the repository as typed data with table-driven tests
  ([ADR-0009](0009-delivery-model.md)).
