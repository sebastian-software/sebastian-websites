# Shared content

Data the sites share and that needed a clearance decision before it could enter this public
repository ([ADR-0012](../../docs/adr/0012-public-repository.md)).

- `src/data/testimonials.ts`: the 56 statements the old Software site published, in German
  and English, with author, role, company, date, and which consultant they are about. They
  belong to the Consulting site's references ([overall concept](../../docs/concept/overall-concept.md)).
- `src/data/clients.ts`: the 28 client logos of the old site's home page, by name, with the
  old logo URL.

**Clearance:** the owners decided on 2026-10-06 that the testimonials and client logos of the
old site may be reused as they appeared there. Most statements were originally given on
LinkedIn. The portraits of the authors and the logo files are kept outside Git, in the private
capture folder, until a page needs them.

Everything else a site shows is written in that site's own files.
