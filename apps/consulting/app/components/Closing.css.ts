import { color, COMPACT, editorial, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const closing = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: "44px" } }, alignItems: "center" },
])

export const copy = style({ gridColumn: "1 / span 5" })

export const title = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: "46px" },
      [PHONE]: { fontSize: "36px", marginBottom: "20px" },
    },
    fontSize: "56px",
    lineHeight: 1.14,
    marginBottom: "28px",
  },
])

export const text = style([
  editorial.body,
  {
    "@media": { [PHONE]: { fontSize: "18px" } },
    fontSize: "20px",
    lineHeight: 1.5,
    marginBottom: "16px",
    maxWidth: "20em",
  },
])

export const note = style([
  editorial.body,
  { color: color.subtle, fontSize: "16px", marginBottom: "36px", maxWidth: "23em" },
])

export const art = style({
  "@media": { [COMPACT]: { marginLeft: 0 } },
  gridColumn: "6 / span 7",
  marginLeft: "24px",
})

export const image = style({
  aspectRatio: "6 / 5",
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})
