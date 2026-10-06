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

State on 2026-10-06: 02 is done except previews (workspace, packages, Software app, CI, and
the delivery to Bunny, which publishes every push to `main` to the origin hosts), 03 is live
for the fonts and the brand site is published on its origin host (the brand hostname and the
external consumers are open), 04 is in review
([oss-metrics#7](https://github.com/sebastian-software/oss-metrics/pull/7), merged), 05 is
done, 01 reached an approved design in five comp rounds (`design/DIRECTION.md`,
`design/DESIGN.md`), and 06 has its pages (home, products, open source, company, contact,
legal) rebuilt on that design system with live numbers from the metrics service, on the
origin hosts in both languages; its domain cutover is open.

The Software home and mission copy in both languages is preserved in
`apps/software/content/legacy/`. The build order of the sites is Software, Open Source,
Skills, Consulting.
