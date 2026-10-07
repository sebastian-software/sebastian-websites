# Overall concept

**Status:** complete as of 6 October 2026, pending the owners' confirmation of the whole.
Terms are defined in the [glossary](../../GLOSSARY.md), and decisions with their reasons are
in the [ADRs](../adr/).

## Goal

All websites of Sebastian Software GmbH get one visual system, one central navigation, and the
logo and colour world of their brand. The priorities are clean integration and a refresh. The
old Software site is the most urgent case.

## Brand model

- **Sebastian Software** and **Sebastian Consulting** are brands of equal rank toward the
  outside. Internally, Software is the umbrella brand and Sebastian Software GmbH the legal
  entity.
- **Open Source** and **Skills** are areas beneath Software.
- **Services** and **Profiles** (the consultants' CVs) are areas beneath Consulting.
- Consulting was pulled out into its own site so that the products can be positioned cleanly
  on the Software side. Tone and form of address may differ between the two worlds.
- The company's value statement is "Erfahrung. Klarheit. Begeisterung." ("Experience. Clarity.
  Enthusiasm.").
- Every site addresses an international audience first, while the German roots stay
  noticeable and the offers also work in the DACH market.
- The register is formal everywhere: "Sie" in German, business English in English.
- Sebastian Holding is not part of this project.

## Sites and domains

| Site        | Brand      | German                         | English                         | Today                                             |
| ----------- | ---------- | ------------------------------ | ------------------------------- | ------------------------------------------------- |
| Software    | Software   | `sebastian-software.de`        | `sebastian-software.com`        | Remix with Sanity on AWS; outdated, to be rebuilt |
| Consulting  | Consulting | `sebastian-consulting.de`      | `sebastian-consulting.com`      | In production from `sebastian-consulting.de`      |
| Open Source | Software   | `oss.sebastian-software.de`    | `oss.sebastian-software.com`    | English only, built on Ardo; outdated             |
| Skills      | Software   | `skills.sebastian-software.de` | `skills.sebastian-software.com` | English only, hand-written, on GitHub Pages       |

That makes eight variants. The TLD selects the language
([ADR-0006](../adr/0006-language-by-tld-english-source.md)).

## Products

The Software world separates two kinds of product, and all of them may be shown:

- **Commercial products:** Terminaro, Palamedes+ (announced as coming soon), and a third
  product in preparation.
- **Open-source products:** Palamedes (the open core), Dalo, Ardo, and the other open-source
  projects.

The Software site has two sections: "Products" with the commercial products, and "Open source"
with selected open-source products that lead to the Open Source site, which alone holds the
full catalogue. Palamedes appears in both with a clear role, and the two entries link each
other.

## Boundaries

- Project sites such as palamedes.dev or dalo.sh stay independent and keep their identity.
- Brand families get a prominent place on the Open Source site: not in the brand bar, but as
  top-level sections of the page, below a highlights section and above the remaining projects.
  There are two: Ferramenta and Effective.
- Effective comprises the `effective-*` repositories and skills. The repositories, with their
  last activity, are: effective-icon (October 2026), effective-flow (October 2026),
  effective-mac-setup (August 2026), effective-color, effective-css, effective-css-reset,
  effective-favicon, and effective-shadow (all June 2026). effective-rison is a fork, and
  effective-linkedin-posts, effective-polyfill, and effective-ui-design-skill are archived.
  Several of them need maintenance before they are listed. The six `effective-*` skills belong
  to the family as well.

## Navigation

- A brand bar sits above the main navigation on every site. Each site keeps its own main
  navigation.
- The brand bar shows two groups of equal weight: Software with Open Source and Skills, and
  Consulting with Services and Profiles. Services and Profiles lead into the Consulting site.
  The bar must read as cleanly structured.
- The language switch sits in the brand bar, in the same place on every site. On narrow
  screens the bar collapses into a single "Sebastian" menu.
- On the Consulting site, Services and Profiles appear in the bar and in the main navigation.
  The design resolves the duplication by keeping the bar visibly secondary.
- Open Source and Skills actively promote Consulting: a Consulting section on the home page and
  on every project and skill page, in the way the Ferramenta site ends today. Cards and lists
  stay free of it.

## Information architecture

Pathless; labels are working titles.

```text
sebastian-software.com          Products · Open source · Company · Contact
├─ Home: the company and product maker, with the value statement
├─ Products: Terminaro · Palamedes+ · a third product once announced
│    one product page each with positioning and entry point; the product site is the deep entry
├─ Open source: highlights and the two families, leading to the Open Source site
├─ Company: story, values, team, product development
├─ Contact
└─ Legal

sebastian-consulting.com        Services · How we work · Profiles · References · Book a call
├─ Home
├─ Services: architecture & target state · delivery & quality · enablement & governance;
│    fixed-price offers
├─ How we work: formats, process, availability
├─ Profiles: Werner · Fastner, each with PDF and project profile
├─ References: case studies, testimonials, logos
├─ Contact: book an intro call
└─ Legal

oss.sebastian-software.com      one long page with anchors: Highlights · Families · Projects · Consulting
├─ Highlights: three to five curated projects
├─ Ferramenta: family block, leading to ferramenta.dev
├─ Effective: family block with libraries and skills, leading to the Skills site
├─ All projects by category: name, one-liner, ecosystem, live stars and version, link to
│    site or repository; activity derived from the metrics service, and a project the
│    service no longer lists is retired from the page
├─ Work with us: Consulting
└─ Legal

skills.sebastian-software.com   Skills · Instruction packs · Install · Consulting
├─ Home: what the skills are, the six skills, installation, membership of Effective
├─ Skill pages (6): scope, routes, install command, live numbers
├─ Instruction packs
├─ Comparisons: kept only if it is maintained
├─ Work with us: Consulting
└─ Legal
```

Open-source projects have no detail pages here; their repository or project site is their
home. The Open Source highlights and the fate of the comparisons page are settled with the
content.

## Content and languages

- All four sites are published in German and English. English is the source language;
  Palamedes provides translation and the language switch.
- Content lives as files in the repository, without a CMS
  ([ADR-0004](../adr/0004-content-as-files-no-cms.md)).
- Translation gaps are allowed outside legal texts, navigation, and primary calls to action.
- The sites do not use Ardo ([ADR-0007](../adr/0007-no-ardo-for-company-sites.md)).

## Data for Open Source and Skills

- The Skills site moves out of the skills repository into this monorepo. The skills themselves
  stay in their own public repository.
- Lists and visitor copy are curated here; live numbers come from the metrics service
  ([ADR-0005](../adr/0005-curated-lists-live-numbers.md)).
- Individual skill references are neither rendered as pages nor linked one by one.

## Design

- The design is free. The current Consulting look is only the latest variant, with some good
  ideas, and is not binding. The old Software site and the old Open Source site are outdated
  and carry little weight as references.
- The brand system stays binding: wordmark and icon, the typefaces Sebastian Sans and
  Sebastian Slab, and one hue per brand in six lightness steps. Corrections and extensions to
  it may be proposed.
- Everything above the brand system is open: layout, grid, type scale, imagery, motion, and
  components.
- There is one design for all sites: light and friendly, possibly with inverted accent
  sections. There is no dark mode for now.
- Open Source and Skills run under the Software logo; they get no logo of their own. The area
  is named in text next to it.
- Claims are qualitative and written for marketing, for example "one of the fastest Markdown
  parsers" or "built in modern Rust". There are no hand-maintained figures such as speed
  factors or years of experience.
- The design builds on the company's values, its strengths, and the customers it typically
  addresses, as collected in the [positioning basis](positioning.md).
- The typefaces are licensed for web use on all company sites.

## Technology and hosting

- Static, prerendered sites with React components (React Router and Vite), hosted on Bunny.
- Baseline, workspace layout, and shared packages: [ADR-0008](../adr/0008-technical-baseline-and-workspace.md).
  Icons come from Streamline under the existing Pro licence; the style is chosen in the design
  phase.
- Delivery, previews, recovery, and hosting configuration as single source of truth:
  [ADR-0009](../adr/0009-delivery-model.md).
- URLs, language switching, and redirects: [ADR-0010](../adr/0010-url-and-redirect-contract.md).
- Analytics without cookies or a consent banner: [ADR-0011](../adr/0011-cookieless-analytics.md).
- Images use the shared Bunny asset zone
  ([ADR-0014](../adr/0014-images-from-shared-asset-zone.md)) and `BunnyImage` from
  `@sebastian-websites/ui`
  ([ADR-0015](../adr/0015-shared-bunny-image-component.md)). The
  [responsive images guide](../operations/responsive-images.md) covers imports,
  responsive sizes, crops, and art direction.
- Delivery runs through repository-owned scripts against the Bunny API, not the private
  hosting CLI; the owners confirmed this on 2026-10-06 (ADR-0009).
- Rules that carry over from the July 2026 plan: one primary goal per site (Consulting "book an
  intro call", Software "discover a product", Open Source "open a project", Skills "install a
  skill"); every piece of content has exactly one home and other sites only summarise and
  link; legal texts come from the shared package and are reviewed before each site launches;
  the old repositories stay as references and are archived after launch, once the README
  theme's logo no longer loads from the old Open Source repository.
- A greenfield monorepo ([ADR-0003](../adr/0003-greenfield-monorepo.md)). The base is empty;
  the Consulting repository is a reference, and parts are copied where that makes sense.
- The repository is public ([ADR-0012](../adr/0012-public-repository.md)).
- The brand assets move into this repository as `brand.sebastian-software.com`; the licensed
  typefaces live in a private repository and are served from the CDN
  ([ADR-0013](../adr/0013-brand-assets-in-monorepo-fonts-on-cdn.md)).
- Until it is replaced, the Consulting repository only receives profile maintenance and bug
  fixes. Its pending domain cutover (SEB-74) is dropped and happens with the new Consulting
  site.

## Order of implementation

1. A design phase for all four sites together: the brand bar and the four home pages as
   drafts.
2. Build in this order: Software, Open Source, Skills, Consulting. Software is the most urgent
   case and the brand anchor; Consulting comes last because it works today and its PDF
   profiles make it the most demanding.

The work packages, their dependencies, and verification are in [docs/plans](../plans/README.md).

## Open points

Everything that shapes the overall concept is decided. These points are settled with the
plan or the content of the site they belong to:

- Consulting: Rust in the offer, the current service catalogue, which client logos and
  references are cleared for reuse
- Software: whether recruiting is an audience, and the company story
- Open Source: the highlighted projects; which Effective repositories are maintained enough to
  be listed, and whether effective-css and effective-css-reset become one
- Skills: whether the comparisons page stays
- Implementation: the Streamline icon style, whether effective-icon drives the icon pipeline,
  and when Turborepo pays off

Settled housekeeping outside this repository: the brand README names two brands and the value
statement, the swapped descriptions of the light and dark icons and the background of the dark
Consulting icon are fixed, and these corrections travel with the assets when they move here.
The unreleased export rename in `sebastian-brand` is not published; the package stays frozen
at 1.6.0 until the old Consulting repository is retired.
