import { color, editorial, font } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingTop: "112px" }])

export const hero = style([editorial.grid, { alignItems: "start", paddingBottom: "72px" }])

export const heroTitle = style([
  editorial.display,
  { fontSize: "56px", gridColumn: "1 / span 7", lineHeight: 1.16, marginRight: "-32px" },
])

/** The introduction sits behind a berry hairline, as on the home page. */
export const heroAside = style({
  borderLeft: `1px solid ${color.accent}`,
  gridColumn: "8 / span 5",
  marginLeft: "24px",
  paddingBlock: "4px",
  paddingLeft: "32px",
})

export const heroText = style([editorial.body, { fontSize: "19px", lineHeight: 1.55 }])

export const photoFrame = style([editorial.section, { display: "block", margin: 0 }])

export const photo = style({
  aspectRatio: "2 / 1",
  backgroundColor: color.tint,
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})

export const members = style({
  display: "grid",
  listStyle: "none",
  margin: 0,
  padding: 0,
  rowGap: "112px",
})

export const member = style([editorial.grid, { alignItems: "start" }])

export const portraitFrame = style({
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

export const memberText = style({ gridColumn: "6 / span 7", paddingTop: "8px" })

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
  { fontSize: "19px", lineHeight: 1.55, marginTop: "16px" },
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
  display: "flex",
  flexWrap: "wrap",
  gap: "12px 32px",
  listStyle: "none",
  margin: "36px 0 0",
  padding: 0,
})

export const closing = style([editorial.section, { paddingTop: "144px" }])
