import { color, editorial, font, scaled, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { globalStyle, style } from "@vanilla-extract/css"

import { eyebrow as eyebrowText } from "./eyebrow.css.ts"

/** The readable measure of running text: eight of the page grid's twelve columns. */
const MEASURE = "1 / span 8"

/** The post on the page grid; on compact screens every part spans the single column. */
export const article = style([editorial.grid, { rowGap: SPACE_SCALE.xl }])

/**
 * The post head reaches two columns beyond the text, so the display step keeps
 * a title of about 110 characters within three lines on a laptop.
 */
export const header = style({
  display: "grid",
  gridColumn: "1 / span 10",
  rowGap: SPACE_SCALE.s,
})

export const eyebrow = style([eyebrowText])

export const eyebrowLink = style({
  selectors: { "&:hover": { color: color.heading } },
})

export const title = style([editorial.display])

export const lead = style([editorial.lead, { maxWidth: "100%" }])

/** Dates and authors below a hairline. */
export const meta = style([
  editorial.small,
  {
    alignItems: "start",
    borderTop: `1px solid ${color.rule}`,
    columnGap: SPACE_SCALE.xl,
    display: "flex",
    flexWrap: "wrap",
    marginTop: SPACE_SCALE.xs,
    paddingTop: SPACE_SCALE.s,
    rowGap: SPACE_SCALE.xs,
  },
])

export const dates = style({
  color: color.subtle,
  columnGap: SPACE_SCALE.xs,
  display: "flex",
  flexWrap: "wrap",
})

export const authors = style({
  columnGap: SPACE_SCALE.l,
  display: "flex",
  flexWrap: "wrap",
  listStyle: "none",
  margin: 0,
  padding: 0,
  rowGap: SPACE_SCALE.xs,
})

export const author = style({ display: "grid" })

export const authorName = style({ color: color.heading, fontWeight: 600 })

export const authorRole = style({ color: color.subtle })

export const translation = style({ marginTop: SPACE_SCALE["2xs"] })

/**
 * The generated article body in Elena at the readable measure. Its elements
 * come from Markdown, so they are styled here by element. `minWidth: 0` lets
 * code blocks and tables scroll inside the column instead of the page.
 */
export const body = style([editorial.bodySerif, { gridColumn: MEASURE, minWidth: 0 }])

globalStyle(`${body} > * + *`, { marginTop: SPACE_SCALE.s })
globalStyle(`${body} > :is(h2, h3) + *`, { marginTop: SPACE_SCALE.xs })
globalStyle(`${body} h2`, {
  color: color.heading,
  fontSize: typeStep("3"),
  letterSpacing: "-0.01em",
  lineHeight: 1.28,
  marginTop: SPACE_SCALE.xl,
})
globalStyle(`${body} h3`, {
  color: color.heading,
  fontSize: typeStep("2"),
  letterSpacing: "-0.01em",
  lineHeight: 1.3,
  marginTop: SPACE_SCALE.l,
})
globalStyle(`${body} a`, {
  color: color.accent,
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "0.2em",
})
globalStyle(`${body} :is(ul, ol)`, { margin: 0, paddingLeft: SPACE_SCALE.m })
globalStyle(`${body} li + li`, { marginTop: SPACE_SCALE["2xs"] })
globalStyle(`${body} blockquote`, {
  borderLeft: `2px solid ${color.rule}`,
  margin: 0,
  paddingLeft: SPACE_SCALE.m,
})
globalStyle(`${body} hr`, {
  border: 0,
  borderTop: `1px solid ${color.rule}`,
  marginBlock: SPACE_SCALE.xl,
})
globalStyle(`${body} img`, { height: "auto" })
globalStyle(`${body} code`, {
  backgroundColor: color.tint,
  borderRadius: "4px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: typeStep("-1"),
  padding: `0 ${SPACE_SCALE["3xs"]}`,
})
globalStyle(`${body} pre`, {
  backgroundColor: color.tint,
  borderRadius: "8px",
  lineHeight: 1.5,
  margin: 0,
  overflowX: "auto",
  padding: SPACE_SCALE.s,
})
globalStyle(`${body} pre code`, { backgroundColor: "transparent", padding: 0 })
// A wide table scrolls inside the column, so it never widens the page.
globalStyle(`${body} table`, {
  borderCollapse: "collapse",
  display: "block",
  fontFamily: font.sans,
  fontSize: typeStep("-1"),
  maxWidth: "100%",
  overflowX: "auto",
})
globalStyle(`${body} :is(th, td)`, {
  borderBottom: `1px solid ${color.rule}`,
  padding: `${SPACE_SCALE["2xs"]} ${SPACE_SCALE.xs}`,
  textAlign: "left",
  verticalAlign: "top",
})

/** Tags and the next step close the article at the text measure. */
export const footer = style({
  display: "grid",
  gridColumn: MEASURE,
  marginTop: SPACE_SCALE.s,
  rowGap: SPACE_SCALE.xl,
})

export const tags = style([
  editorial.small,
  { alignItems: "baseline", columnGap: SPACE_SCALE.s, display: "flex", flexWrap: "wrap" },
])

export const tagsLabel = style({ color: color.subtle })

export const tagList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: SPACE_SCALE["2xs"],
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const tag = style({
  border: `1px solid ${color.rule}`,
  borderRadius: "999px",
  color: color.heading,
  display: "inline-block",
  paddingBlock: SPACE_SCALE["3xs"],
  paddingInline: SPACE_SCALE.xs,
})

export const tagLink = style([
  tag,
  { selectors: { "&:hover": { borderColor: color.accent, color: color.accent } } },
])

/** The one primary next step: a pale panel at the end of the article. */
export const nextStep = style({
  backgroundColor: color.tint,
  borderRadius: scaled("16px"),
  display: "grid",
  justifyItems: "start",
  padding: SPACE_SCALE.l,
  rowGap: SPACE_SCALE.xs,
})

export const nextStepEyebrow = style([eyebrowText])

export const nextStepTitle = style([editorial.subheading])

export const nextStepText = style([editorial.body, { marginBottom: SPACE_SCALE.xs }])
