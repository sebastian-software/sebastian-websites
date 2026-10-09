import { FRAME_WIDTH } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

// The screen stage of the printable profiles: the A4 sheet spans exactly the
// width of the site header above it, and the rail hangs beside it in the page
// margin only where that margin can hold it. Print is untouched.

/** Phones read the sheet as a plain page; the stage starts above them. */
export const PAGED = "screen and (min-width: 801px)"

/** Sheet and rail stacked: the rail sits below the sheet. */
export const STACKED = "screen and (801px <= width < 115em)"

/**
 * The rail docks beside the sheet. The header measures about 1100 px in a
 * 1840 px (115 em) window; the margin beside it holds the 18 rem rail, its
 * 2.5 rem gap and about 40 px of air to the window edge.
 */
export const DOCKED = "screen and (width >= 115em)"

const RAIL_WIDTH = "18rem"
const RAIL_GAP = "2.5rem"

/** The A4 sheet's width in CSS pixels at zoom 1 (210 mm). */
const SHEET_WIDTH_PX = 794

// `zoom` needs a plain number: tan(atan2(a, b)) divides the header width by
// the sheet width. The header resolves `100%` against the page; the stage
// canvas is a size container of the same width, so `100cqi` matches it here.
const SHEET_ZOOM = `clamp(0.9, tan(atan2(${FRAME_WIDTH.replaceAll("100%", "100cqi")}, ${String(SHEET_WIDTH_PX)}px)), 1.5)`

/** The full-width area around the stage: the size container for the zoom. */
export const canvas = style({
  "@media": {
    [PAGED]: {
      containerType: "inline-size",
      // Belt and braces: the zoomed sheet must never create a horizontal
      // scrollbar. `clip` (not `hidden`) keeps the sticky rail working.
      overflowX: "clip",
      padding: "2.5rem 0",
    },
  },
})

/** Sheet and rail, as wide as the header and centered like it. */
export const stage = style({
  "@media": {
    [DOCKED]: {
      alignItems: "flex-start",
      display: "flex",
    },
    [PAGED]: {
      marginInline: "auto",
      width: FRAME_WIDTH,
    },
  },
})

/** The sheet: zoomed to the stage width on screen, 1:1 in print. */
export const sheet = style({
  "@media": {
    [DOCKED]: {
      flexShrink: 0,
    },
    [PAGED]: {
      margin: "0 auto",
      zoom: SHEET_ZOOM,
    },
  },
})

/**
 * The rail beside the sheet: its negative right margin cancels its own width
 * and gap, so the sheet stays centered under the header and the rail hangs
 * in the margin.
 */
export const dockedRail = {
  flexShrink: 0,
  marginLeft: RAIL_GAP,
  marginRight: `calc(-1 * (${RAIL_WIDTH} + ${RAIL_GAP}))`,
  position: "sticky",
  // Header (4rem) plus breathing room.
  top: "5.5rem",
  width: RAIL_WIDTH,
} as const
