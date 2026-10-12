import { color, COMPACT, editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const topics = style([
  editorial.body,
  { color: color.accent, display: "grid", gap: SPACE_SCALE.s, marginTop: SPACE_SCALE.s },
])
export const group = style({
  marginBottom: SPACE_SCALE["2xl"],
  scrollMarginTop: SPACE_SCALE["3xl"],
})
export const groupHeading = style([
  editorial.grid,
  {
    alignItems: "baseline",
    borderTop: `1px solid ${color.rule}`,
    paddingBlock: SPACE_SCALE.l,
    rowGap: SPACE_SCALE.s,
  },
])
export const heading = style([
  editorial.heading,
  { fontSize: typeStep("2"), gridColumn: "1 / span 6" },
])
export const description = style([editorial.body, { gridColumn: "8 / span 5" }])
export const recommendations = style({
  "@media": { [COMPACT]: { columnCount: 1 } },
  columnCount: 2,
  columnGap: SPACE_SCALE.l,
  listStyle: "none",
  margin: 0,
  padding: 0,
})
export const recommendation = style({ breakInside: "avoid", marginBottom: SPACE_SCALE.l })
export const featured = style({ marginBottom: SPACE_SCALE.l, minWidth: 0 })
