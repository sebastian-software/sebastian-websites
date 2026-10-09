---
status: accepted
updated: 2026-10-10
---

# Space grows per layout class, and the page is a fluid grid

Type takes its share of a larger screen first ([ADR-0016](0016-fluid-root-font-size.md)).
The space scale distributes what is left, separately for each layout class, and
the page grid turns it into room for content.

Below 960 px, pages use the stacked mobile layout; from 960 px, the column
layout. 960 px sits just above the widest phone in landscape (956 px), so phones
keep the mobile layout when rotated, while small tablets in landscape get a small
desktop. The same split governs the compact breakpoint, the space classes, and
the type scale's ratio.

The space scale follows Utopia (utopia.fyi): every step from `3xs` to `4xl` is a
multiple of the base space `s`. Each layout class starts tight, with `s` at 16 px,
and grows across its own range: the mobile class to 24 px at 959 px, the desktop
class to 28 px at 1920 px; beyond that, space follows the root. At 960 px the
scale drops back to 16 px, because the columns need the room first. The steps
are custom properties on the root, one block per layout class.

The page is a fluid grid after Utopia's grid: twelve columns that grow with the
root and gutters from the space scale (`l`). It fills the width between its
margins (`s`) up to twelve of its widest columns and their gutters; beyond that,
the margins take the rest. Section rhythm and the spacing names of the first
Software design map to steps of the scale.

## Considered options

- **One space range from phone to large monitor.** Rejected: small desktops
  would start with generous spacing exactly where the columns are tightest.
- **A split at 768 or 920 px.** Rejected: phones in landscape (844–956 px wide,
  about 400 px tall) and portrait tablets would get the column layout.
- **A fixed grid width, as in Utopia's calculator.** Rejected: large screens
  would gain margin only; a grid that grows with type and gutters shows more
  content side by side.
- **Measure tokens in em for text blocks.** Rejected: they would add a parallel
  set of hard-coded widths; headings get a type step that fits their column
  instead ([ADR-0018](0018-type-scale-with-growing-ratio.md)).

## Consequences

- Small desktops are tighter than the original design: at 960 px, section space
  is 96 px and the margin 16 px.
- Header, footer, illustrations, and panels reach beyond the text edge by at most
  half the margin (`bleed`, `FRAME_OVERHANG`), so tight margins never cause
  horizontal scrolling.
- The separate 1320/1480 px container of the first Software design is gone; all
  pages share one grid.
