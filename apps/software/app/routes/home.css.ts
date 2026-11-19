import {
  color,
  COMPACT,
  editorial,
  PHONE,
  scaled,
  SPACE_SCALE,
  typeStep,
} from "@sebastian-websites/ui/styles"
import { globalStyle, style } from "@vanilla-extract/css"

export const main = style([
  editorial.page,
  {
    "@media": {
      [COMPACT]: { paddingTop: SPACE_SCALE.l },
    },
    paddingTop: SPACE_SCALE.xl,
  },
])

export const hero = style([
  editorial.grid,
  editorial.section,
  { "@media": { [COMPACT]: { rowGap: scaled("32px") } }, alignItems: "start" },
])

/** One step below the display size, so each sentence keeps to one line beside the introduction. */
export const heroTitle = style([
  editorial.display,
  { fontSize: typeStep("4"), gridColumn: "1 / span 6" },
])

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

export const photoFrame = style({ display: "block", margin: 0, marginBottom: SPACE_SCALE["2xl"] })
export const photo = style([editorial.widePhoto, editorial.frameMedia])

export const stories = style([editorial.storyList, editorial.section])

// The wordmark and illustration share the same top edge in each product row.
globalStyle(`${stories} > article`, { alignItems: "start" })

export const company = style([editorial.section])
