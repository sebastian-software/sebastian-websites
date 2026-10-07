import { style } from "@vanilla-extract/css"

import { printColors, printFonts, printHeadingMetrics } from "~/styles/theme.css"

import "../profile-print/printPageMargin.css"

const PAPER_WIDTH = "210mm"
const PAPER_HEIGHT = "297mm"
const PRINT_WIDTH = "160mm"
// Leave a small page-content safety gap. Chromium can otherwise round an
// exact 247 mm content box onto the following PDF page and clip its first line.
const PRINT_HEIGHT = "245mm"
const MOBILE = "screen and (max-width: 800px)"
const PAGED_SCREEN = "screen and (min-width: 801px)"
const RAIL = "screen and (min-width: 1240px)"
const COMPACT_BLOCK_MARGIN = "0 0 0.45rem"

export const shell = style({
  "@media": {
    [RAIL]: {
      alignItems: "flex-start",
      display: "flex",
      gap: "clamp(2.5rem, 3.5vw, 4rem)",
      justifyContent: "center",
    },
  },
})

export const document = style({
  "@media": {
    [MOBILE]: {
      gap: 0,
      width: "100%",
    },
    [PAGED_SCREEN]: {
      display: "flex",
      flexDirection: "column",
      gap: "12mm",
      margin: "0 auto",
      width: PAPER_WIDTH,
    },
    print: {
      display: "block",
      margin: 0,
      width: PRINT_WIDTH,
    },
  },
})

export const page = style({
  "@media": {
    [MOBILE]: {
      boxShadow: "none",
      height: "auto",
      minHeight: 0,
      padding: "2rem 1.25rem",
      width: "100%",
    },
    [PAGED_SCREEN]: {
      boxShadow: "0 1.5mm 6mm oklch(0.35 0.02 6 / 18%)",
      height: PAPER_HEIGHT,
      padding: "25mm",
      width: PAPER_WIDTH,
    },
    print: {
      boxShadow: "none",
      breakAfter: "page",
      breakInside: "avoid",
      height: PRINT_HEIGHT,
      margin: 0,
      padding: 0,
      width: PRINT_WIDTH,
    },
  },
  background: "white",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  fontSize: "10pt",
  fontSynthesis: "none",
  lineHeight: 1.38,
  overflow: "visible",
})

export const eyebrow = style({
  color: printColors.base,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  margin: COMPACT_BLOCK_MARGIN,
  textTransform: "uppercase",
})

export const profileHeader = style({
  "@media": {
    [MOBILE]: {
      alignItems: "flex-start",
    },
  },
  alignItems: "center",
  borderBottom: `1.5pt solid ${printColors.base}`,
  display: "grid",
  gap: "1.5rem",
  gridTemplateColumns: "1fr auto",
  marginBottom: "1.6rem",
  paddingBottom: "1.25rem",
})

export const name = style({
  "@media": {
    [MOBILE]: {
      fontSize: "1.8rem",
    },
  },
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "2.15rem",
  fontWeight: 500,
  letterSpacing: "-0.025em",
  lineHeight: 1,
  margin: 0,
})

export const role = style({
  color: printColors.dark,
  fontFamily: printFonts.slab,
  fontSize: "1.12rem",
  fontWeight: 500,
  margin: "0.45rem 0 0",
})

export const portrait = style({
  "@media": {
    [MOBILE]: {
      height: "5.5rem",
      width: "4.15rem",
    },
  },
  border: `1pt solid ${printColors.base}`,
  height: "7.5rem",
  objectFit: "cover",
  width: "5.65rem",
})

export const availability = style({
  background: printColors.tagBackground,
  borderLeft: `4pt solid ${printColors.base}`,
  display: "flex",
  flexDirection: "column",
  gap: "0.55rem",
  marginBottom: "1.7rem",
  padding: "0.9rem 1rem",
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
})

export const availabilityPrimary = style({
  color: printColors.base,
  fontWeight: 700,
})

export const availabilityItem = style({
  color: printColors.dark,
  margin: 0,
})

export const profileSummary = style({
  color: printColors.dark,
  fontSize: "0.9rem",
  hyphens: "none",
  lineHeight: 1.45,
  margin: 0,
  maxWidth: "44rem",
  textWrap: "pretty",
})

export const section = style({
  breakInside: "avoid",
  marginBottom: "1.5rem",
})

export const sectionHeading = style({
  borderBottom: `1pt solid ${printColors.base}`,
  breakAfter: "avoid",
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "1.2rem",
  fontWeight: 500,
  ...printHeadingMetrics,
  margin: "0 0 0.8rem",
  paddingBottom: "0.25rem",
})

export const skillList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.45rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const skill = style({
  background: printColors.base,
  color: printColors.paper,
  fontSize: "0.76rem",
  fontWeight: 700,
  padding: "0.28rem 0.72rem",
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
})

export const details = style({
  "@media": {
    [MOBILE]: {
      gridTemplateColumns: "1fr",
    },
  },
  display: "grid",
  gap: "0.35rem 1.25rem",
  gridTemplateColumns: "max-content 1fr",
  margin: 0,
})

export const detailLabel = style({
  color: printColors.dark,
  fontWeight: 700,
})

export const detailValue = style({ margin: 0 })

export const projectGrid = style({
  display: "grid",
  gap: "3rem",
  gridTemplateColumns: "1fr",
})

export const project = style({
  breakInside: "avoid",
})

export const projectHeading = style({
  breakAfter: "avoid",
  color: printColors.night,
  fontFamily: printFonts.slab,
  fontSize: "1.04rem",
  fontWeight: 500,
  ...printHeadingMetrics,
  margin: "0 0 0.2rem",
})

export const projectMeta = style({
  color: printColors.base,
  fontSize: "0.72rem",
  fontWeight: 600,
  margin: COMPACT_BLOCK_MARGIN,
})

export const projectSummary = style({
  margin: COMPACT_BLOCK_MARGIN,
  orphans: 3,
  textAlign: "left",
  textWrap: "pretty",
  widows: 3,
})

export const outcomeList = style({
  margin: "0.35rem 0 0.55rem 1.1rem",
  padding: 0,
})

export const outcome = style({
  marginBottom: "0.22rem",
  orphans: 3,
  widows: 3,
})

export const technologies = style({
  color: printColors.dark,
  fontSize: "0.7rem",
  fontWeight: 600,
  margin: "0.35rem 0 0",
})

export const link = style({
  color: printColors.base,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
})
export const careerList = style({
  display: "grid",
  gap: "0.4rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const careerItem = style({
  display: "grid",
  fontSize: "0.72rem",
  gap: "0.75rem",
  gridTemplateColumns: "5rem 1fr",
})

export const careerPeriod = style({
  color: printColors.base,
  fontVariantNumeric: "lining-nums tabular-nums",
  fontWeight: 700,
})

export const pageMarker = style({
  borderTop: `0.5pt solid ${printColors.pale}`,
  color: printColors.dark,
  fontSize: "0.62rem",
  marginTop: "auto",
  paddingTop: "0.45rem",
  textAlign: "right",
})
