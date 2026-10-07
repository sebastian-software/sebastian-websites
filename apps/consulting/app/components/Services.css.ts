import { editorial } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const list = style([
  editorial.grid,
  { listStyle: "none", margin: 0, padding: 0, rowGap: "48px" },
])

export const item = style({ gridColumn: "span 4" })

export const title = style([
  editorial.heading,
  { fontSize: "36px", lineHeight: 1.22, marginBottom: "28px" },
])

export const text = style([editorial.body, { fontSize: "19px", lineHeight: 1.55 }])
