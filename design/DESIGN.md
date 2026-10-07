# Design system

**Status:** implemented for desktop on 2026-10-07 from the
[implementation brief](IMPLEMENTATION-BRIEF.md) and its selected references. The phone
composition is the next milestone. The October 6 HTML-comp notes that this file held before
are in its Git history; the comps themselves stay in `design/comps/`.

Implementation: `packages/tokens/src/editorial.ts` (page, type scale, rhythm, frame, editorial
colors), `packages/ui` (frame and editorial primitives), and the three homepages in
`apps/software`, `apps/opensource`, and `apps/consulting`.

## Principles

1. **The current site owns the page.** One complete logo in the header and one in the footer,
   both the current brand's. The other brand is plain outward text and one editorial
   invitation.
2. **An editorial page, not a stack of bands.** Stories alternate illustration and text on one
   12-column grid; white space separates sections instead of rules and tinted bands.
3. **Fixed measure on desktop.** The page is 1040 px wide. Wider windows get wider margins,
   never larger type or wider text.
4. **Explain before persuading.** Each homepage says what the site offers before founders,
   values, or slogans carry the message.

## Page and grid

| Token           | Value                  | Use                                                      |
| --------------- | ---------------------- | -------------------------------------------------------- |
| `PAGE.width`    | 1040 px                | the text edge; 12 columns with 32 px gaps                |
| `PAGE.margin`   | 48 px                  | the smallest margin on narrow desktop windows            |
| `PAGE.overhang` | 24 px                  | header shell and footer panel reach beyond the text edge |
| Story media     | 7 or 6 columns + 40 px | the illustration bleeds 40 px past the page edge         |

Stories alternate by position (`alternate(index)`): text in columns 1–5 beside an illustration
in 6–12, then the illustration in 1–6 beside text in 7–12. Any number of stories keeps the
rhythm; odd collections need no special layout.

## Type

Elena Regular (400) sets headings and editorial passages; Glober sets practical text,
navigation, and actions. New serif text never uses a heavier weight. Original logos keep their
own letterforms.

| Step         | Size / line height | Face   | Use                                               |
| ------------ | ------------------ | ------ | ------------------------------------------------- |
| `display`    | 52 / 1.2           | Elena  | the page headline; 56–64 px where a page has room |
| `title`      | 40 / 1.2           | Elena  | section headings; the invitation uses 46 px       |
| `heading`    | 34 / 1.28          | Elena  | story headings                                    |
| `subheading` | 26 / 1.3           | Elena  | quiet headings                                    |
| `lead`       | 24 / 1.45          | Elena  | the invitation's explanation                      |
| `bodySerif`  | 20 / 1.5           | Elena  | editorial running text                            |
| `action`     | 19 / 1.4           | Glober | inline actions with an arrow                      |
| `body`       | 18 / 1.6           | Glober | practical running text                            |
| `small`      | 16 / 1.5           | Glober | navigation, metadata                              |
| `caption`    | 14 / 1.45          | Glober | captions, the legal baseline                      |

Elena's small x-height is why editorial text runs at 20 px while Glober text runs at 18 px:
both read at the same size.

## Rhythm

Sections are 160 px apart, consecutive stories 160 px. Inside a block: 24 px between heading
and text, 32 px before an action. The newsletter is followed by about 190 px, the invitation by
88 px, and the footer panel keeps 24 px to the bottom of the page.

## Color

Each brand keeps its palette (`PALETTES`, six OKLCH lightness steps) and adds editorial roles
(`EDITORIAL_COLORS`). Components read roles only.

| Role           | Software                     | Consulting                    |
| -------------- | ---------------------------- | ----------------------------- |
| `canvas`       | near-white with a cool trace | neutral warm paper with grain |
| `heading`      | deep teal navy               | dark charcoal                 |
| `text`         | slate                        | warm grey                     |
| `accent`       | Lagoon                       | berry                         |
| `accentStrong` | Midnight                     | berry (filled buttons)        |
| `tint`         | pale teal panels             | not used                      |
| `passage`      | not used                     | the one pink judgment passage |

Header, capsule, and footer panel are achromatic (`FRAME`), so pink and pale-blue fields never
meet. The outward link takes the color of the brand it leads to. Open Source groups use Teal
(tools and services) and Lagoon on Frost (libraries and packages), always with a written
heading.

## Frame

- **Site header** (`SiteHeader`): a 48 px white shell, 16 px from the top and sticky, with
  continuous corners (`corner-shape: squircle` where supported, a 14 px radius elsewhere) and
  one diffuse shadow. Logo at 32 px, local links at 16 px, EN / DE, and a 36 px neutral capsule
  with the outward link and an outward arrow. A skip link is the first focus stop.
- **Newsletter** (`Newsletter`): a quiet heading and description beside an email field and
  Subscribe. A React 19 form action handles pending, success, invalid, and failure states in a
  live region. No service is connected yet; until one is, the form says that sign-up opens
  soon and never claims a subscription.
- **Invitation** (`SiblingInvitation`): an unboxed question, one sentence, one underlined
  outward link, and a small drawing; no logo of the other brand.
- **Footer** (`SiteFooter`): an inset grey panel with the current logo at 88 px, the local
  index, the registered address and email, LinkedIn and GitHub glyphs, and the legal baseline.
- Destinations come from `getSiteFrame()` in `@sebastian-websites/web-core`. Same-site links
  stay relative; cross-site links keep the language. Routes that do not exist yet (the Software
  journal, Consulting references) are left out until they do.

## Imagery

Repository illustrations use `BunnyImage` with `?bunny` imports and reserved dimensions. The
founder portraits come from the shared asset zone with a zoomed focus crop
(`{ mode: "focus", point, zoom }`) tuned per photo, so both heads appear at the same scale in
equal 7:10 frames. Region names on the Mainz–Heidelberg drawing are HTML, so they translate.

## Motion

Arrows nudge toward their destination on hover, only when the visitor has not asked for
reduced motion. Nothing else moves.

## Open

- Phone composition and navigation.
- The newsletter service, the Software journal, the VorOrt logo, and cleared Consulting
  references.
- The invitation drawings reuse existing illustrations; standalone drawings in the style of the
  frame reference can replace them later.
