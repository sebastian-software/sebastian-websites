import { color, editorial, PHONE, scaled, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

const STACKED_COLUMNS = "minmax(0, 1fr)"

export const figure = style({
  backgroundColor: color.tint,
  display: "grid",
  gap: SPACE_SCALE.l,
  margin: 0,
  padding: SPACE_SCALE.l,
})

export const caption = style([
  editorial.bodySerif,
  { color: color.heading, fontSize: typeStep("1") },
])
export const footnote = style([editorial.caption, { maxWidth: "36ch" }])
export const architecture = style({ display: "grid", gap: SPACE_SCALE.m })
export const productInterface = style([
  editorial.body,
  {
    backgroundColor: color.paper,
    border: `1px solid ${color.rule}`,
    padding: SPACE_SCALE.m,
    textAlign: "center",
  },
])
export const boundaries = style({
  "@media": { [PHONE]: { gridTemplateColumns: STACKED_COLUMNS } },
  borderInline: `1px solid ${color.accent}`,
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  paddingBlock: SPACE_SCALE.m,
  paddingInline: SPACE_SCALE.s,
})
export const node = style([
  editorial.caption,
  {
    alignContent: "center",
    backgroundColor: color.paper,
    border: `1px solid ${color.rule}`,
    color: color.heading,
    minHeight: scaled("64px"),
    padding: SPACE_SCALE.s,
    textAlign: "center",
  },
])
export const foundation = style([
  editorial.body,
  {
    backgroundColor: color.accentStrong,
    color: color.white,
    padding: SPACE_SCALE.m,
    textAlign: "center",
  },
])
export const translation = style({ display: "grid" })
export const inputs = style({
  "@media": { [PHONE]: { gridTemplateColumns: STACKED_COLUMNS } },
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
})
export const connector = style([
  editorial.body,
  { color: color.accent, paddingBlock: SPACE_SCALE.xs, textAlign: "center" },
])
export const engine = foundation
export const languages = style({
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  padding: 0,
})
export const language = style([editorial.caption, { color: color.heading, textAlign: "center" }])
export const cycle = style({
  "@media": { [PHONE]: { gridTemplateColumns: STACKED_COLUMNS } },
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  padding: 0,
})
export const cycleStep = style([
  editorial.body,
  {
    "@media": { [PHONE]: { gridTemplateColumns: "auto minmax(0, 1fr)" } },
    alignItems: "center",
    backgroundColor: color.paper,
    border: `1px solid ${color.rule}`,
    display: "grid",
    gap: SPACE_SCALE.s,
    padding: SPACE_SCALE.m,
  },
])
export const number = style([editorial.bodySerif, { color: color.accent, fontSize: typeStep("3") }])
