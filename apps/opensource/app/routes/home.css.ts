import { color, editorial, font } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingTop: "112px" }])

export const hero = style([editorial.section, { paddingBottom: "136px" }])

export const heroTitle = style([
  editorial.display,
  { fontSize: "64px", lineHeight: 1.16, maxWidth: "12em" },
])

export const heroLead = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: "24px",
  lineHeight: 1.45,
  marginTop: "24px",
  maxWidth: "26em",
})

export const heroAction = style({ marginTop: "28px" })

export const stories = style([editorial.storyList, editorial.section])

export const projects = style([editorial.section, { scrollMarginTop: "96px" }])
