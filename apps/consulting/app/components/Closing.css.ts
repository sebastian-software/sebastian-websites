import { color, COMPACT, editorial, PHONE, scaled } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const closing = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("44px") } }, alignItems: "center" },
])

export const copy = style({ gridColumn: "1 / span 5" })

export const title = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: scaled("46px") },
      [PHONE]: { fontSize: scaled("36px"), marginBottom: scaled("20px") },
    },
    fontSize: scaled("56px"),
    lineHeight: 1.14,
    marginBottom: scaled("28px"),
  },
])

export const text = style([
  editorial.body,
  {
    "@media": { [PHONE]: { fontSize: scaled("18px") } },
    fontSize: scaled("20px"),
    lineHeight: 1.5,
    marginBottom: scaled("16px"),
    maxWidth: "20em",
  },
])

export const note = style([
  editorial.body,
  { color: color.subtle, fontSize: scaled("16px"), marginBottom: scaled("36px"), maxWidth: "23em" },
])

export const art = style({
  "@media": { [COMPACT]: { marginLeft: 0 } },
  gridColumn: "6 / span 7",
  marginLeft: scaled("24px"),
})

export const image = style({
  aspectRatio: "6 / 5",
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})
