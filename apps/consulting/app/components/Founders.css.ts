import { color, COMPACT, editorial, font, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const title = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { marginBottom: scaled("44px") },
      [PHONE]: { marginBottom: scaled("32px") },
    },
    fontSize: typeStep("5"),
    lineHeight: 1.12,
    marginBottom: scaled("60px"),
  },
])

/** The second line steps in, as in the selected composition. */
export const titleIndent = style({
  "@media": {
    [COMPACT]: { paddingLeft: scaled("48px") },
    [PHONE]: { paddingLeft: scaled("28px") },
  },
  display: "block",
  paddingLeft: scaled("84px"),
})

export const row = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("48px") } }, alignItems: "center" },
])

export const intro = style({ gridColumn: "1 / span 3" })

export const values = style([
  editorial.heading,
  {
    fontSize: typeStep("3"),
    lineHeight: 1.22,
    marginBottom: scaled("22px"),
  },
])

export const text = style([
  editorial.body,
  { fontSize: typeStep("0"), lineHeight: 1.5, marginBottom: scaled("36px") },
])

export const portraits = style({
  "@media": { [PHONE]: { columnGap: scaled("16px") } },
  columnGap: scaled("32px"),
  display: "grid",
  gridColumn: "4 / span 9",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const figure = style({ margin: 0 })

export const frame = style({
  aspectRatio: "7 / 10",
  backgroundColor: color.tint,
  overflow: "hidden",
})

export const photo = style({ display: "block", height: "100%", objectFit: "cover", width: "100%" })

export const name = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: typeStep("-2"),
  fontWeight: 600,
  letterSpacing: "0.22em",
  marginTop: scaled("20px"),
  textTransform: "uppercase",
})

export const role = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: typeStep("-1"),
  marginTop: scaled("6px"),
})
