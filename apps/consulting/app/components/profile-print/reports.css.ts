import { style } from "@vanilla-extract/css"

import { printFonts } from "~/styles/theme.css"

import { heading, ink, keepWithNext, META_SIZE, NARROW_SCREEN, secondaryInk } from "./editorial.css"

// ─── Project reports ─────────────────────────────────────────

// The aside floats beside the report text instead of sharing a grid row with
// it: floats fragment cleanly across pages, so a report can continue on the
// next sheet without leaving the rest of the page empty.
const REPORT_ASIDE_WIDTH = "40mm"
const REPORT_GUTTER = "8mm"
const reportColumn = {
  "@media": { [NARROW_SCREEN]: { marginRight: 0 } },
  marginRight: `calc(${REPORT_ASIDE_WIDTH} + ${REPORT_GUTTER})`,
} as const

export const report = style({
  display: "flow-root",
  selectors: {
    "& + &": { marginTop: "10mm" },
  },
})

export const reportOpening = style({
  "@media": {
    // Without the float, the aside follows the heading it belongs to.
    [NARROW_SCREEN]: { display: "flex", flexDirection: "column" },
    print: { breakInside: "avoid" },
  },
  breakInside: "avoid",
  marginBottom: "2mm",
})

export const reportHeader = style({
  ...keepWithNext,
  ...reportColumn,
  marginBottom: "3.5mm",
  order: 0,
})

export const reportName = style({
  ...heading,
  ...keepWithNext,
  fontSize: "17pt",
  margin: "0 0 1.5mm",
})

export const reportMeta = style({
  color: secondaryInk,
  fontSize: META_SIZE,
  lineHeight: 1.45,
  margin: 0,
})

export const reportAside = style({
  "@media": {
    [NARROW_SCREEN]: { float: "none", marginBottom: "1rem", marginLeft: 0, order: 1 },
  },
  breakInside: "avoid",
  display: "grid",
  float: "right",
  marginBottom: "3mm",
  marginLeft: REPORT_GUTTER,
  rowGap: "4mm",
  width: REPORT_ASIDE_WIDTH,
})

export const clientMark = style({
  display: "block",
  filter: "grayscale(1) opacity(0.65)",
  height: "auto",
  maxHeight: "9mm",
  maxWidth: "30mm",
  width: "auto",
})

export const reportText = style({
  ...reportColumn,
  "@media": {
    ...reportColumn["@media"],
    print: { orphans: 3, widows: 3 },
  },
  margin: 0,
  order: 2,
  selectors: {
    "& + &": { marginTop: "2mm" },
  },
})

// ─── Earlier experience ──────────────────────────────────────

export const archive = style({
  fontSize: "10pt",
  lineHeight: 1.4,
  marginTop: "13mm",
})

export const archiveList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const archiveEntry = style({
  "@media": {
    [NARROW_SCREEN]: { gridTemplateColumns: "minmax(0, 1fr)", rowGap: "0.2rem" },
    print: { breakInside: "avoid" },
  },
  breakInside: "avoid",
  columnGap: "6mm",
  display: "grid",
  gridTemplateColumns: "22mm minmax(0, 1fr)",
  selectors: {
    "& + &": { marginTop: "3.2mm" },
  },
})

export const archivePeriod = style({
  color: secondaryInk,
  fontSize: META_SIZE,
  fontVariantNumeric: "lining-nums tabular-nums",
  // Sits on the baseline of the client line beside it.
  paddingTop: "0.4mm",
})

export const archiveHeading = style({
  color: ink,
  fontFamily: printFonts.sans,
  fontSize: "10pt",
  fontWeight: 600,
  margin: 0,
})

export const archiveRole = style({
  color: secondaryInk,
  fontWeight: 400,
})

export const archiveText = style({
  margin: "0.5mm 0 0",
})
