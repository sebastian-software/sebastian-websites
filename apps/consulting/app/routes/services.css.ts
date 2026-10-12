import { color, COMPACT, editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const jumpLinks = style([
  editorial.body,
  { color: color.accent, display: "grid", gap: SPACE_SCALE.s, marginTop: SPACE_SCALE.s },
])
export const services = style({
  display: "grid",
  gap: SPACE_SCALE["2xl"],
  marginBottom: SPACE_SCALE["2xl"],
})
export const service = style([
  editorial.grid,
  { alignItems: "start", rowGap: SPACE_SCALE.l, scrollMarginTop: SPACE_SCALE["3xl"] },
])
export const content = style({
  display: "grid",
  gap: SPACE_SCALE.m,
  gridColumn: "1 / span 5",
  selectors: { "[data-reverse] > &": { gridColumn: "8 / span 5" } },
})
export const heading = style([editorial.heading, { fontSize: typeStep("3") }])
export const text = style([editorial.body])
export const deliverables = style([
  editorial.body,
  { display: "grid", gap: SPACE_SCALE.s, listStyle: "square", margin: 0, paddingLeft: "1.2em" },
])
export const visual = style({
  gridColumn: "7 / span 6",
  selectors: { "[data-reverse] > &": { gridColumn: "1 / span 6", gridRow: 1 } },
})
export const evidence = style({
  "@media": { [COMPACT]: { gridTemplateColumns: "minmax(0, 1fr)" } },
  alignItems: "start",
  borderTop: `1px solid ${color.rule}`,
  display: "grid",
  gap: SPACE_SCALE.m,
  gridColumn: "1 / -1",
  gridTemplateColumns: "1fr 3fr",
  paddingTop: SPACE_SCALE.m,
})
export const example = style([
  editorial.body,
  { "@media": { [COMPACT]: { gridColumn: 1 } }, gridColumn: 2 },
])

export const evidenceLabel = style([editorial.caption, { color: color.accent }])
export const evidenceLink = style({
  "@media": { [COMPACT]: { gridColumn: 1 } },
  gridColumn: 2,
})
