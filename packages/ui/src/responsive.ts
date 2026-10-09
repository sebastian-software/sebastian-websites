import {
  BREAKPOINTS,
  type DesignLength,
  em,
  PAGE,
  ROOT_MAX_SCALE,
} from "@sebastian-websites/tokens"

/**
 * Media queries for layout changes below the desktop page. Desktop is the
 * base style everywhere, so these queries only override it. Sizes need no
 * queries: they follow the fluid root.
 */
export const COMPACT = `screen and (max-width: ${BREAKPOINTS.compact})`
export const PHONE = `screen and (max-width: ${BREAKPOINTS.phone})`

/** The desktop page, for rules that must not reach compact screens. */
export const DESKTOP = `screen and (min-width: ${em("1024px")})`

/** The page width: the design width, or the viewport minus the margins. */
export const PAGE_WIDTH = `min(${PAGE.width}, 100% - 2 * ${PAGE.margin})`

/** Header shell and footer panel keep this distance to the viewport edge on narrow screens. */
export const FRAME_INSET = `calc(${PAGE.margin} - ${PAGE.overhang})`

/** Header shell and footer panel reach slightly beyond the page. */
export const FRAME_WIDTH = `min(${PAGE.width} + 2 * ${PAGE.overhang}, 100% - 2 * ${FRAME_INSET})`

/**
 * The root only grows beyond the desktop design in windows wider than 1280 px
 * and taller than 1024 px. `sizes` cannot read the root, so it uses this
 * condition.
 */
const LARGE_ROOT = `(min-width: 1281px) and (min-height: 1025px)`

/** The phone margin on both sides, the smallest the page leaves on narrow screens. */
const NARROW_MARGINS = "40px"

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
 * The `sizes` of an image that fills the page width on compact screens and has
 * a fixed design width on desktop, so phones do not download the desktop
 * candidate.
 *
 * @param desktopWidth - The rendered desktop width in design pixels.
 * @returns The sizes attribute.
 */
export function editorialSizes(desktopWidth: number): string {
  return `(max-width: ${BREAKPOINTS.compact}) calc(100vw - ${NARROW_MARGINS}), ${scaledSizes(desktopWidth)}`
}
