import { color, COMPACT, editorial, font, PHONE, scaled } from "@sebastian-websites/ui"
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
  editorial.section,
  {
    "@media": {
      [COMPACT]: { paddingBottom: scaled("96px") },
      [PHONE]: { paddingBottom: scaled("72px") },
    },
    paddingBottom: scaled("136px"),
  },
])

export const heroTitle = style([
  editorial.display,
  {
    "@media": { [COMPACT]: { fontSize: scaled("50px") }, [PHONE]: { fontSize: scaled("38px") } },
    fontSize: scaled("64px"),
    lineHeight: 1.16,
    maxWidth: "12em",
  },
])

export const heroLead = style({
  "@media": { [PHONE]: { fontSize: scaled("20px") } },
  color: color.text,
  fontFamily: font.sans,
  fontSize: scaled("24px"),
  lineHeight: 1.45,
  marginTop: scaled("24px"),
  maxWidth: "26em",
})

export const heroAction = style({ marginTop: scaled("28px") })

export const stories = style([editorial.storyList, editorial.section])

export const projects = style([editorial.section, { scrollMarginTop: scaled("96px") }])
