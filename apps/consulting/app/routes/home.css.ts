import { color, COMPACT, editorial, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** The opening photograph starts close below the header. */
export const main = style([
  editorial.page,
  {
    "@media": {
      [COMPACT]: { paddingTop: scaled("48px") },
      [PHONE]: { paddingTop: scaled("32px") },
    },
    paddingTop: scaled("64px"),
  },
])

/** The page opens with the founders; the headline follows close below. */
export const photoFrame = style({
  "@media": {
    [COMPACT]: { paddingBottom: scaled("56px") },
    [PHONE]: { paddingBottom: scaled("40px") },
  },
  display: "block",
  margin: 0,
  paddingBottom: scaled("72px"),
})

export const hero = style([
  editorial.grid,
  editorial.section,
  {
    "@media": {
      [COMPACT]: { paddingBottom: scaled("120px"), rowGap: scaled("32px") },
      [PHONE]: { paddingBottom: scaled("96px") },
    },
    alignItems: "start",
    paddingBottom: scaled("176px"),
  },
])

/** One step below the display size, so the claim keeps to two lines beside the offer. */
export const heroTitle = style([
  editorial.display,
  {
    "@media": { [COMPACT]: { marginRight: 0 } },
    fontSize: typeStep("4"),
    gridColumn: "1 / span 7",
    lineHeight: 1.16,
    marginRight: scaled("-32px"),
  },
])

/** The offer sits behind a berry hairline, beside the headline. */
export const heroAside = style({
  "@media": {
    [COMPACT]: { marginLeft: 0, paddingLeft: scaled("24px") },
    [PHONE]: { paddingLeft: scaled("20px") },
  },
  borderLeft: `1px solid ${color.accent}`,
  gridColumn: "8 / span 5",
  marginLeft: scaled("24px"),
  paddingBlock: scaled("4px"),
  paddingLeft: scaled("32px"),
})

export const heroText = style([editorial.body, { fontSize: typeStep("0"), lineHeight: 1.55 }])

export const heroMore = style([heroText, { marginTop: scaled("16px") }])

export const heroAction = style({ marginTop: scaled("32px") })

export const block = style([editorial.section])

export const passage = style({
  "@media": {
    [COMPACT]: { paddingBottom: scaled("104px") },
    [PHONE]: { paddingBottom: scaled("80px") },
  },
  paddingBottom: scaled("128px"),
})
