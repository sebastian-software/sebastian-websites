# Consulting PDF print calibration

Date: 2026-08-04

This note records why Safari prints the consulting profile larger than Chromium and Firefox at
an apparent scale of 100 percent. The behavior is reproducible with the standalone fixture at
`apps/consulting/scripts/fixtures/print-scale.html`; it is not caused by the profile layout,
fonts, paper size, or page margins.

## Environment

- macOS 26.5.2 (25F84)
- Safari 26.5.2
- Helium 0.14.9.1, Chromium 150
- Firefox 153.0.1
- Playwright Chromium 149
- A4 portrait
- 100 percent or default scale, with no custom scaling
- Headers and footers disabled
- Background graphics enabled so the reference bars remain measurable
- `@page { size: A4 portrait; margin: 20mm; }`

## Fixture design

The page prints five lengths that CSS defines as equivalent to one inch:

| CSS declaration       | Expected PDF width |
| --------------------- | -----------------: |
| `25.4mm`              |               72pt |
| `1in`                 |               72pt |
| `72pt`                |               72pt |
| `96px`                |               72pt |
| `6rem` at a 16px root |               72pt |

A sixth `90px` bar is the control. It should be 67.5pt in a 96-dpi CSS coordinate system, but
it becomes almost exactly 72pt if a renderer behaves as though one inch contains 90 CSS pixels.

The fixture is deliberately narrower than the printable page. A page-wide element can activate
additional shrink-to-fit behavior and partially hide the minimum-scale effect being tested.

## Results

The vector rectangles were measured directly in each PDF content stream rather than from a
raster screenshot.

| Print path                   | Five one-inch bars | 90px control | Effective CSS px per inch |
| ---------------------------- | -----------------: | -----------: | ------------------------: |
| Playwright Chromium 149      |           72.000pt |     67.500pt |                     96.00 |
| Native Helium / Chromium 150 |           72.000pt |     67.500pt |                     96.00 |
| Native Firefox 153           |           72.000pt |     67.500pt |                     96.00 |
| Native Safari 26.5.2         |           76.846pt |     72.043pt |                     89.95 |

Safari enlarges this fixture by 6.731 percent relative to the CSS 96-dpi mapping. The profile PDF
previously measured 6.842 percent larger. The small difference is consistent with the content-
dependent and rounded shrink-to-fit calculation; Safari does not use a stable 107 percent design
scale.

All outputs are A4. The Safari content origin is 56.693pt, which is exactly 20mm, so the fixture
also confirms that `@page` margins are not the source of the content-size difference.

## WebKit cause

CSS defines `1in = 96px` and `1pt = 1/72in`. Chromium and Firefox therefore produce 0.75 PDF
points per CSS pixel.

Current WebKit deliberately retains a minimum print shrink factor of 1.25. Its source comment
says that narrow pages are laid out a little wider to match historical IE and Camino printing and
to use fewer sheets. `PrintContext::begin()` multiplies the layout size by that factor, while
`computeAutomaticScaleFactor()` divides the available paper width by the resulting content
width. For a narrow page, this approaches `1 / 1.25 = 0.8` PDF points per CSS pixel instead of
the expected 0.75. That is equivalent to roughly 90 CSS pixels per physical inch.

The macOS printing path then multiplies WebKit's automatic factor by the scale selected in the
print dialog. Selecting 100 percent therefore preserves the internal automatic factor; it does
not bypass it.

The margins follow a different code path. `computedPageMargin()` explicitly converts CSS lengths
to PDF points with `1 / CSS::pixelsPerPt`, which is why physical `@page` margins remain correct
while the document content is larger.

This behavior has been known for years. WebKit bug 29042 described the 1.25-to-2.0 shrink range in
2009 and requested configurability specifically to obtain predictable print DPI. Chromium later
removed its inherited 1.25 heuristic and documented that the correct conversion factor is 4/3,
because there are 96 CSS pixels and 72 PDF points per inch.

## Sources

- [CSS Values and Units Level 4: absolute lengths](https://www.w3.org/TR/css-values-4/#absolute-lengths)
- [WebKit `PrintContext` minimum and maximum shrink factors](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/PrintContext.h#L93-L104)
- [WebKit layout and automatic scale calculation](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/PrintContext.cpp#L218-L253)
- [WebKit's separate `@page` margin conversion](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/PrintContext.cpp#L102-L133)
- [WebKit macOS print path combines automatic and dialog scales](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/WebProcess/WebPage/WebPage.cpp#L7108-L7130)
- [WebKit bug 29042: custom printing shrink factors](https://bugs.webkit.org/show_bug.cgi?id=29042)
- [Chromium change replacing the inherited print heuristic with the 96px/72pt conversion](https://chromium.googlesource.com/chromium/src/+/f6529c7990744370869e4ab2794caae6c46ba044%5E%21/)
- [CSS Fragmentation Level 3: monolithic content contains no possible break points](https://www.w3.org/TR/css-break-3/#possible-breaks)
- [CSS Containment Level 2: size containment boxes are monolithic](https://www.w3.org/TR/css-contain-2/#containment-size)
- [CSS Containment Level 2: fragmentation must not continue past the layout containment boundary](https://www.w3.org/TR/css-contain-2/#containment-layout)

## Project implication

`PDF_SCALE = 1.07` makes the Chromium-generated download resemble this particular Safari output,
but it encodes the current result of a content-dependent compatibility heuristic. It is not a
paper-size or margin correction and may drift when content width or pagination changes.

The verified CSS-only correction is to give the outer print document the physical width of the
A4 content box:

```css
@page {
  size: A4 portrait;
  margin: 25mm;
}

@media print {
  .print-document {
    box-sizing: border-box;
    max-width: none;
    width: 160mm;
  }
}
```

The same fixture with its outer wrapper widened to the complete 170mm content box produced
71.946pt one-inch bars in Safari, 72.000pt in Chromium, and 72.000pt in Firefox. Safari's error
therefore fell from +6.731 percent to -0.075 percent without changing either other browser.

Use a concrete physical length rather than `width: 100%`, which can resolve against WebKit's
widened print layout. If the design needs a narrower reading measure, constrain an inner element
while keeping the outer print wrapper at the full printable width. There is no stable CSS query
for Safari; feature queries and WebKit-prefixed-property hacks are not a durable browser contract.

Safari also fragmented the profile's multi-page flex column incorrectly after the scale correction:
content from a later section overlapped the preceding project on page 5. Keep containers that span
printed pages in normal block flow inside `@media print`; use flexbox only for screen presentation
or for components that never cross a page boundary. Chromium's pagination is unchanged by this
override.

`display: flow-root` satisfies that rule rather than breaking it. It is block-level normal flow,
not flexbox, so a container fragments exactly as it does under `display: block`, and it
additionally establishes a block formatting context. That is why the profile's print branch uses
it: a container that spans printed pages then keeps its descendants' margins inside itself instead
of letting them collapse out through its edge into the seam between two sheets.

The obvious alternatives are not safe here. A user agent may treat a scroll container
(`overflow: hidden`, `auto`, or `scroll`) or a size-contained box (`contain: size`,
`contain: strict`, or `content-visibility`) as monolithic, and monolithic content contains no
possible break points at all, which would break every container that has to fragment across A4
pages. `contain: layout` additionally stops fragmentation at the containment boundary, and
`contain: paint` clips like `overflow: hidden`. A block formatting context root appears in none of
those lists.

Two limits of that reasoning are worth stating. The Safari evidence above was recorded against
`display: block`; it establishes block-level normal flow over flexbox, and `flow-root` stays on
the block-level side of that distinction, but the `flow-root` variant itself has only ever been
printed from Chromium, because `generatePdfs.ts` drives Chromium alone. And the sheet gap now
exists as contained area rather than as an adjoining margin: Chromium truncates a margin that
would be pushed to the start of a fragmentainer but never truncates contained content, so if
content growth ever moves that seam onto a page boundary, the spacing carries over to the next
page instead of collapsing away.

The canonical generated PDF uses Chromium at scale 1. If the design should be larger, change the
print typography and spacing tokens explicitly and validate the resulting pagination across the
supported print paths.
