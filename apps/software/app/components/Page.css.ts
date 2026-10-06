import { color, font } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

// Structural styles only. The visual design follows plan 01.

export const main = style({
  color: color.dark,
  fontFamily: font.sans,
  lineHeight: 1.6,
  marginInline: "auto",
  maxWidth: "48rem",
  padding: "2rem 1rem",
})

export const title = style({
  fontFamily: font.slab,
  fontSize: "2.25rem",
  lineHeight: 1.15,
  margin: "0 0 1rem",
})

export const lead = style({
  fontSize: "1.25rem",
  margin: "0 0 2rem",
})

export const section = style({
  marginTop: "2.5rem",
})

export const heading = style({
  fontFamily: font.slab,
  fontSize: "1.5rem",
  margin: "0 0 0.75rem",
})

export const badge = style({
  backgroundColor: color.paper,
  border: `1px solid ${color.bright}`,
  borderRadius: "999px",
  color: color.base,
  display: "inline-block",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  marginLeft: "0.5rem",
  padding: "0.1rem 0.6rem",
  textTransform: "uppercase",
  verticalAlign: "middle",
})

export const link = style({
  color: color.vivid,
})

export const address = style({
  fontStyle: "normal",
})
