import { color, COMPACT, editorial, font, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([
  editorial.page,
  {
    "@media": { [COMPACT]: { paddingTop: "72px" }, [PHONE]: { paddingTop: "48px" } },
    paddingTop: "112px",
  },
])

export const hero = style([
  editorial.section,
  {
    "@media": { [COMPACT]: { paddingBottom: "96px" }, [PHONE]: { paddingBottom: "72px" } },
    paddingBottom: "136px",
  },
])

export const heroTitle = style([
  editorial.display,
  {
    "@media": { [COMPACT]: { fontSize: "50px" }, [PHONE]: { fontSize: "38px" } },
    fontSize: "64px",
    lineHeight: 1.16,
    maxWidth: "12em",
  },
])

export const heroLead = style({
  "@media": { [PHONE]: { fontSize: "20px" } },
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
