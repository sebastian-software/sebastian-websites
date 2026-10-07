import { style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

// ─── Profile Header ─────────────────────────────────────────
export const profileHeader = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "2rem",
})

export const logo = style({
  height: "40px",
  width: "auto",
})

export const nameBlock = style({
  alignItems: "flex-end",
  display: "flex",
  flexDirection: "column",
  gap: 0,
  marginBottom: "0.75rem",
})

export const name = style({
  "@media": {
    "screen and (max-width: 800px)": {
      fontSize: "1.5rem",
    },
  },
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "2rem",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: 1,
})

export const nameDegree = style({
  "@media": {
    "screen and (max-width: 800px)": {
      fontSize: "0.75rem",
    },
  },
  color: printColors.dark,
  fontSize: "0.85rem",
  fontWeight: 400,
  lineHeight: 1,
})

// ─── Intro Section (Photo + Bio with text wrap) ─────────────
export const introSection = style({
  // Clearfix for floated photo
  "::after": {
    clear: "both",
    content: '""',
    display: "table",
  },
  "@media": {
    print: {
      breakInside: "avoid",
    },
  },
  breakInside: "avoid",
  marginBottom: "2.25rem",
})

// Photo frame dimensions: 4.5cm × 6cm (128pt × 170pt) — 3:4 portrait
// For 300dpi PDF export, images should be 532×709px
// Photo floats left with bio text wrapping around it
export const photoFrame = style({
  "@media": {
    print: {
      borderWidth: "1pt",
    },
    "screen and (max-width: 800px)": {
      height: "133pt",
      marginRight: "1.25rem",
      width: "100pt",
    },
  },
  border: `1.5pt solid ${printColors.base}`,
  float: "left",
  height: "170pt",
  marginBottom: "1rem",
  marginRight: "1.75rem",
  overflow: "hidden",
  shapeOutside: "margin-box",
  width: "128pt",
})

export const photoFrameImg = style({
  height: "100%",
  objectFit: "cover",
  width: "100%",
})

export const bioText = style({
  fontSize: "0.95rem",
  lineHeight: 1.6,
})

// ─── Stack Grid (Ideal Stack) ───────────────────────────────
export const stackGrid = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
    "screen and (max-width: 800px)": {
      gap: "0.75rem",
      gridTemplateColumns: "1fr",
    },
  },
  breakInside: "avoid",
  display: "grid",
  gap: "1.25rem",
  gridTemplateColumns: "repeat(3, 1fr)",
  marginBottom: "2.25rem",
})

export const stackCategory = style({})

export const stackCategoryHeading = style({
  color: printColors.base,
  fontFamily: printFonts.sans,
  fontSize: "0.9rem",
  fontWeight: 500,
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
  textTransform: "uppercase",
})

export const stackCategoryList = style({
  fontSize: "0.85rem",
  lineHeight: 1.65,
  listStyle: "none",
  margin: 0,
  padding: 0,
})

// ─── Skill Tags ─────────────────────────────────────────────
// Category rows (label + tags) instead of a flat 20-tag cloud: the reader
// scans ~5 chunks, and the "Schwerpunkte" label doubles as the legend for
// the inverted signature tags.
export const skillGroups = style({
  "@media": {
    "screen and (max-width: 800px)": {
      gap: "0.3rem",
      gridTemplateColumns: "1fr",
    },
  },
  display: "grid",
  gap: "0.5rem 1.25rem",
  gridTemplateColumns: "max-content 1fr",
  margin: "0 0 2.25rem",
})

export const skillGroupLabel = style({
  "@media": {
    "screen and (max-width: 800px)": {
      paddingTop: 0,
    },
  },
  color: printColors.dark,
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  // Optically aligns the label with the first tag row's text (tags carry
  // 0.25rem vertical padding).
  paddingTop: "0.3rem",
  textTransform: "uppercase",
})

export const skillGroupTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  margin: 0,
})

export const competencyStatement = style({
  color: printColors.dark,
  fontFamily: printFonts.sans,
  fontSize: "0.85rem",
  margin: "0 0 0.7rem",
})

export const skillTag = style({
  background: printColors.tagBackground,
  color: printColors.dark,
  display: "inline-block",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.03em",
  padding: "0.25rem 0.7rem",
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
})

// Signature competencies: inverted fill plus heavier weight so they stay primary
// even in grayscale. printColorAdjust keeps the fill when printing/exporting to PDF.
export const skillTagPrimary = style({
  background: printColors.base,
  color: printColors.paper,
  fontWeight: 700,
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
})

// ─── Personal Details Grid ──────────────────────────────────
export const detailsGrid = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "1fr",
    },
  },
  // Keep heading + all rows together so the block never splits across a page
  // boundary (paired with the sectionHeading's breakAfter: avoid).
  breakInside: "avoid",
  display: "grid",
  fontSize: "0.85rem",
  gap: "0.35rem 2rem",
  // Label column hugs its content — a 1fr/1fr split parked ~300px of dead
  // space between 15-character labels and their values.
  gridTemplateColumns: "max-content 1fr",
  margin: "0 0 2.25rem",
})

export const detailsLabel = style({
  color: printColors.dark,
  fontWeight: 600,
})

// Row rhythm comes solely from the grid's row-gap; an extra paddingBottom here
// duplicated that spacing and pushed the last row ("Telefon") onto page 2.
export const detailsValue = style({
  margin: 0,
})

// ─── Industry Overview Grid ─────────────────────────────────
export const industryGrid = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  breakInside: "avoid",
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4, 1fr)",
  marginBottom: "2.25rem",
})

export const industryItem = style({
  textAlign: "center",
})

export const industryYears = style({
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: "nowrap",
})

export const industryUnit = style({
  fontSize: "0.6em",
  fontWeight: 400,
})

export const industryLabel = style({
  color: printColors.dark,
  fontSize: "0.68rem",
  letterSpacing: "0.05em",
  marginTop: "0.3rem",
  textTransform: "uppercase",
})
