import { color, COMPACT, editorial, PHONE, scaled } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([
  editorial.page,
  {
    "@media": {
      [COMPACT]: { paddingTop: scaled("72px") },
      [PHONE]: { paddingTop: scaled("48px") },
    },
    paddingTop: scaled("112px"),
  },
])

export const hero = style([
  editorial.grid,
  editorial.section,
  { "@media": { [COMPACT]: { rowGap: scaled("32px") } }, alignItems: "start" },
])

export const heroTitle = style([editorial.display, { gridColumn: "1 / span 6" }])

/** The introduction sits behind a hairline, aligned with the headline's first line. */
export const heroIntro = style({
  "@media": {
    [COMPACT]: { paddingLeft: scaled("28px") },
    [PHONE]: { paddingLeft: scaled("20px") },
  },
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "7 / span 6",
  paddingBlock: scaled("6px 4px"),
  paddingLeft: scaled("48px"),
})

export const heroText = style([editorial.bodySerif, { maxWidth: "22em" }])

export const heroAction = style({ marginTop: scaled("28px") })

export const photoFrame = style([editorial.section, { display: "block", margin: 0 }])

export const stories = style([editorial.storyList, editorial.section])

export const company = style([editorial.section])
