import { CONTAINER, SPACE, TYPE } from "@sebastian-websites/tokens"
import { style, styleVariants } from "@vanilla-extract/css"

import { color, NARROW, ON_NIGHT } from "./theme.css.ts"

/** The page container: 1320 px, 1480 px on very wide screens, 24 px gutters. */
export const container = style({
  "@media": { [`(min-width: ${CONTAINER.wideFrom})`]: { maxWidth: CONTAINER.wide } },
  marginInline: "auto",
  maxWidth: CONTAINER.max,
  paddingInline: CONTAINER.gutter,
})

export const section = style({ paddingBlock: SPACE.section })

/** Sections alternate Frost and white; Midnight carries live numbers. */
export const sectionTone = styleVariants({
  night: { backgroundColor: color.night, color: color.white },
  paper: { backgroundColor: color.paper },
  white: { backgroundColor: color.white },
})

/** A section that continues the previous one, with a shorter top. */
export const sectionFollow = style({ paddingTop: SPACE.xxl })

export const eyebrow = style({
  color: color.muted,
  fontSize: TYPE.eyebrow,
  fontWeight: 600,
  letterSpacing: "0.12em",
  marginBottom: SPACE.md,
  selectors: { [`${sectionTone.night} &`]: { color: color.bright } },
  textTransform: "uppercase",
})

/** Headline left, introduction right; the eyebrow sits above both. */
export const sectionHead = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  alignItems: "start",
  display: "grid",
  gap: SPACE.xl,
  gridTemplateColumns: "1fr 1.5fr",
  marginBottom: "72px",
})

/** Offset by 10 px so its first line meets the headline's cap height. */
export const intro = style({
  color: color.muted,
  fontSize: TYPE.intro,
  lineHeight: TYPE.bodyLineHeight,
  maxWidth: "60ch",
  paddingTop: "10px",
  selectors: { [`${sectionTone.night} &`]: { color: ON_NIGHT.text } },
})

export const columns = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  display: "grid",
  gap: SPACE.xl,
  gridTemplateColumns: "repeat(3, 1fr)",
})

export const columnsTwo = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  display: "grid",
  gap: SPACE.xl,
  gridTemplateColumns: "repeat(2, 1fr)",
})

/** Text on the left, a photo on the right. */
export const split = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  alignItems: "start",
  display: "grid",
  gap: "80px",
  gridTemplateColumns: "1.1fr 0.9fr",
})

export const ctas = style({ display: "flex", flexWrap: "wrap", gap: "14px" })
