---
status: accepted
updated: 2026-10-19
---

# Sites curate their lists and read live numbers from the metrics service

Which open-source projects a site shows, and every word a visitor reads about them, is
curated in this repository. Volatile numbers such as stars, versions, downloads, and the
reference counts of the skills come from the metrics service at
`metrics.sebastian-software.com`, which has a section for skills. The build bakes a snapshot
of those numbers into the HTML. The Open Source homepage adds a compact summary, and
`/metrics` presents the complete public snapshot in the shared Sebastian design system.
Both refresh the public JSON in the browser on opening and periodically while visible,
retaining the previous observation and its collection time if refreshing fails.
No build checks out another repository, and no other
repository triggers a build here.

The skills and their site, Effective Agent, stay in the skills repository as a product of
their own; this repository presents the product and links to it. The sites here never read
the skill list from that repository: the one entry that presents Effective Agent is written
for visitors here, and the numbers about the skills come from the metrics service like every
other number.

## Considered options

- **Pin a commit of the skills repository and bump it by automated pull request.**
  Reproducible, but it adds a commit per upstream change and a trigger between repositories.
- **Read the skills repository's `main` at build time.** Numbers would be as old as the last
  build, and a broken upstream state could fail a site deploy.
- **Let the browser call GitHub directly.** Rejected: rate limits, and every visitor's browser
  talks to a third party.

## Consequences

- A new project does not appear until someone adds its entry here. A nightly check reports
  repositories that exist upstream but are missing on the Open Source site.
- Numbers that describe a curated list are derived from that list. The metrics summary
  explicitly covers all opted-in public repositories and all published packages, including
  packages without a listed repository. Registry time windows stay separate.
- The metrics service becomes a build-time dependency of the Software and Open Source sites.
  When it is unreachable, the snapshot from the last build stays visible.
- The standalone GitHub Pages dashboard redirects to the Open Source metrics page after
  deployment. The metrics service keeps ownership of aggregation and Rybbit credentials;
  the browser receives only public aggregates. Verified, complete, fresh update-check
  counts may use the activity-proxy label with its definition; other coverage stays explicit.
- The star-badge proxy of the old Open Source site is no longer needed.
