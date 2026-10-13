import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

export const navigation = style({
  "@media": { print: { display: "none" } },
  borderBottom: `1px solid ${printColors.pale}`,
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem 1.25rem",
  marginBottom: "2rem",
  paddingBottom: "1rem",
})

export const documentSection = style({
  "::after": { clear: "both", content: '""', display: "table" },
  scrollMarginTop: "6rem",
})

export const history = style({
  "@media": { print: { breakBefore: "page", paddingTop: 0 } },
  borderTop: `1px solid ${printColors.pale}`,
  marginTop: "3rem",
  paddingTop: "2rem",
  scrollMarginTop: "6rem",
})

export const prose = style({
  "@media": { print: { fontSize: "10.5pt", lineHeight: 1.4 } },
  fontSize: "0.95rem",
  lineHeight: 1.6,
})
export const project = style({
  "@media": { print: { marginBottom: "0.9rem" } },
  breakInside: "avoid",
  marginBottom: "1.75rem",
})
export const tableWrapper = style({ overflowWrap: "anywhere" })
export const footer = style({})

export const experience = style({
  "@media": { print: { marginBottom: "0.5rem" } },
  breakInside: "avoid",
  marginBottom: "1.5rem",
})
export const experienceHeader = style({
  "@media": {
    print: { gap: "10pt", gridTemplateColumns: "54pt minmax(0, 1fr)", marginBottom: 0 },
    "screen and (max-width: 480px)": { gap: "0.75rem", gridTemplateColumns: "1fr" },
  },
  alignItems: "center",
  display: "grid",
  gap: "1.25rem",
  gridTemplateColumns: "7rem minmax(0, 1fr)",
  marginBottom: "0.65rem",
})
export const experienceLogos = style({
  "@media": { print: { flexWrap: "nowrap", gap: "3pt" } },
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
})
export const experienceLogo = style({
  "@media": {
    print: {
      flex: "1 1 0",
      height: "14pt",
      maxHeight: "14pt",
      maxWidth: "54pt",
      minWidth: 0,
      width: "100%",
    },
  },
  display: "block",
  height: "auto",
  maxHeight: "2.5rem",
  maxWidth: "6rem",
  objectFit: "contain",
  width: "auto",
})
export const experienceTitle = style({})

globalStyle(`${prose} ${experienceTitle}`, {
  color: printColors.night,
  fontFamily: printFonts.sans,
  fontSize: "inherit",
  fontWeight: 700,
  lineHeight: "inherit",
  margin: 0,
})
globalStyle(`${prose} ${experience} > p`, { marginBottom: 0 })

globalStyle(`${footer} [data-profile-final-section]`, {
  "@media": { print: { gap: "1.5rem", paddingTop: "1.5rem" } },
})
globalStyle(`${footer} [data-profile-final-section] > img`, {
  "@media": { print: { width: "100pt" } },
})
globalStyle(`${footer} [data-profile-final-section] > div`, {
  "@media": {
    print: {
      display: "grid",
      gap: "0.5rem 1rem",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
})
globalStyle(`${footer} [data-profile-final-section] p`, {
  "@media": { print: { margin: 0 } },
})
globalStyle(
  `${footer} [data-profile-final-section] p:first-child, ${footer} [data-profile-final-section] p:nth-child(4), ${footer} [data-profile-final-text="permission"]`,
  { "@media": { print: { gridColumn: "1 / -1" } } }
)

globalStyle(`${prose} h1`, {
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: 1.1,
  margin: "0 0 1rem",
})
globalStyle(`${prose} h2`, {
  "@media": { print: { fontSize: "14pt", margin: "1.3rem 0 0.65rem" } },
  borderBottom: `1pt solid ${printColors.base}`,
  breakAfter: "avoid",
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: 1.3,
  margin: "2rem 0 1rem",
})
globalStyle(`${prose} h3`, {
  "@media": { print: { fontSize: "11.5pt", margin: "1rem 0 0.4rem" } },
  breakAfter: "avoid",
  color: printColors.base,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.4,
  margin: "1.75rem 0 0.5rem",
})
globalStyle(`${prose} p`, {
  "@media": { print: { marginBottom: "0.5rem" } },
  margin: "0 0 0.85rem",
  orphans: 3,
  widows: 3,
})
globalStyle(`${prose} ul`, { margin: "0 0 1rem", paddingLeft: "1.25rem" })
globalStyle(`${prose} li`, { marginBottom: "0.65rem" })
globalStyle(`${prose} a, ${navigation} a`, {
  color: printColors.base,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
})
globalStyle(`${navigation} a`, {
  alignItems: "center",
  display: "inline-flex",
  minHeight: "2.75rem",
})
globalStyle(`${prose} a:focus-visible, ${navigation} a:focus-visible`, {
  outline: `2px solid ${printColors.base}`,
  outlineOffset: "3px",
})
globalStyle(`${prose} table`, { borderCollapse: "collapse", fontSize: "0.85rem", width: "100%" })
globalStyle(`${prose} th, ${prose} td`, {
  borderBottom: `1px solid ${printColors.pale}`,
  padding: "0.75rem 0.5rem",
  textAlign: "left",
  verticalAlign: "top",
})
globalStyle(`${prose} tr`, { breakInside: "avoid" })
globalStyle(`${prose} th:first-child, ${prose} td:first-child`, { width: "32%" })

export const photoFrame = style({ float: "right", margin: "0 0 1rem 1.5rem" })
