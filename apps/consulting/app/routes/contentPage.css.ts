import { color, editorial, scaled, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingBlock: SPACE_SCALE["3xl"] }])

export const intro = style([
  editorial.grid,
  { alignItems: "start", paddingBottom: SPACE_SCALE["2xl"], rowGap: SPACE_SCALE.m },
])

export const eyebrow = style([editorial.caption, { color: color.accent, gridColumn: "1 / -1" }])

export const title = style([editorial.title, { gridColumn: "1 / span 7" }])

export const introCopy = style([
  editorial.body,
  { display: "grid", gridColumn: "8 / span 5", rowGap: SPACE_SCALE.s },
])

export const service = style([
  editorial.grid,
  { borderTop: `1px solid ${color.rule}`, paddingBlock: SPACE_SCALE["2xl"], rowGap: SPACE_SCALE.m },
])

export const heading = style([
  editorial.heading,
  { fontSize: typeStep("2"), gridColumn: "1 / span 4" },
])

export const copy = style([
  editorial.body,
  { display: "grid", gridColumn: "6 / span 7", rowGap: SPACE_SCALE.s },
])

export const list = style({
  display: "grid",
  margin: 0,
  paddingLeft: "1.2em",
  rowGap: SPACE_SCALE.xs,
})

export const actions = style({
  alignItems: "center",
  columnGap: SPACE_SCALE.m,
  display: "flex",
  flexWrap: "wrap",
  marginTop: SPACE_SCALE.s,
  rowGap: SPACE_SCALE.s,
})

export const recommendations = style([
  editorial.grid,
  { listStyle: "none", margin: 0, padding: 0, rowGap: SPACE_SCALE["2xl"] },
])

export const recommendation = style({ gridColumn: "span 6" })

export const featured = style({ gridColumn: "2 / span 10", maxWidth: scaled("810px") })

export const source = style([editorial.caption, { marginBlock: SPACE_SCALE.xl }])

export const closing = style({
  borderTop: `1px solid ${color.rule}`,
  marginTop: SPACE_SCALE["2xl"],
  paddingTop: SPACE_SCALE.xl,
})
