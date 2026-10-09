import {
  BREAKPOINTS,
  DESIGN_PAGE_WIDTH,
  type DesignLength,
  LAYOUT_SPLIT,
  PAGE,
  ROOT_MAX_SCALE,
  scaled,
} from "@sebastian-websites/tokens"

/**
 * Media queries for layout changes below the desktop page. Desktop is the
 * base style everywhere, so these queries only override it. Sizes need no
 * queries: they follow the fluid root.
 */
export const COMPACT = `screen and (max-width: ${BREAKPOINTS.compact})`
export const PHONE = `screen and (max-width: ${BREAKPOINTS.phone})`

/** The desktop page, for rules that must not reach compact screens. */
export const DESKTOP = `screen and (min-width: ${LAYOUT_SPLIT})`

/** The page width: the full grid, or the viewport minus the margins. */
export const PAGE_WIDTH = `min(${PAGE.width}, 100% - 2 * ${PAGE.margin})`

/**
 * The margin beside the page: the page margin, or more where the grid has
 * reached its full width. `100vw` includes a classic scrollbar, so only shares
 * of this margin are safe to use.
 */
export const PAGE_MARGIN = `max(${PAGE.margin}, (100vw - ${PAGE.width}) / 2)`

/**
 * How far an element reaches beyond the page edge: its design length, but at
 * most half the margin, which starts tight on small screens.
 *
 * @param length - The reach in design pixels, such as `"40px"`.
 * @returns The CSS length.
 */
export function bleed(length: DesignLength): string {
  return `min(${scaled(length)}, ${PAGE_MARGIN} / 2)`
}

/** Header shell and footer panel reach this far beyond the text edge. */
export const FRAME_OVERHANG = `min(${PAGE.overhang}, ${PAGE_MARGIN} / 2)`

/** Header shell and footer panel keep this distance to the viewport edge on narrow screens. */
export const FRAME_INSET = `calc(${PAGE.margin} - ${FRAME_OVERHANG})`

/** Header shell and footer panel reach slightly beyond the page. */
export const FRAME_WIDTH = `min(${PAGE.width} + 2 * ${FRAME_OVERHANG}, 100% - 2 * ${FRAME_INSET})`

/**
 * The root only grows beyond the desktop design in windows wider than 1280 px
 * and taller than 1024 px. `sizes` cannot read the root, so it uses this
 * condition.
 */
const LARGE_ROOT = `(min-width: 1281px) and (min-height: 1025px)`

/** The smallest margins on both sides of a compact page. */
const NARROW_MARGINS = "32px"

/**
 * The page width the desktop grid reaches at least up to each viewport width,
 * rounded up. `sizes` cannot evaluate the grid, so it uses these steps.
 */
const PAGE_STEPS = [
  { from: "1700px", page: 1400 },
  { from: "1281px", page: 1200 },
] as const

/** The page width of the narrower desktop windows, rounded up. */
const PAGE_BASE = 1100

/**
 * The `sizes` of an image with a fixed design width, such as a portrait or
 * avatar, which grows with the root on large screens.
 *
 * @param width - The rendered width in design pixels, as a number or `"72px"`.
 * @returns The sizes attribute.
 */
export function scaledSizes(width: DesignLength | number): string {
  const designWidth = typeof width === "number" ? width : Number.parseFloat(width)
  return `${LARGE_ROOT} ${String(Math.ceil(designWidth * ROOT_MAX_SCALE))}px, ${String(designWidth)}px`
}

/**
 * The `sizes` of an image that fills the page width on compact screens and
 * takes a share of the desktop grid, so phones do not download the desktop
 * candidate and large screens get one that matches the wider grid.
 *
 * @param desktopWidth - The rendered width in design pixels on the 1040 px design page.
 * @returns The sizes attribute.
 */
export function editorialSizes(desktopWidth: number): string {
  const share = desktopWidth / DESIGN_PAGE_WIDTH
  const width = (page: number): string => `${String(Math.ceil(page * share))}px`
  return [
    `(max-width: ${BREAKPOINTS.compact}) calc(100vw - ${NARROW_MARGINS})`,
    ...PAGE_STEPS.map(({ from, page }) => `(min-width: ${from}) ${width(page)}`),
    width(PAGE_BASE),
  ].join(", ")
}
