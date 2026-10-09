---
status: accepted
updated: 2026-10-10
---

# The root font size follows the device and the window width

All sites size text and layout in rem against a fluid root font size instead of
a fixed desktop page with phone and tablet overrides. A larger screen spends part
of its extra size on readability and the rest on room for content.

The root compensates for reading distance: devices held further away need larger
CSS pixels for the same perceived size. The shorter side of the stable viewport
(`svmin`) stands in for the device, because it tracks the screen size and does
not change when a phone rotates or its toolbar collapses. The root is 16 px at
360 px, 17 px at 400 px, and 18 px from large phones through tablets and
laptops. Beyond that it grows to 20 px, but only in windows that are also wide:
the root is the smaller of the curve along the shorter side and a width curve
from 18 px at 1280 px to 20 px at 2560 px. Widening a desktop window enlarges
the text; making it taller alone does not, and half of a large monitor keeps the
laptop size.

Lengths come from the designs in design pixels. `scaled("24px")` converts a
desktop length to rem against an 18 px root, so laptops and tablets render the
desktop design exactly and large monitors up to 11 % larger. `fluid()` builds
clamp() lengths from any number of stops, in the manner of Utopia (utopia.fyi).

## Considered options

- **Fixed desktop page with breakpoint overrides.** Rejected: extra width became
  margin only, and phone and compact overrides multiplied with every component.
- **Root along the viewport width only.** Rejected: the root then depends on
  layout room, not on the device; a phone in landscape would get desktop text.
- **Root along the shorter side only.** Rejected after use: on desktop the
  shorter side is the window height, so resizing a window felt inverted.
- **Stepped growth for image caching.** Not needed: `srcset` already requests
  images in fixed candidate widths, so a continuous layout does not fragment the
  image CDN's cache.
- **Sizes rounded to whole pixels.** Not needed: browsers lay out and render text
  at fractional sizes.

## Consequences

- Values stay in rem, so the reader's default font size scales everything and
  moves the stops with it, as em-based media queries do. Breakpoints are in em.
- Browser zoom shrinks the viewport in CSS pixels, so the formula takes back
  part of a zoom step: at 200 % zoom on a large monitor, text grows about 1.7×
  and reaches 2× at about 240 %. The largest root stays far below 2.5× the
  smallest, the usual bound for fluid type to meet WCAG 1.4.4 at maximum zoom.
- `sizes` cannot read the root; image placements use helpers
  (`scaledSizes`, `editorialSizes`) that assume the largest root where it can occur.
- Hairlines, shadows, pills, and small radii stay in px; panel radii scale;
  button radii are in em. Touch targets never fall below 44 px.
- The consultant profile sheets keep the reader's default root, because screen
  and print must match the printed A4 page.
