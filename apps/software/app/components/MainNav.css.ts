import { color, layout } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const header = style({ backgroundColor: color.paper })

export const inner = style([
  layout.container,
  {
    alignItems: "center",
    display: "flex",
    gap: "32px",
    justifyContent: "space-between",
    minHeight: "72px",
  },
])

export const logo = style({ display: "block", height: "28px", width: "auto" })

export const list = style({
  display: "flex",
  fontSize: "15px",
  gap: "28px",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const link = style({
  color: color.ink,
  selectors: {
    "&:hover, &:focus-visible": { color: color.vivid },
    '&[aria-current="page"]': { color: color.vivid },
  },
})
