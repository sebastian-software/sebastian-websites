import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

// The editorial consultant profile: an executive summary on the first page,
// project reports and a compact archive after it. Sizes are set in pt because
// the document is print-first; the screen preview zooms the whole sheet.
// Elena sets headings only; Glober sets everything a reader scans or reads.

export const NARROW_SCREEN = "screen and (max-width: 800px)"

// Paper colors. Text stays near-black so the profile survives a monochrome
// printer; the neutral fill marks the fact panel.
export const ink = printColors.night
export const secondaryInk = "oklch(0.42 0.01 2)"
export const panelFill = "oklch(0.955 0.005 75)"

export const BODY_SIZE = "11pt"
export const SUPPORT_SIZE = "9.5pt"
export const META_SIZE = "9.5pt"

export const keepColors = { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } as const

export const visuallyHidden = style({
  border: 0,
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
})

export const heading = {
  color: ink,
  fontFamily: printFonts.slab,
  fontWeight: 400,
  // Headings wrap between words; a hyphenated heading reads as a typo.
  hyphens: "manual",
  letterSpacing: "-0.01em",
  lineHeight: 1.15,
  textWrap: "balance",
} as const

export const keepWithNext = {
  "@media": { print: { breakAfter: "avoid" } },
  breakAfter: "avoid",
} as const

export const link = style({
  color: "inherit",
  selectors: {
    "&:hover": { textDecoration: "underline", textUnderlineOffset: "2px" },
  },
  textDecoration: "none",
})

// ─── Document sections ──────────────────────────────────────

export const documentSection = style({
  fontSize: BODY_SIZE,
  lineHeight: 1.4,
})

export const sectionTitle = style({
  ...heading,
  ...keepWithNext,
  fontSize: "20pt",
  margin: "0 0 7mm",
})

// Long compounds in the narrow columns hyphenate instead of overflowing.
globalStyle(`${documentSection} p`, { hyphens: "auto" })
