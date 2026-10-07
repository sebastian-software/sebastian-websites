import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

const ALIGN_START = "flex-start"
const TIER2_CELL_PADDING = "0.35rem 0.5rem 0.35rem 0"

// ─── Project Tier 1: Full Detail ────────────────────────────
export const projectTier1 = style({
  marginBottom: "2.5rem",
})

// Articles may break across pages — keeping whole 400–600px articles intact
// produced half-empty pages in print. The head block (logo/meta/header) stays
// glued to the first text lines via breakAfter, orphans/widows protect the rest.
export const projectTier1Article = style({
  display: "flex",
  flexDirection: "column",
  marginBottom: "3.5rem",
})

export const projectLogoCell = style({
  "@media": {
    print: {
      breakAfter: "avoid",
    },
  },
  alignItems: ALIGN_START,
  display: "flex",
  justifyContent: ALIGN_START,
  marginBottom: "0.5rem",
})

// ─── Placeholder Logo Box ───────────────────────────────────
export const projectLogoPlaceholder = style({
  "@media": {
    print: {
      opacity: 0.4,
    },
  },
  alignItems: "center",
  border: `1pt dashed ${printColors.base}`,
  color: printColors.base,
  display: "flex",
  fontSize: "0.55rem",
  fontWeight: 600,
  height: "34pt",
  justifyContent: "center",
  letterSpacing: "0.08em",
  opacity: 0.6,
  textTransform: "uppercase",
  width: "60pt",
})

export const projectLogo = style({
  filter: "grayscale(1) opacity(0.6)",
  height: "auto",
  maxHeight: "34pt",
  maxWidth: "60pt",
  width: "auto",
})

export const projectContent = style({})

export const projectHeader = style({
  "@media": {
    print: {
      breakAfter: "avoid",
    },
    "screen and (max-width: 800px)": {
      flexDirection: "column",
      gap: "0.15rem",
    },
  },
  alignItems: "baseline",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
})

export const projectRole = style({
  color: printColors.night,
  fontFamily: printFonts.slab,
  fontSize: "1.1rem",
  fontWeight: 500,
})

export const projectPeriod = style({
  color: printColors.base,
  fontSize: "0.72rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
})

export const projectMeta = style({
  "@media": {
    print: {
      breakAfter: "avoid",
    },
  },
  color: printColors.dark,
  fontSize: "0.72rem",
  marginBottom: "0.25rem",
})

export const projectDescription = style({
  "@media": {
    print: {
      orphans: 3,
      widows: 3,
    },
    // Ragged right on phones (see `paragraph` in print.css.ts); print keeps
    // the justified document register.
    "screen and (max-width: 800px)": {
      textAlign: "left",
    },
  },
  fontSize: "0.85rem",
  lineHeight: 1.55,
  marginBottom: "0.4rem",
  textAlign: "justify",
  textWrap: "pretty",
})

export const projectResults = style({
  "@media": {
    print: {
      orphans: 3,
      widows: 3,
    },
  },
  color: printColors.dark,
  fontSize: "0.85rem",
  fontStyle: "italic",
  lineHeight: 1.55,
  marginBottom: "0.5rem",
})

export const projectTech = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
  },
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
  marginTop: "0.5rem",
})

export const projectTechTag = style({
  background: printColors.tagBackground,
  color: printColors.dark,
  fontSize: "0.68rem",
  padding: "0.18rem 0.5rem",
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
})

// ─── Project Tier 2: Compact Table ──────────────────────────
export const projectTier2 = style({
  // Continue naturally after the detailed projects. A forced page break made
  // the generated PDF one page longer than the browser print version.
  marginBottom: "1.5rem",
})

// Logo strip showing unique companies from tier 2/3 projects
export const logoStrip = style({
  alignItems: "center",
  borderBottom: `0.5pt solid ${printColors.pale}`,
  display: "flex",
  flexWrap: "wrap",
  gap: "1.25rem",
  marginBottom: "1.25rem",
  paddingBottom: "0.75rem",
})

export const logoStripItem = style({
  filter: "grayscale(1) opacity(0.6)",
  height: "20pt",
  maxWidth: "60pt",
  objectFit: "contain",
  width: "auto",
})

export const logoStripPlaceholder = style({
  alignItems: "center",
  background: printColors.tagBackground,
  border: `0.5pt solid ${printColors.pale}`,
  color: printColors.dark,
  display: "inline-flex",
  fontSize: "0.55rem",
  fontWeight: 500,
  height: "20pt",
  justifyContent: "center",
  letterSpacing: "0.03em",
  maxWidth: "60pt",
  overflow: "hidden",
  padding: "0 0.5rem",
  printColorAdjust: "exact",
  textOverflow: "ellipsis",
  textTransform: "uppercase",
  WebkitPrintColorAdjust: "exact",
  whiteSpace: "nowrap",
})

export const projectTier2Table = style({
  "@media": {
    // 0.72rem is print-calibrated; on screen it renders at 11.5px body text.
    // Bump for reading size — the printed PDF keeps the original metric.
    screen: {
      fontSize: "0.8rem",
    },
    "screen and (max-width: 800px)": {
      overflowX: "auto",
    },
  },
  borderCollapse: "collapse",
  fontSize: "0.72rem",
  marginBottom: "1rem",
  width: "100%",
})

// Keep rows intact across page breaks and avoid a lone orphan row (with its
// repeated table header) starting a new print page.
globalStyle(`${projectTier2Table} tr`, {
  "@media": {
    print: {
      breakInside: "avoid",
    },
  },
})

globalStyle(`${projectTier2Table} tbody tr:last-child`, {
  "@media": {
    print: {
      breakBefore: "avoid",
    },
  },
})

export const projectTier2Th = style({
  "@media": {
    screen: {
      fontSize: "0.72rem",
    },
  },
  borderBottom: `1pt solid ${printColors.base}`,
  color: printColors.base,
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  padding: "0.3rem 0.5rem 0.3rem 0",
  textAlign: "left",
  textTransform: "uppercase",
})

export const projectTier2Td = style({
  borderBottom: `0.5pt solid ${printColors.pale}`,
  padding: TIER2_CELL_PADDING,
  verticalAlign: "top",
})

export const projectTier2TdCustomer = style({
  borderBottom: `0.5pt solid ${printColors.pale}`,
  hyphens: "none",
  padding: TIER2_CELL_PADDING,
  verticalAlign: "top",
})

export const projectTier2TdPeriod = style({
  borderBottom: `0.5pt solid ${printColors.pale}`,
  padding: TIER2_CELL_PADDING,
  verticalAlign: "top",
  whiteSpace: "nowrap",
})

// ─── Company Contact Section ─────────────────────────────────
// Print-only: register court, VAT id and build date are mandatory PDF content
// but a conversion-dead ending in the browser — there the screen-only closing
// CTA section takes over.
export const companyContact = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
    screen: {
      display: "none",
    },
  },
  alignItems: ALIGN_START,
  breakInside: "avoid",
  display: "flex",
  gap: "2.5rem",
  justifyContent: "center",
  marginTop: "auto",
  paddingTop: "3rem",
})

export const companyContactLogo = style({
  "@media": {
    "screen and (max-width: 800px)": {
      width: "140pt",
    },
  },
  flexShrink: 0,
  height: "auto",
  width: "180pt",
})

export const companyContactDetails = style({
  color: printColors.night,
  fontSize: "0.85rem",
  lineHeight: 1.6,
})

export const companyContactBrand = style({
  color: printColors.dark,
  fontSize: "0.75rem",
  marginBottom: "0.15rem",
})

export const companyContactName = style({
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "1rem",
  fontWeight: 500,
  marginBottom: "0.75rem",
  marginTop: "0.875rem",
})

export const companyContactAddress = style({
  marginBottom: "0.5rem",
})

export const companyContactInfo = style({
  color: printColors.dark,
  fontSize: "0.75rem",
  marginBottom: "0.75rem",
})

export const companyContactLinks = style({
  fontSize: "0.85rem",
})

export const companyContactCopyright = style({
  color: printColors.dark,
  fontSize: "0.7rem",
  marginTop: "1rem",
})
