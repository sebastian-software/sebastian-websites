import { color, COMPACT, editorial, scaled, SPACE_SCALE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const section = style({
  borderBlock: `1px solid ${color.rule}`,
  marginBottom: SPACE_SCALE["2xl"],
  paddingBlock: SPACE_SCALE.l,
})

export const intro = style({
  alignItems: "baseline",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.s,
  justifyContent: "space-between",
})

export const label = style([editorial.caption, { color: color.accent }])
export const note = style([editorial.caption, { maxWidth: scaled("480px") }])

export const logos = style({
  "@media": { [COMPACT]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } },
  display: "grid",
  gap: SPACE_SCALE.m,
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  paddingBlock: SPACE_SCALE.l,
  paddingInline: 0,
})

export const cell = style({
  alignItems: "center",
  display: "flex",
  height: scaled("56px"),
  justifyContent: "center",
})

export const logo = style({
  display: "block",
  height: "100%",
  maxWidth: scaled("160px"),
  objectFit: "contain",
  width: "100%",
})

export const links = style({
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.m,
})
