import { color, COMPACT, editorial, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([
  editorial.page,
  {
    "@media": { [COMPACT]: { paddingTop: "72px" }, [PHONE]: { paddingTop: "48px" } },
    paddingTop: "112px",
  },
])

export const hero = style([
  editorial.grid,
  editorial.section,
  { "@media": { [COMPACT]: { rowGap: "32px" } }, alignItems: "start" },
])

export const heroTitle = style([editorial.display, { gridColumn: "1 / span 6" }])

/** The introduction sits behind a hairline, aligned with the headline's first line. */
export const heroIntro = style({
  "@media": { [COMPACT]: { paddingLeft: "28px" }, [PHONE]: { paddingLeft: "20px" } },
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "7 / span 6",
  paddingBlock: "6px 4px",
  paddingLeft: "48px",
})

export const heroText = style([editorial.bodySerif, { maxWidth: "22em" }])

export const heroAction = style({ marginTop: "28px" })

export const stories = style([editorial.storyList, editorial.section])

export const company = style([editorial.section])
