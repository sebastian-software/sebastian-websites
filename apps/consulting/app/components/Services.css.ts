import { COMPACT, editorial, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const list = style([
  editorial.grid,
  {
    "@media": { [PHONE]: { rowGap: "40px" } },
    listStyle: "none",
    margin: 0,
    padding: 0,
    rowGap: "48px",
  },
])

export const item = style({ gridColumn: "span 4" })

export const title = style([
  editorial.heading,
  {
    "@media": {
      [COMPACT]: { fontSize: "30px", marginBottom: "20px" },
      [PHONE]: { fontSize: "26px", marginBottom: "16px" },
    },
    fontSize: "36px",
    lineHeight: 1.22,
    marginBottom: "28px",
  },
])

export const text = style([editorial.body, { fontSize: "19px", lineHeight: 1.55 }])
