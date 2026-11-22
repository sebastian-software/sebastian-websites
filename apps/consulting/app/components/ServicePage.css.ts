import { color, editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui/styles"
import { style } from "@vanilla-extract/css"

export const title = style([
  editorial.title,
  { fontSize: typeStep("4"), gridColumn: "1 / span 7", overflowWrap: "anywhere" },
])

export const sectionContent = style({ display: "grid", gap: SPACE_SCALE.l })
export const block = style({ display: "grid", gap: SPACE_SCALE.s })
export const subheading = style([editorial.subheading, { fontSize: typeStep("1") }])
export const related = style({
  borderTop: `1px solid ${color.rule}`,
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.m,
  paddingBlock: SPACE_SCALE.xl,
})
