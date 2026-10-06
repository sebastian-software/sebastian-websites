import { style } from "@vanilla-extract/css"

import { container } from "./layout.css.ts"
import { color } from "./theme.css.ts"

export const footer = style({
  borderTop: `1px solid ${color.line}`,
  color: color.muted,
  fontSize: "14px",
  padding: "40px 0",
})

export const inner = style([
  container,
  { display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between" },
])

export const list = style({
  display: "flex",
  gap: "20px",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: "inherit",
  selectors: { "&:hover, &:focus-visible": { color: color.vivid } },
})
