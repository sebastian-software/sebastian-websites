import { style } from "@vanilla-extract/css"

import { color, font } from "./theme.css.ts"

// Structural styles only. The visual design follows plan 01.

export const footer = style({
  borderTop: `1px solid ${color.bright}`,
  color: color.dark,
  display: "flex",
  flexWrap: "wrap",
  fontFamily: font.sans,
  fontSize: "0.875rem",
  gap: "0.5rem 2rem",
  justifyContent: "space-between",
  marginTop: "4rem",
  padding: "1.5rem 1rem",
})

export const list = style({
  display: "flex",
  gap: "1rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: "inherit",
})
