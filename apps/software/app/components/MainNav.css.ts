import { color, font } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

// Structural styles only. The visual design follows plan 01.

export const header = style({
  alignItems: "baseline",
  borderBottom: `1px solid ${color.bright}`,
  display: "flex",
  flexWrap: "wrap",
  fontFamily: font.sans,
  gap: "1rem 2rem",
  padding: "1rem",
})

export const brand = style({
  color: color.dark,
  fontFamily: font.slab,
  fontSize: "1.25rem",
  fontWeight: 700,
  textDecoration: "none",
})

export const list = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: color.dark,
  selectors: {
    "&:hover, &:focus-visible": { textDecoration: "underline" },
    '&[aria-current="page"]': { color: color.vivid, fontWeight: 700 },
  },
  textDecoration: "none",
})
