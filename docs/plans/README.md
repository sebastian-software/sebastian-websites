# Plans

Work packages that turn the [overall concept](../concept/overall-concept.md) into sites. Each
plan is self-contained and records the commit it was planned against; check for drift before
executing one. Decisions and their reasons live in the [ADRs](../adr/), not here.

| Plan                                | Outcome                                                        | Depends on              |
| ----------------------------------- | -------------------------------------------------------------- | ----------------------- |
| [01](01-design-phase.md)            | Approved drafts of the brand bar and the four home pages       | —                       |
| [02](02-foundation.md)              | Workspace, shared packages, variants, delivery, previews       | 01 for the shell's look |
| [03](03-fonts-and-brand-site.md)    | Fonts served from the CDN; brand site in this repository       | 02                      |
| [04](04-metrics-skills-section.md)  | Metrics service with a skills section and repository status    | —                       |
| [05](05-sanity-export.md)           | Old Software site content captured and sorted                  | —                       |
| [06](06-software-site.md)           | Software site live on both domains                             | 02, 03, 05              |
| [07](07-open-source-site.md)        | Open Source site live on both domains                          | 02, 03, 04              |
| [08](08-skills-site.md)             | Skills site live on both domains, out of the skills repository | 02, 03, 04              |
| [09](09-consulting-site.md)         | Consulting site rebuilt and cut over                           | 02, 03                  |
| [10](10-retire-old-repositories.md) | Old repositories and infrastructure retired                    | 06, 07, 08, 09          |

State on 2026-10-06: 02 is in progress (workspace, packages, Software app, CI done; delivery
to Bunny open), 03 is in progress (brand site and fonts repository done; hosting setup and
consumers open), 04 is in review
([oss-metrics#7](https://github.com/sebastian-software/oss-metrics/pull/7)), 05 is done
except the testimonial clearance.

Design work (01) is deferred. The immediate order is reusable content transfer, font hosting
and its shared CSS contract (03), then production and preview delivery (02). Content routes
can use a minimal semantic structure in the meantime. The Software home and mission copy
in both languages is now preserved in `apps/software/content/legacy/`. The build order of the sites is Software, Open
Source, Skills, Consulting.
