import { color, editorial } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingTop: "112px" }])

export const hero = style([editorial.grid, editorial.section, { alignItems: "start" }])

export const heroTitle = style([editorial.display, { gridColumn: "1 / span 6" }])

/** The introduction sits behind a hairline, aligned with the headline's first line. */
export const heroIntro = style({
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "7 / span 6",
  paddingBlock: "6px 4px",
  paddingLeft: "48px",
})

export const heroText = style([editorial.bodySerif, { maxWidth: "22em" }])

export const heroAction = style({ marginTop: "28px" })

export const stories = style([editorial.storyList, editorial.section])

export const company = style([editorial.section])
