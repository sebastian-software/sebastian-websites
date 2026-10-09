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
  {
    "@media": {
      [COMPACT]: { paddingBottom: scaled("120px"), rowGap: scaled("32px") },
      [PHONE]: { paddingBottom: scaled("96px") },
    },
    alignItems: "start",
    paddingBottom: scaled("176px"),
  },
])

export const heroTitle = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: scaled("46px"), marginRight: 0 },
      [PHONE]: { fontSize: scaled("36px") },
    },
    fontSize: scaled("56px"),
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

export const heroText = style([editorial.body, { fontSize: scaled("19px"), lineHeight: 1.55 }])

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
