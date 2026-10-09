import { color, COMPACT, editorial, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
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
      [PHONE]: { marginBottom: scaled("20px") },
    },
    fontSize: typeStep("5"),
    lineHeight: 1.14,
    marginBottom: scaled("28px"),
  },
])

export const text = style([
  editorial.body,
  {
    fontSize: typeStep("1"),
    lineHeight: 1.5,
    marginBottom: scaled("16px"),
    maxWidth: "20em",
  },
])

export const note = style([
  editorial.body,
  { color: color.subtle, fontSize: typeStep("-1"), marginBottom: scaled("36px"), maxWidth: "23em" },
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
