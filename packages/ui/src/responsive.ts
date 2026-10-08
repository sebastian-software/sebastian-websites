import { BREAKPOINTS, COMPACT_PAGE, PAGE } from "@sebastian-websites/tokens"

/**
 * Media queries for the layouts below the fixed desktop page. Desktop from
 * 1024 px is the base style everywhere, so these queries only override it.
 */
export const COMPACT = `screen and (max-width: ${BREAKPOINTS.compact})`
export const PHONE = `screen and (max-width: ${BREAKPOINTS.phone})`

/** The desktop page, for rules that must not reach compact screens. */
export const DESKTOP = `screen and (min-width: calc(${BREAKPOINTS.compact} + 1px))`

/** The page width on compact screens and phones: the viewport minus the margins. */
export const COMPACT_WIDTH = `calc(100% - 2 * ${COMPACT_PAGE.compactMargin})`
export const PHONE_WIDTH = `calc(100% - 2 * ${COMPACT_PAGE.phoneMargin})`

/** Header shell and footer panel reach slightly beyond the page on every layout. */
export const FRAME_WIDTH = {
  compact: `calc(100% - 2 * (${COMPACT_PAGE.compactMargin} - ${COMPACT_PAGE.compactOverhang}))`,
  desktop: `min(calc(${PAGE.width} + 2 * ${PAGE.overhang}), 100% - 2 * (${PAGE.margin} - ${PAGE.overhang}))`,
  phone: `calc(100% - 2 * (${COMPACT_PAGE.phoneMargin} - ${COMPACT_PAGE.phoneOverhang}))`,
} as const

/**
 * The `sizes` of an image that fills the page width on compact screens and has
 * a fixed width on desktop, so phones do not download the desktop candidate.
 *
 * @param desktopWidth - The rendered desktop width in CSS pixels.
 * @returns The sizes attribute.
 */
export function editorialSizes(desktopWidth: number): string {
  return [
    `(max-width: ${BREAKPOINTS.phone}) ${PHONE_WIDTH.replace("100%", "100vw")}`,
    `(max-width: ${BREAKPOINTS.compact}) ${COMPACT_WIDTH.replace("100%", "100vw")}`,
    `${String(desktopWidth)}px`,
  ].join(", ")
}
