import { color, COMPACT, editorial, font, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const figure = style({
  backgroundColor: color.paper,
  borderTop: `2px solid ${color.accent}`,
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateRows: "auto auto 1fr auto",
  margin: 0,
  padding: SPACE_SCALE.l,
})

export const featured = style([
  editorial.grid,
  {
    "@media": { [COMPACT]: { display: "grid" } },
    backgroundColor: color.tint,
    columnGap: SPACE_SCALE.l,
    gridTemplateRows: "auto auto 1fr",
    rowGap: SPACE_SCALE.m,
  },
])

export const mark = style({
  color: color.accent,
  fontFamily: font.serif,
  fontSize: typeStep("5"),
  gridColumn: "1 / -1",
  height: "0.6em",
  lineHeight: 1,
})

export const topic = style([
  editorial.caption,
  {
    color: color.accent,
    selectors: { [`${featured} &`]: { fontSize: typeStep("1"), gridColumn: "1 / span 4" } },
  },
])

export const quote = style([
  editorial.bodySerif,
  {
    alignContent: "start",
    color: color.heading,
    display: "grid",
    fontSize: typeStep("0"),
    gap: SPACE_SCALE.s,
    margin: 0,
    selectors: { [`${featured} &`]: { gridColumn: "5 / span 8", gridRow: "2 / span 2" } },
  },
])

export const caption = style([
  editorial.caption,
  {
    alignContent: "end",
    display: "grid",
    gap: SPACE_SCALE.xs,
    marginTop: SPACE_SCALE.s,
    selectors: { [`${featured} &`]: { alignContent: "start", gridColumn: "1 / span 4" } },
  },
])

export const author = style({
  color: color.heading,
  fontStyle: "normal",
  fontWeight: 600,
  selectors: { "&:hover": { color: color.accent, textDecoration: "underline" } },
})
