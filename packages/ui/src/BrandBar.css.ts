import { style } from "@vanilla-extract/css"

import { container } from "./layout.css.ts"
import { color, NARROW } from "./theme.css.ts"

/** A hairline strip in Frost above the header, visibly secondary. */
export const bar = style({
  backgroundColor: color.paper,
  borderBottom: `1px solid ${color.line}`,
  color: color.muted,
  fontSize: "13px",
})

export const inner = style([
  container,
  {
    "@media": { [NARROW]: { minHeight: "auto", paddingBlock: "8px" } },
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    justifyContent: "space-between",
    minHeight: "36px",
  },
])

export const groups = style({ display: "flex", flexWrap: "wrap", gap: "36px" })

export const list = style({
  display: "flex",
  gap: "18px",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: "inherit",
  selectors: {
    "&:hover, &:focus-visible": { color: color.vivid },
    '&[aria-current="page"], &[aria-current="true"]': { color: color.vivid, fontWeight: 600 },
  },
})

export const brandLink = style({ color: color.ink, fontWeight: 600 })
