import { editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const section = style([editorial.grid, { alignItems: "start", rowGap: SPACE_SCALE.m }])
export const heading = style([
  editorial.heading,
  { fontSize: typeStep("2"), gridColumn: "1 / span 4" },
])
export const content = style({ gridColumn: "6 / span 7" })
export const action = style({ marginTop: SPACE_SCALE.m })
