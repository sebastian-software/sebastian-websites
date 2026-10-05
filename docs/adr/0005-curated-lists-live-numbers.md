---
status: accepted
updated: 2026-10-05
---

# Sites curate their lists and read live numbers from the metrics service

Which skills and open-source projects a site shows, and every word a visitor reads about them,
is curated in this repository. Volatile numbers such as stars, versions, downloads, and
reference counts come from the metrics service at `metrics.sebastian-software.com`, which gains
a section for skills. The build bakes a snapshot of those numbers into the HTML and the browser
refreshes them. No build checks out another repository, and no other repository triggers a
build here.

The Skills site is separated from the skills repository, whose descriptions are written for
agents, not for visitors, and exist in English only. A site that owns its visitor copy needs a
hand-written entry per item anyway, so reading the list from another repository would add a
coupling without removing any work.

## Considered options

- **Pin a commit of the skills repository and bump it by automated pull request.**
  Reproducible, but it adds a commit per upstream change and a trigger between repositories.
- **Read the skills repository's `main` at build time.** Numbers would be as old as the last
  build, and a broken upstream state could fail a site deploy.
- **Let the browser call GitHub directly.** Rejected: rate limits, and every visitor's browser
  talks to a third party.

## Consequences

- A new skill or project does not appear until someone adds its entry here. A nightly check
  reports items that exist upstream but are missing on a site.
- Numbers that describe a list, such as "6 skills", are derived from the curated list so they
  always match what is shown.
- The metrics service becomes a runtime dependency of two sites. When it is unreachable, the
  snapshot from the last build stays visible.
- The star-badge proxy of the old Open Source site is no longer needed.
