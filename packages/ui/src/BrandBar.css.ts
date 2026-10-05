import { style } from "@vanilla-extract/css"

import { color, font } from "./theme.css.ts"

// Structural styles only. The visual design follows plan 01.

export const bar = style({
  alignItems: "center",
  backgroundColor: color.paper,
  borderBottom: `1px solid ${color.bright}`,
  color: color.dark,
  display: "flex",
  flexWrap: "wrap",
  fontFamily: font.sans,
  fontSize: "0.8125rem",
  gap: "0.5rem 2rem",
  justifyContent: "space-between",
  padding: "0.375rem 1rem",
})

export const groups = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem 2rem",
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
  selectors: {
    "&:hover, &:focus-visible": { textDecoration: "underline" },
    '&[aria-current="page"]': { color: color.vivid, fontWeight: 700 },
  },
  textDecoration: "none",
})

export const brandLink = style({
  fontWeight: 700,
})
