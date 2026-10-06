# Software content migration

`legacy/{en,de}/{home,mission}.md` preserves the company-owned copy captured on
2026-10-06. Each file records its original URL and capture date. These files are source
material, not published routes or a new translation catalog.

- Mission copy is the source for the new Company page.
- Home Mission and Team teasers are available for the company introduction.
- The old Consulting teaser belongs to the Consulting site in the new structure.
- Legacy links in the captured files describe the previous site; apply ADR-0010 when
  implementing the new routes rather than rendering these files directly.

The full capture remains outside Git at `~/Workspace/sebastian-software-legacy-content/`.
Testimonials and portraits remain there pending their recorded clearance. Consulting profiles
and service copy already belong to the Consulting repository. Existing legal components are
adapted to the new stack; the old legal texts are historical material only.

Next: transfer the reusable copy into the Software page modules using English source strings
and Palamedes translations. This content work and the delivery foundation can proceed while
the design phase is deferred; production cutover still requires the route and legal checks
in plan 06.
