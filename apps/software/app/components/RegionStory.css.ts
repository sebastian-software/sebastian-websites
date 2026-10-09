import { color, COMPACT, editorial, font, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const region = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("40px") } }, alignItems: "center" },
])

export const map = style({
  "@media": { [COMPACT]: { marginLeft: 0 } },
  gridColumn: "1 / span 8",
  margin: scaled("0 0 0 -40px"),
  position: "relative",
})

/** Place names stay HTML so they translate; each sits beside its part of the drawing. */
export const place = style({
  color: color.heading,
  fontFamily: font.serif,
  fontSize: typeStep("0"),
  lineHeight: 1,
  position: "absolute",
  textShadow: "0 0 6px #fff, 0 0 2px #fff",
  transform: "translate(-50%, -50%)",
  whiteSpace: "nowrap",
})

export const aside = style({
  "@media": {
    [COMPACT]: { marginLeft: 0, paddingLeft: scaled("28px") },
    [PHONE]: { paddingLeft: scaled("20px") },
  },
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "9 / span 4",
  marginLeft: scaled("-48px"),
  paddingBlock: scaled("8px"),
  paddingLeft: scaled("48px"),
})

export const since = style([
  editorial.subheading,
  { fontSize: typeStep("2"), marginBottom: scaled("14px") },
])

export const rule = style({
  backgroundColor: color.accent,
  blockSize: "1px",
  border: 0,
  inlineSize: scaled("48px"),
  margin: scaled("36px 0"),
  opacity: 0.45,
})

export const values = style([
  editorial.title,
  {
    fontSize: typeStep("4"),
    lineHeight: 1.16,
  },
])
