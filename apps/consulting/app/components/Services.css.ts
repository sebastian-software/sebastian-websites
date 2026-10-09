import { color, COMPACT, editorial, PHONE, scaled } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** A quiet visible heading, so the header's Services link lands on its name. */
export const heading = style([
  editorial.subheading,
  {
    "@media": { [PHONE]: { marginBottom: scaled("28px") } },
    color: color.muted,
    marginBottom: scaled("40px"),
  },
])

export const list = style([
  editorial.grid,
  {
    "@media": { [PHONE]: { rowGap: scaled("40px") } },
    listStyle: "none",
    margin: 0,
    padding: 0,
    rowGap: scaled("48px"),
  },
])

export const item = style({ gridColumn: "span 4" })

export const title = style([
  editorial.heading,
  {
    "@media": {
      [COMPACT]: { fontSize: scaled("30px"), marginBottom: scaled("20px") },
      [PHONE]: { fontSize: scaled("26px"), marginBottom: scaled("16px") },
    },
    fontSize: scaled("36px"),
    lineHeight: 1.22,
    marginBottom: scaled("28px"),
  },
])

export const text = style([editorial.body, { fontSize: scaled("19px"), lineHeight: 1.55 }])
