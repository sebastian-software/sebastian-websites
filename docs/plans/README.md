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
| [05](05-sanity-export.md)           | Old Software site content exported and sorted                  | —                       |
| [06](06-software-site.md)           | Software site live on both domains                             | 02, 03, 05              |
| [07](07-open-source-site.md)        | Open Source site live on both domains                          | 02, 03, 04              |
| [08](08-skills-site.md)             | Skills site live on both domains, out of the skills repository | 02, 03, 04              |
| [09](09-consulting-site.md)         | Consulting site rebuilt and cut over                           | 02, 03                  |
| [10](10-retire-old-repositories.md) | Old repositories and infrastructure retired                    | 06, 07, 08, 09          |

Plans 01, 04, and 05 can start at once. The build order of the sites is Software, Open
Source, Skills, Consulting.
