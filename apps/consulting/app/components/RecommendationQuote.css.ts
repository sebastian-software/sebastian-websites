import { color, editorial, SPACE_SCALE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const figure = style({ margin: 0 })

export const topic = style([
  editorial.caption,
  { color: color.accent, marginBottom: SPACE_SCALE.s },
])

export const quote = style([editorial.bodySerif, { color: color.heading, margin: 0 }])

export const caption = style([
  editorial.caption,
  { columnGap: SPACE_SCALE.s, display: "flex", flexWrap: "wrap", marginTop: SPACE_SCALE.s },
])

export const author = style({
  color: color.text,
  fontStyle: "normal",
  selectors: { "&:hover": { color: color.accent, textDecoration: "underline" } },
})
