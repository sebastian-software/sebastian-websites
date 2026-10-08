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
  editorial.grid,
  {
    "@media": {
      [COMPACT]: { paddingBottom: "56px", rowGap: "32px" },
      [PHONE]: { paddingBottom: "40px" },
    },
    alignItems: "start",
    paddingBottom: "72px",
  },
])

export const heroTitle = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: "46px", marginRight: 0 },
      [PHONE]: { fontSize: "36px" },
    },
    fontSize: "56px",
    gridColumn: "1 / span 7",
    lineHeight: 1.16,
    marginRight: "-32px",
  },
])

/** The introduction sits behind a berry hairline, as on the home page. */
export const heroAside = style({
  "@media": {
    [COMPACT]: { marginLeft: 0, paddingLeft: "24px" },
    [PHONE]: { paddingLeft: "20px" },
  },
  borderLeft: `1px solid ${color.accent}`,
  gridColumn: "8 / span 5",
  marginLeft: "24px",
  paddingBlock: "4px",
  paddingLeft: "32px",
})

export const heroText = style([editorial.body, { fontSize: "19px", lineHeight: 1.55 }])

export const photoFrame = style([editorial.section, { display: "block", margin: 0 }])

/** Wide on desktop; phones get a taller crop so both people stay large enough. */
export const photo = style({
  "@media": { [PHONE]: { aspectRatio: "4 / 3" } },
  aspectRatio: "2 / 1",
  backgroundColor: color.tint,
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})

export const members = style({
  "@media": { [COMPACT]: { rowGap: "88px" }, [PHONE]: { rowGap: "72px" } },
  display: "grid",
  listStyle: "none",
  margin: 0,
  padding: 0,
  rowGap: "112px",
})

export const member = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: "28px" } }, alignItems: "start" },
])

export const portraitFrame = style({
  "@media": { [COMPACT]: { maxWidth: "320px" }, [PHONE]: { maxWidth: "240px" } },
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
  paddingTop: "8px",
})

export const role = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
})

export const name = style([editorial.title, { marginTop: "14px" }])

export const focus = style([editorial.lead, { marginTop: "20px" }])

export const statement = style([
  editorial.body,
  {
    "@media": { [PHONE]: { fontSize: "17px" } },
    fontSize: "19px",
    lineHeight: 1.55,
    marginTop: "16px",
  },
])

export const skills = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  listStyle: "none",
  margin: "28px 0 0",
  padding: 0,
})

export const skill = style({
  border: `1px solid ${color.accent}`,
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "14px",
  lineHeight: 1,
  padding: "8px 12px",
})

export const actions = style({
  "@media": { [PHONE]: { flexDirection: "column", rowGap: "12px" } },
  display: "flex",
  flexWrap: "wrap",
  gap: "12px 32px",
  listStyle: "none",
  margin: "36px 0 0",
  padding: 0,
})

export const closing = style([
  editorial.section,
  {
    "@media": { [COMPACT]: { paddingTop: "104px" }, [PHONE]: { paddingTop: "80px" } },
    paddingTop: "144px",
  },
])
