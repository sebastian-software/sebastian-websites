import { globalStyle, style } from "@vanilla-extract/css"

import {
  BODY_SIZE,
  heading,
  keepColors,
  keepWithNext,
  NARROW_SCREEN,
  panelFill,
  secondaryInk,
  SUPPORT_SIZE,
} from "./editorial.css"

// ─── Page 1: executive summary ─────────────────────────────

/** The summary always fills exactly the first sheet; the reports start on page 2. */
export const summaryPage = style({
  "@media": {
    print: { breakAfter: "page" },
  },
  breakAfter: "page",
  fontSize: BODY_SIZE,
  lineHeight: 1.4,
})

export const brandLogo = style({
  // The print lockup carries its own padding; the negative offset aligns the
  // wordmark with the text edge below it.
  display: "block",
  height: "auto",
  marginBottom: "6mm",
  marginLeft: "-2.4mm",
  width: "52mm",
})

export const identity = style({
  "@media": {
    [NARROW_SCREEN]: { gap: "1.25rem" },
  },
  alignItems: "start",
  columnGap: "8mm",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  marginBottom: "6mm",
})

export const name = style({
  ...heading,
  "@media": {
    [NARROW_SCREEN]: { fontSize: "21pt" },
  },
  fontSize: "25pt",
  letterSpacing: "-0.015em",
  lineHeight: 1.05,
  margin: "0 0 2.5mm",
})

export const jobTitle = style({
  fontSize: "13pt",
  lineHeight: 1.3,
  margin: "0 0 1mm",
})

export const specialties = style({
  color: secondaryInk,
  fontSize: BODY_SIZE,
  margin: 0,
  selectors: {
    "& + &": { fontSize: "9.5pt", marginTop: "1mm" },
  },
})

export const portrait = style({
  "@media": {
    [NARROW_SCREEN]: { height: "33mm", width: "25mm" },
  },
  display: "block",
  height: "40mm",
  margin: 0,
  objectFit: "cover",
  width: "30mm",
})

export const introduction = style({
  display: "grid",
  margin: "0 0 7mm",
  rowGap: "2mm",
})

export const summaryColumns = style({
  "@media": {
    [NARROW_SCREEN]: { gridTemplateColumns: "minmax(0, 1fr)", rowGap: "2rem" },
  },
  alignItems: "start",
  columnGap: "9mm",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 54mm",
})

export const summaryHeading = style({
  ...heading,
  ...keepWithNext,
  fontSize: "16pt",
  margin: "0 0 4mm",
})

export const contactList = style({
  display: "grid",
  margin: 0,
  rowGap: "2mm",
})

export const contactItem = style({
  alignItems: "center",
  columnGap: "3mm",
  display: "grid",
  gridTemplateColumns: "4.2mm minmax(0, 1fr)",
})

export const contactIcon = style({
  color: secondaryInk,
  display: "block",
  height: "4.2mm",
  width: "4.2mm",
})

export const contactValue = style({
  fontSize: "10pt",
  margin: 0,
})

/** "Work in practice": short examples set beside the principles. */
export const factPanel = style({
  ...keepColors,
  background: panelFill,
  fontSize: SUPPORT_SIZE,
  lineHeight: 1.4,
  padding: "5mm 5mm 6mm",
})

export const factPanelHeading = style({
  ...heading,
  ...keepWithNext,
  fontSize: "14pt",
  margin: "0 0 5mm",
})

// Long compounds in the narrow columns hyphenate instead of overflowing.
globalStyle(`${summaryPage} p`, { hyphens: "auto" })

export const industryList = style({
  display: "grid",
  margin: 0,
  rowGap: "2.2mm",
})

export const industryRow = style({
  alignItems: "baseline",
  columnGap: "3mm",
  display: "flex",
  justifyContent: "space-between",
})

export const industryName = style({
  margin: 0,
})

export const industryYears = style({
  color: secondaryInk,
  fontVariantNumeric: "lining-nums tabular-nums",
  margin: 0,
  whiteSpace: "nowrap",
})
