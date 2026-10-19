import {
  color,
  COMPACT,
  editorial,
  font,
  PHONE,
  scaled,
  SPACE_SCALE,
  typeStep,
} from "@sebastian-websites/ui"
import { globalStyle, style } from "@vanilla-extract/css"

const nameColumnWidth = `clamp(${scaled("150px")}, 20vw, ${scaled("240px")})`

export const page = style([editorial.page, { paddingTop: SPACE_SCALE.m }])
export const section = style({ minWidth: 0, paddingBottom: SPACE_SCALE["3xl"] })
export const title = style([editorial.display, { fontSize: typeStep("3") }])
export const heading = style([
  editorial.title,
  { fontSize: typeStep("3"), marginBottom: SPACE_SCALE.s },
])
export const overview = style({
  "@media": { [COMPACT]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } },
  borderBlock: `1px solid ${color.rule}`,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  marginBlock: SPACE_SCALE.l,
})
globalStyle(`${overview} > div`, { minWidth: 0, padding: `${SPACE_SCALE.m} ${SPACE_SCALE.s}` })
globalStyle(`${overview} dt`, { color: color.text, fontSize: typeStep("-1") })
globalStyle(`${overview} dd`, {
  color: color.accent,
  fontFamily: font.serif,
  fontSize: typeStep("4"),
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1.2,
  margin: `${SPACE_SCALE["2xs"]} 0 0`,
})
export const note = style([editorial.caption, { marginTop: SPACE_SCALE.xs }])
export const tools = style({
  alignItems: "end",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.s,
  marginBlock: SPACE_SCALE.m,
})
export const field = style({
  display: "grid",
  flex: "1 1 140px",
  fontSize: typeStep("-1"),
  gap: SPACE_SCALE["2xs"],
  minWidth: 0,
})
export const search = style([field, { flex: "3 1 240px" }])
export const control = style({
  background: color.canvas,
  border: `1px solid ${color.line}`,
  borderRadius: "4px",
  color: color.text,
  font: "inherit",
  fontSize: typeStep("-1"),
  minHeight: "44px",
  minWidth: 0,
  padding: scaled("8px 12px"),
  width: "100%",
})
export const button = style([
  control,
  {
    cursor: "pointer",
    selectors: { "&:disabled": { cursor: "default", opacity: 0.55 } },
    width: "auto",
  },
])
export const toolbar = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.s,
  justifyContent: "space-between",
  marginBlock: SPACE_SCALE.s,
})
export const notice = style({
  background: color.tint,
  borderLeft: `3px solid ${color.accent}`,
  color: color.text,
  fontSize: typeStep("-1"),
  marginBlock: SPACE_SCALE.s,
  padding: SPACE_SCALE.s,
})
export const table = style({
  borderCollapse: "collapse",
  fontSize: typeStep("-1"),
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1.4,
  marginTop: SPACE_SCALE.xs,
  tableLayout: "fixed",
  width: "100%",
})
globalStyle(`${table} th, ${table} td`, {
  borderBottom: `1px solid ${color.rule}`,
  overflowWrap: "anywhere",
  padding: `${SPACE_SCALE["2xs"]} ${SPACE_SCALE.xs}`,
  textAlign: "left",
  verticalAlign: "top",
})
globalStyle(`${table} th`, { color: color.subtle, fontSize: typeStep("-2"), fontWeight: 500 })
globalStyle(`${table} th:first-child, ${table} td:first-child`, {
  background: color.canvas,
  borderRight: `1px solid ${color.rule}`,
  left: 0,
  paddingLeft: SPACE_SCALE.xs,
  position: "sticky",
  width: nameColumnWidth,
  zIndex: 1,
})
globalStyle(`${table} a`, {
  color: color.accent,
  textDecoration: "underline",
  textUnderlineOffset: ".18em",
})
export const numeric = style({})
globalStyle(`${table} .${numeric}`, { textAlign: "right" })
export const usageColumn = style({ width: scaled("130px") })
export const small = style({
  color: color.subtle,
  display: "block",
  fontSize: typeStep("-2"),
  marginTop: SPACE_SCALE["3xs"],
})
export const sources = style({
  "@media": {
    [COMPACT]: { gridTemplateColumns: "repeat(2, minmax(0,1fr))" },
    [PHONE]: { gridTemplateColumns: "minmax(0,1fr)" },
  },
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
  listStyle: "none",
  padding: 0,
})
globalStyle(`${sources} li`, { borderTop: `1px solid ${color.rule}`, paddingTop: SPACE_SCALE.xs })
export const skills = style([sources])
export const prose = style([editorial.prose, editorial.small, { maxWidth: "68ch" }])
export const home = style([
  section,
  { borderTop: `1px solid ${color.rule}`, paddingTop: SPACE_SCALE.xl },
])

export const dashboard = style({})
export const dashboardHeader = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.s,
  justifyContent: "space-between",
})
export const tableScroll = style({
  marginTop: SPACE_SCALE.xs,
  maxWidth: "100%",
  overflowX: "auto",
  overscrollBehaviorX: "contain",
  scrollPaddingInlineStart: nameColumnWidth,
})
export const projectTable = style({ minWidth: scaled("1000px") })
export const packageTable = style({ minWidth: scaled("1000px") })
globalStyle(`${table} td:not(:first-child) time`, { whiteSpace: "nowrap" })
globalStyle(`${dashboard} .${section}`, { paddingBottom: SPACE_SCALE.xl })
globalStyle(`${dashboard} .${heading}`, { fontSize: typeStep("2"), marginBottom: SPACE_SCALE.xs })
globalStyle(`${dashboard} .${overview}`, { marginBlock: SPACE_SCALE.s })
globalStyle(`${dashboard} .${overview} > div`, {
  padding: `${SPACE_SCALE["2xs"]} ${SPACE_SCALE.s}`,
})
globalStyle(`${dashboard} .${overview} dd`, { fontSize: typeStep("2") })
globalStyle(`${dashboard} .${tools}`, { marginBlock: SPACE_SCALE.xs })
globalStyle(`${table} a`, {
  "@media": {
    "(pointer: coarse)": { alignItems: "center", display: "inline-flex", minHeight: "44px" },
  },
})
export const scrollHint = style([
  editorial.caption,
  {
    "@media": { "(max-width: 75em)": { display: "block" } },
    display: "none",
    marginTop: SPACE_SCALE.xs,
  },
])

export const directoryHeader = style({
  alignItems: "end",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE.s,
})
globalStyle(`${directoryHeader} .${tools}`, { flex: `1 1 ${scaled("560px")}`, minWidth: 0 })
export const versionCell = style({
  alignItems: "baseline",
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE["3xs"],
})
export const registryName = style({ color: color.subtle, fontSize: typeStep("-2") })
globalStyle(`${projectTable} th:nth-child(2), ${projectTable} td:nth-child(2)`, {
  width: scaled("140px"),
})
