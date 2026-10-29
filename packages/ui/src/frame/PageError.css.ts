import { scaled, SPACE_SCALE, typeStep } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { body, button, title as heading, page } from "../editorial/editorial.css.ts"
import { color } from "../theme.css.ts"

export const main = style([
  page,
  {
    alignItems: "center",
    display: "grid",
    minHeight: "100svh",
    paddingBlock: SPACE_SCALE["2xl"],
  },
])

export const content = style({
  borderTop: `2px solid ${color.accent}`,
  maxWidth: scaled("680px"),
  paddingTop: SPACE_SCALE.l,
})

export const title = style([heading, { fontSize: typeStep("3"), marginBottom: SPACE_SCALE.m }])
export const text = style([body, { maxWidth: scaled("560px") }])
export const actions = style({
  alignItems: "center",
  columnGap: SPACE_SCALE.l,
  display: "flex",
  flexWrap: "wrap",
  marginTop: SPACE_SCALE.l,
  rowGap: SPACE_SCALE.s,
})
export const reload = button
export const home = style([
  body,
  {
    alignItems: "center",
    color: color.accent,
    display: "inline-flex",
    minHeight: "44px",
    textDecoration: "underline",
    textUnderlineOffset: "0.2em",
  },
])
