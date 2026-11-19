import { blocks, editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui/styles"
import { style } from "@vanilla-extract/css"

export const card = style([blocks.card, { minWidth: 0, overflow: "hidden", padding: 0 }])
export const image = editorial.media
export const body = style({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: SPACE_SCALE.s,
  padding: SPACE_SCALE.s,
})
export const title = style({ fontSize: typeStep("1"), margin: 0 })
export const action = style({ marginTop: "auto" })
