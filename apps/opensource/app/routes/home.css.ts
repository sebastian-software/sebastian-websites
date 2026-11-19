import {
  color,
  editorial,
  font,
  scaled,
  SPACE_SCALE,
  typeStep,
} from "@sebastian-websites/ui/styles"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingTop: SPACE_SCALE.xl }])

export const hero = editorial.section

export const heroTitle = style([editorial.featureHeading, { maxWidth: "22em" }])

export const heroLead = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: typeStep("1"),
  lineHeight: 1.45,
  marginTop: scaled("24px"),
  maxWidth: "26em",
})

export const heroAction = style({ marginTop: scaled("28px") })

export const banner = style([editorial.paperIllustration, { marginBottom: SPACE_SCALE.xl }])

export const stories = style([editorial.storyList, { scrollMarginTop: scaled("96px") }])

export const moreProjects = style([editorial.section, { marginTop: SPACE_SCALE.l }])
