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
  editorial.grid,
  {
    "@media": {
      [COMPACT]: { paddingBottom: scaled("56px"), rowGap: scaled("32px") },
      [PHONE]: { paddingBottom: scaled("40px") },
    },
    alignItems: "start",
    paddingBottom: scaled("72px"),
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

/** The introduction sits behind a berry hairline, as on the home page. */
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

export const photoFrame = style([editorial.section, { display: "block", margin: 0 }])

export const members = style({
  "@media": { [COMPACT]: { rowGap: scaled("88px") }, [PHONE]: { rowGap: scaled("72px") } },
  display: "grid",
  listStyle: "none",
  margin: 0,
  padding: 0,
  rowGap: scaled("112px"),
})

export const member = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("28px") } }, alignItems: "start" },
])

export const portraitFrame = style({
  "@media": { [COMPACT]: { maxWidth: scaled("320px") }, [PHONE]: { maxWidth: scaled("240px") } },
  aspectRatio: "7 / 10",
  backgroundColor: color.tint,
  gridColumn: "1 / span 4",
  overflow: "hidden",
})

export const portrait = style({
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%",
})

export const memberText = style({
  "@media": { [COMPACT]: { paddingTop: 0 } },
  gridColumn: "6 / span 7",
  paddingTop: scaled("8px"),
})

export const role = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: scaled("13px"),
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
})

export const name = style([editorial.title, { marginTop: scaled("14px") }])

export const focus = style([editorial.lead, { marginTop: scaled("20px") }])

export const statement = style([
  editorial.body,
  {
    "@media": { [PHONE]: { fontSize: scaled("17px") } },
    fontSize: scaled("19px"),
    lineHeight: 1.55,
    marginTop: scaled("16px"),
  },
])

export const skills = style({
  display: "flex",
  flexWrap: "wrap",
  gap: scaled("8px"),
  listStyle: "none",
  margin: scaled("28px 0 0"),
  padding: 0,
})

export const skill = style({
  border: `1px solid ${color.accent}`,
  color: color.accent,
  fontFamily: font.sans,
  fontSize: scaled("14px"),
  lineHeight: 1,
  padding: scaled("8px 12px"),
})

export const actions = style({
  "@media": { [PHONE]: { flexDirection: "column", rowGap: scaled("12px") } },
  display: "flex",
  flexWrap: "wrap",
  gap: scaled("12px 32px"),
  listStyle: "none",
  margin: scaled("36px 0 0"),
  padding: 0,
})

export const closing = style([
  editorial.section,
  {
    "@media": {
      [COMPACT]: { paddingTop: scaled("104px") },
      [PHONE]: { paddingTop: scaled("80px") },
    },
    paddingTop: scaled("144px"),
  },
])
