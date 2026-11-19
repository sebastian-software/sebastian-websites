import { color, COMPACT, editorial, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const region = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("40px") } }, alignItems: "center" },
])

export const map = style({
  gridColumn: "1 / span 6",
  margin: 0,
})

export const aside = style({
  "@media": {
    [COMPACT]: { marginLeft: 0, paddingLeft: scaled("28px") },
    [PHONE]: { paddingLeft: scaled("20px") },
  },
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "7 / span 6",
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
