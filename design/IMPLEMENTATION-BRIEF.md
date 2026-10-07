# Website implementation brief

Date: October 7, 2026. Scope: the shared frame and the selected Software, Open
Source, and Consulting homepage designs. This document defines the current visual
implementation direction and the acceptance criteria for its work packages.

## Sources and precedence

Use this brief for requirements, the selected images for composition, and
[frame navigation and copy](../packages/ui/design/refinements-r5/navigation-and-links.json)
for the shared frame's content contract. Images are visual references, not exact
CSS measurements or final copy, logos, product interfaces, or component assets.

| Area              | Selected reference                                                                                   | Role                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Software          | [Product atlas, revision 6](../apps/software/design/homepage.png)                                    | Homepage composition and illustrated product stories                                             |
| Consulting        | [Homepage, revision 9](../apps/consulting/design/homepage.png)                                       | Purpose-first introduction, equal founder portraits, restrained accent passage, ridge-path close |
| Open Source       | [Featured stories, revision 6](../apps/opensource/design/homepage-featured-stories.png)              | Four equally substantial project stories                                                         |
| Open Source       | [Complete tile section, revision 9](../apps/opensource/design/homepage-inline-projects.png)          | Replaces the earlier small-project row; follows the featured stories on the same page            |
| Shared header     | [Both contexts, frame round 5](../packages/ui/design/refinements-r5/header-current-and-outbound.png) | One current-site logo and a secondary outward text link                                          |
| Software ending   | [Page ending, version 5](../apps/software/design/page-ending-v5.png)                                 | Shared newsletter, Consulting invitation, actual Software footer                                 |
| Consulting ending | [Page ending, version 5](../apps/consulting/design/page-ending-v5.png)                               | Shared newsletter, Software invitation, actual Consulting footer                                 |

The version-5 frame replaces the header, newsletter, sibling-brand bridge, and
footer areas drawn into earlier homepage images. Do not concatenate both endings.
Open Source and Skills use the Software frame context. A new Skills homepage is
outside this implementation scope.

The visual prescriptions in [DESIGN.md](DESIGN.md), [DIRECTION.md](DIRECTION.md),
older HTML comps, earlier ImageGen revisions, and plan 01 are historical wherever
they differ from this brief. In particular, the equal-brand navigation bar,
giant/tightly spaced headings, repeated skewed panels, full-width dark Consulting
blocks, and table/overlay project indexes are superseded.

The repository's architecture, language, image-delivery, route, and launch
decisions still apply. Implement against current main, including its shared image
pipeline, rather than reviving an older design branch's runtime conventions.
Relevant technical references are [language variants](../docs/adr/0006-language-by-tld-english-source.md),
[curated lists and metrics](../docs/adr/0005-curated-lists-live-numbers.md),
[shared image component](https://github.com/sebastian-software/sebastian-websites/blob/1a89cffc34cdd45a93a462fb454f4c005b063140/docs/adr/0015-shared-bunny-image-component.md),
and [responsive image usage](https://github.com/sebastian-software/sebastian-websites/blob/1a89cffc34cdd45a93a462fb454f4c005b063140/docs/operations/responsive-images.md).

## What each website needs to communicate

- **Software:** a product company building useful applications, open-source
  foundations, and agent tools. The homepage helps visitors understand and choose
  products.
- **Open Source:** inspectable projects with distinct identities and clear
  practical purposes. The homepage helps visitors choose a project and reach its
  own website or repository.
- **Consulting:** our agency provides software architecture, engineering, and
  technical direction for complex web applications. The homepage explains when
  that support helps, how the collaboration works, and how to start a conversation.

Experience, clarity, enthusiasm, personal responsibility, durable work, and
knowledge sharing inform the copy. Explain the actual offer before relying on
founder presence or abstract positioning to carry the message.

## Shared visual rules

- Use an editorial magazine composition organized by a common column grid.
  Alternate illustration and text positions where the selected design calls for
  it; preserve shared alignment edges through the variation.
- Make complete stories breathe vertically. Distribute space throughout the
  page rather than leaving an oversized early gap and compressing later sections.
  White space may replace divider lines. Cards, rules, open prose, and image
  passages each have a purpose; avoid nested boxes and repeated identical bands.
- Reuse the brand typography exposed by the shared font system: Glober/sans for
  practical text and Elena/serif for editorial passages. New serif text uses
  regular/book weight. Preserve the original logo's own letterforms and weights.
- Keep hero type restrained and headings comfortably spaced. Starting ranges
  for rendered review are 40–56px for the main editorial headline, 28–40px for
  section headings, and 16–18px for body text; use heading line heights around
  1.2–1.35 and body line heights around 1.5–1.7. Finalize these in the shared
  work package against actual content, rather than treating raster sizes as tokens.
- Preserve the Software teal and Consulting berry identities. Consulting should
  feel warm through restrained accents, texture, and composition; avoid a
  pervasive pink tint, beige/pink clashes, harsh dark blocks, or adjacent pink and
  pale-blue panels.
- Use selective geometry: smooth corners in the floating frame and one contained
  diagonal break in Consulting. Do not skew every embedded element.
- Prefer the selected illustrations for product and OSS stories. Avoid browser
  screenshots and substitute stock photography. Do not bake website text into
  new illustrations when it can be rendered as localized HTML.
- Use the complete original brand SVG lockups, including the emblem,
  Sebastian/ prefix, slash, and suffix. The other website is presented as ordinary
  outbound text, not as another logo or a cropped wordmark.

## Shared header

The desktop header is an inset floating shell with continuous iOS-style exterior
corners and a subtle diffuse shadow. Its implementation height target is **48 CSS
pixels**. The current website owns the main identity, navigation, and language
control.

| Context                       | Current logo         | Local links                              | Secondary outward link      |
| ----------------------------- | -------------------- | ---------------------------------------- | --------------------------- |
| Software, Open Source, Skills | Sebastian/Software   | Products · Open Source · Agents & Skills | Our agency ↗, to Consulting |
| Consulting                    | Sebastian/Consulting | Services · Profiles · References         | Our software ↗, to Software |

The outward entry is a smaller plain-text utility capsule at the far end of the
same shell, with neutral fill and generous separation from local controls. It
has no sibling emblem, logo lettering, or competing brand-color panel.

EN / DE belongs to the current website. Locale switching follows the existing
domain-based variant contract. Cross-site links retain the current language.
Use the shared site configuration for destinations and validate each route; the
navigation labels in the reference do not create routes by themselves.

## Newsletter, outward invitation, and actual footer

Maintain three distinct page areas in this exact order:

| Current context               | First             | Second                          | Third             |
| ----------------------------- | ----------------- | ------------------------------- | ----------------- |
| Software, Open Source, Skills | Shared newsletter | Editorial Consulting invitation | Software footer   |
| Consulting                    | Shared newsletter | Editorial Software invitation   | Consulting footer |

The newsletter is a quiet utility passage, not the dominant headline. Its copy is:
"Insights into our work across software and consulting: what we're building,
exploring and thinking about." Use an email field and Subscribe action. It spans
both areas without promising a frequency. Select the integration before enabling
submission, and provide accessible success, error, and pending states.

The invitation is an unboxed editorial spread with a restrained regular-serif
heading, one explanatory paragraph, one ordinary outward link, and a small
illustration. It differs materially from the footer's masthead/index treatment.
Use clear white separation instead of the former newsletter divider.

| Invitation | Heading                                     | Explanation                                                                             | Action                        |
| ---------- | ------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------- |
| Consulting | Need a clearer direction for your software? | Our agency helps teams with software architecture, engineering and technical direction. | Meet Sebastian/Consulting ↗   |
| Software   | See what we build beyond consulting.        | We build products, open-source projects and agent tools for everyday work.              | Discover Sebastian/Software ↗ |

The actual footer is a substantial inset neutral-gray panel with smooth corners
and a faint shadow. It displays only the current brand's complete logo and local
index, followed by registered company details, small single-color social glyphs,
and the legal baseline. It contains neither the newsletter nor a second brand index.

- Software links: Products, Open Source, Agents & Skills, Company, Journal.
- Consulting links: Services, Profiles, References, Book an intro call.
- Registered details: Sebastian Software GmbH; Dalheimer Straße 12; 55128 Mainz;
  Germany; info@sebastian-software.de.
- Company profiles: [LinkedIn](https://www.linkedin.com/company/sebastian-software/)
  and [GitHub](https://github.com/sebastian-software). Use matching small
  single-color interface glyphs, without colorful platform tiles.
- Legal baseline: current-year copyright, Imprint, Privacy, Contact.

Omit phone numbers, regional descriptions, maps, and city illustrations from the
footer. Resolve the Journal destination under Software and the booking destination
under Consulting before enabling links; do not ship dead prototype routes.

## Software product homepage

Use the [Software design and asset gallery](../apps/software/design/README.md).
Present Terminaro, Palamedes+, and VorOrt in alternating illustrated stories, each
with enough copy to explain the user, the problem, the benefit, and the next step.
The composition must support a fourth product and odd collection lengths without
rebuilding the layout. Store product content as a repeatable collection rather
than a fixed pair or bespoke three-panel composition.

Use each product's original identity where available. Palamedes artwork retains
the original white face; do not recolor its head blue, add a globe, or reconstruct
its logo from the mockup. VorOrt's final logo is an open branding decision; retain
its product name as ordinary text until the source artwork is settled.

The company/regional story may represent Mainz and Heidelberg together and the
Rhine-Main and Rhine-Neckar regions. Keep this outside the footer. A symbolic
illustration must not imply adjacent cities on one shared river. Existing product
availability and public descriptions determine claims and calls to action.

## Open Source homepage

Use the [Open Source design and asset gallery](../apps/opensource/design/README.md).
Give **Palamedes, Ferramenta, Dalo, and Ardo** comparably substantial illustrated
feature stories. Each keeps its own logo, typography, and style; small original
marks sit beside the project title instead of dominating the section. The
Software frame organizes the publication without repainting every project as
Software CI. Ferramenta stays one family; its engines are not separate tiles.
Effective remains deferred.

Follow the features with all additional eligible projects on the same page in a
three-column desktop tile grid. No table, overlay, pagination, load-more step, or
Explore all projects destination. Support incomplete rows and future additions
without placeholder projects.

Group the tiles as **Tools & services** and **Libraries & packages**, with
restrained teal versus Lagoon/Frost roles from the Software palette. Written
headings and badges convey grouping independently of color. Keep technology
(for example Rust or TypeScript), kind (CLI, library, service), and runtime as
separate fields; a Rust core alone does not imply a server-only runtime.

The [revision-9 collection seed](../apps/opensource/design/collection-seed.json)
is the initial editorial seed: nine tools/services and four libraries/packages.
Thirteen is a snapshot count, not a layout limit. The curated entry set,
descriptions, grouping, and identity remain repository-owned under ADR-0005.
Metrics supply activity and available numbers, not invented descriptions or types.

Sort additional projects within each group by most recent pushedAt, descending,
with a stable name/key tie-breaker and missing dates last. Keep the featured
sequence editorial. Join npm/crates metadata through repository identity without
creating duplicate project tiles. Pre-render the complete collection with its
build snapshot; refreshing metrics must not hide content or empty the page.
Missing numbers are unknown, not zero. Preserve the last complete display on
refresh failure. Report newly eligible repositories missing from curation.

## Consulting homepage

Use the [Consulting design and asset gallery](../apps/consulting/design/README.md).
The introduction must name software architecture and engineering for complex web
applications, identify situations where the agency helps, and give a meaningful
reason to contact it. Explain services and collaboration beyond two slogan lines.
Carry verified source content forward rather than treating generated raster text
as publishable copy.

Both founders receive equal portrait dimensions, comparable head scale and crop,
aligned captions, and equal prominence. Preserve the neutral textured paper and
one contained berry/pink judgment passage with a subtle diagonal edge. Other
photos and sections remain upright. Remove ornamental eyebrow labels and repeated
flow-line decorations.

The closing landscape shows a visible ridge path toward an overlook or destination,
connecting the image to guidance and clarity. A generic mountain scene does not
serve that purpose. If the terrain metaphor is animated later, show considered
alternatives and adaptation rather than implying that every project has one fixed,
obvious route; honor reduced motion.

Do not publish unapproved client stories, quotes, logos, or generated customer
claims. The multilingual case-study draft stays excluded. Journal content belongs
to Software. Preserve existing profile/PDF contracts while applying the screen
design; this phase does not redesign recruiter-facing documents.

## Implementation boundaries and open decisions

Use shared tokens and components for the frame, typography, spacing, and repeated
story/tile patterns; keep project identity and editorial content site-specific.
Keep English source copy and German translations in the existing Palamedes
workflow. Navigation, legal text, and primary actions must satisfy its completeness
rules.

Use the shared BunnyImage component for raster placements that need Optimizer
transformations, repository raster imports with ?bunny, and normal SVG imports.
Supply placement dimensions, matching sizes, appropriate alt text, reviewed crops,
and loading priority. Private photo originals stay outside the public repository
and are referenced through shared ImageSource descriptors. The original SVG logos
and reusable app assets are the implementation sources; whole-page mockup PNGs
must not become the website UI.

Decide during the relevant work package: final type/spacing tokens, the VorOrt
logo, newsletter service and behavior, final social glyph source, Journal route,
public product status/copy, and cleared Consulting references. The small
invitation drawings in frame version 5 are visual references; reuse a suitable
existing illustration or prepare a standalone asset rather than cropping a
whole-page screenshot into production.

Desktop is the current design milestone. Review representative 1280px, 1440px,
and wide desktop layouts without enlarging content to consume every extra pixel.
Responsive phone composition follows as a separate milestone before public launch.
Do not infer a selected mobile design from archived early frame studies.

DNS cutover, legal review, analytics rollout, profile-PDF redesign, infrastructure
retirement, and new product or Skills-site branding are not delivered by this
visual implementation brief. Existing launch plans continue to govern those tasks.

## Work packages and acceptance

The [tracking issue #15](https://github.com/sebastian-software/sebastian-websites/issues/15)
links four implementation issues:

| Work package                               | Issue                                                                     | Main location                                      |
| ------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------- |
| Shared design system and contextual frame  | [#16](https://github.com/sebastian-software/sebastian-websites/issues/16) | packages/tokens and packages/ui; all site contexts |
| Illustrated Software product homepage      | [#17](https://github.com/sebastian-software/sebastian-websites/issues/17) | apps/software                                      |
| Complete Open Source homepage              | [#18](https://github.com/sebastian-software/sebastian-websites/issues/18) | apps/opensource                                    |
| Consulting homepage and screen integration | [#19](https://github.com/sebastian-software/sebastian-websites/issues/19) | apps/consulting                                    |

The shared package is the dependency for the final site integrations. Editorial
data/copy work can proceed independently. Each issue identifies its selected
images, scope, open decisions, and specific completion checks.

For each implementation PR:

- Compare rendered desktop screenshots to the selected page composition plus
  version-5 frame, including section boundaries, typography, spacing, and alignment.
- Verify that visitors can understand the offer and follow every enabled local,
  cross-site, product/project, language, newsletter, social, and legal action.
- Check keyboard navigation, visible focus, labels and form feedback, meaningful
  heading order, readable contrast, image alt treatment, and reduced motion where used.
- Check both language variants for navigation/legal/primary-action completeness
  and text wrapping. Keep private originals and font license material outside
  the repository.
- Run the repository checks and relevant builds. Add behavioral tests for logic
  such as locale retention, project membership/order, family deduplication, and
  data failure handling; visual rhythm is reviewed through rendered comparisons.

The issue set is complete when the four work packages satisfy these criteria and
their unresolved implementation choices are recorded. Desktop completion does not
authorize a production cutover or mark the broader site launch plans complete.
