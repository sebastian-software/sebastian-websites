import { color, editorial } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const closing = style([editorial.grid, { alignItems: "center" }])

export const copy = style({ gridColumn: "1 / span 5" })

export const title = style([
  editorial.display,
  { fontSize: "56px", lineHeight: 1.14, marginBottom: "28px" },
])

export const text = style([
  editorial.body,
  { fontSize: "20px", lineHeight: 1.5, marginBottom: "16px", maxWidth: "20em" },
])

export const note = style([
  editorial.body,
  { color: color.subtle, fontSize: "16px", marginBottom: "36px", maxWidth: "23em" },
])

export const art = style({ gridColumn: "6 / span 7", marginLeft: "24px" })

export const image = style({
  aspectRatio: "6 / 5",
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})
