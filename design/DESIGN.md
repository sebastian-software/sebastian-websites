# Design system

**Status:** approved by the owners on 2026-10-06 from the round-5 comps
(`comps/r5-software-home.html`, `comps/r5-consulting-home.html`); see
[DIRECTION.md](DIRECTION.md) for how it was reached. This document is the reference the
sites are built against. It is a living document: change it when the design changes, and
record why in DIRECTION.md.

Implementation: `packages/tokens` (scale, palettes, neutrals), `packages/ui` (theme, global
styles, layout, typography, buttons, blocks, Section and SectionHead, brand bar, footer).

## Principles

1. **Variety matched to content.** Each content type has its own form (see the table below).
   Boxes are fine where the content is an object; never boxes inside boxes.
2. **One spacing scale, kept everywhere.** Cramped sections lose their context.
3. **One alignment rule.** Whatever shares a row shares font size and line height, so first
   lines meet. Alignment is checked section by section before anything is shown.
4. **Photos cropped to their subject.** Faces, not walls. Photos never overlap or cut each
   other.
5. **Text-rich.** Sections explain what we do, what it brings, and what drives us. Claims are
   qualitative; numbers are live or absent.
6. **Proof over adjectives, in this order:** client marks, live open-source numbers, curated
   testimonials, the products.
7. **Motion is abstract and rare.** The Consulting terrain hero is the one moving element.

## Brand

- Wordmark and icon as delivered by the brand repository; Open Source and Skills run under the
  Software wordmark with the area named in text.
- **Typefaces:** Sebastian Sans in Light (300) for display and headlines, Regular (400) for
  text, Medium (500) for titles inside sections and names, Semibold (600) for buttons,
  labels, and small caps. Sebastian Slab appears only in the wordmark and as the quotation
  mark of a quote. Fonts load from `https://fonts.sebastian-software.com/fonts.css`
  (ADR-0013).
- **Palette roles per brand** (OKLCH, one hue in six lightness steps; `packages/tokens`):

  | Role     | Software (hue 218) | Consulting (hue 2) | Use                                           |
  | -------- | ------------------ | ------------------ | --------------------------------------------- |
  | `night`  | Space              | Plum               | the Midnight band, the Consulting hero ground |
  | `dark`   | Midnight           | Mulberry           | primary buttons, large numbers, facts         |
  | `base`   | Teal               | Burgundy           | icon fills, the terrain tint                  |
  | `vivid`  | Lagoon             | Ruby               | the one accent: a coloured word, links, marks |
  | `bright` | Signal             | Ember              | accents on dark ground, live dots, glows      |
  | `paper`  | Frost              | Linen              | the page background                           |

- **Neutrals** derived from the hue with low chroma: `ink` (text, L 0.2), `muted` (secondary
  text, L 0.48), `line` (hairlines, L 0.88), `white` (panels and white sections).
- On `night` ground, text is white at 80 % for introductions and labels, 60 % for footnotes;
  rules are white at 15 %. These do not depend on the hue.

## Type scale

| Token    | Size                      | Weight | Notes                                      |
| -------- | ------------------------- | ------ | ------------------------------------------ |
| display  | clamp(56px, 6.4vw, 108px) | 300    | line height 0.98, tracking −0.035em        |
| h2       | clamp(28px, 3.6vw, 44px)  | 300    | line height 1.08, tracking −0.02em         |
| h2 large | clamp(40px, 4.6vw, 72px)  | 300    | the closing headline, max 18ch             |
| h3       | 22px                      | 500    | titles inside sections, tracking −0.01em   |
| card     | 26px                      | 400    | card titles                                |
| lead     | 22px                      | 300    | muted, line height 1.5, max 46ch           |
| intro    | 18px / 1.65               | 400    | muted, max 60ch, the right column of heads |
| body     | 17px / 1.65               | 400    | all running text, max 60ch                 |
| small    | 14px                      | 400    | roles, captions, footers                   |
| tiny     | 13px                      | 400    | facts labels, live notes, brand bar        |
| eyebrow  | 12px                      | 600    | uppercase, tracking 0.12em, muted          |
| numeral  | 80px                      | 300    | live numbers, line height 0.95             |

## Spacing scale

An 8 px base: **8, 16, 24, 40, 64, 96, 128.**

- Sections: 128 px top and bottom. A section that continues the previous one: 96 px top.
- Section head to content: 72 px. Eyebrow to headline: 24 px.
- Columns and split layouts: 64 px apart (80 px for text beside a photo).
- Ruled rows: 36 px of padding. Cards: 40 px of padding. Column rules: 28 px above content.
- Container: 1320 px, 1480 px from 1700 px viewports, 24 px gutters.
- Radii: 999 px for pills, 24 px for cards and photos, 16 px for small tiles.

## Forms by content type

| Content                   | Form                                                                           |
| ------------------------- | ------------------------------------------------------------------------------ |
| Hero                      | Three-line value statement left, square photo right with a caption pill        |
| Client marks              | A white strip, eyebrow left, seven grey marks in a row                         |
| Stance, reasons, families | Three open text columns with a rule above, optional numeral, title, text, link |
| Products, services        | Cards on the opposite tone: status pill, title, text, link at the bottom       |
| Live numbers              | A `night` band: head, three numerals on a rule, a source line                  |
| Results, recurring work   | Ruled rows: title left, text right, one size for both                          |
| People                    | Portrait rows: round 72 px portrait, name, role, one line of text, link        |
| Quotes                    | Three open columns with a slab quotation mark, quote, attribution              |
| Closing                   | Eyebrow, large headline, lead, two buttons, landscape photo right              |

Sections alternate `paper` and `white`; the `night` band appears once per page. Only one
surface level: a card sits on a section, nothing sits in a card but text.

## Alignment rules

- A section head puts the eyebrow above both columns; the introduction is offset 10 px so its
  first line meets the headline's cap height.
- A row shares one font size and line height across its cells (ruled rows, person rows).
- Big numbers align at the top; their labels reserve two lines.
- Links under columns of unequal length are pushed to a common bottom edge.
- Ghost links carry no inline padding, so they start flush with the text above.

## Components

`packages/ui` exports the design as class names and a few components:

- `Section` (tone `paper` | `white` | `night`, `follow`) and `SectionHead` (eyebrow, title,
  intro, `titleAs`).
- `button.primary`, `button.secondary`, `button.ghost`; on `night` ground primary turns white.
- `layout`: container, eyebrow, sectionHead, intro, columns, columnsTwo, split, ctas.
- `typography`: display, displayAccent, h2, h2Large, h3, lead, text, textMuted, prose,
  numeral.
- `blocks`: hero, facts, photo frames and caption, logo band, columns, cards and status,
  ruled rows, numbers, persons, closing grid.
- `BrandBar` and `SiteFooter`, identical on every site.

Sites add their own small components where content meets markup: the Software app has
`Photo`, `LogoBand`, `MetricsBand`, and `Founders`.

## Photos

- Frames: square (hero), landscape 4:3 (company, closing), portrait 4:5 (reserved).
- Every placement declares its focal point as `object-position`; the crop is reviewed with
  the code. The founders' photos from the 2024 shoot: frames 4, 6, 7, 17, 18, 22, 23, 31, 36,
  42, 43 show Sebastian Fastner; 3, 8, 12, 15, 16, 20, 21, 24, 25, 32, 33, 37, 40, 44, 45
  show Sebastian Werner.
- Photos are served from the shared asset zone with Bunny Optimizer (ADR-0014). Until that
  zone is filled, the six photos the Software site uses ship with the app at 1400 px.

## Motion

The Consulting hero carries the current site's terrain: the tinted relief, the route drawn in
on load, the luminous flow, the travelling pulse, and the breathing summit. It honours
`prefers-reduced-motion` and falls back to a static line, and the WebGL flow field is taken
over from the Consulting repository. Nothing else on the sites moves.

## Responsiveness

Desktop first. Below 900 px every grid collapses to one column so that pages stay usable;
the phone design is still to be done and is a launch requirement, not optional.

## Open

- The Consulting, Open Source, and Skills pages have comps for the Consulting home only; the
  other two sites follow the same system when they are built (plans 07 and 08).
- Icons: Streamline style not chosen yet; the system uses none so far.
