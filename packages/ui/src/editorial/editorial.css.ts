import { PAGE, RHYTHM, scaled, TYPE_SCALE, type TypeStep } from "@sebastian-websites/tokens"
import { createVar, globalStyle, style, styleVariants } from "@vanilla-extract/css"

import { COMPACT, PAGE_WIDTH, PHONE } from "../responsive.ts"
import { color, font } from "../theme.css.ts"

/**
 * One type step as style.
 *
 * @param value - The step from the type scale.
 * @returns Font size, tracking, and line height.
 */
function step(value: TypeStep): { fontSize: string; letterSpacing: string; lineHeight: number } {
  return { fontSize: value.size, letterSpacing: value.letterSpacing, lineHeight: value.lineHeight }
}

// ---- Page and grid ---------------------------------------------------------

/**
 * The editorial page of 1040 design pixels. It grows with the root; the rest
 * of the width becomes margin, which narrows smoothly toward phones.
 */
export const page = style({ marginInline: "auto", width: PAGE_WIDTH })

/**
 * The shared 12-column grid. Children place themselves with `gridColumn`. On
 * compact screens it is a single column, so the desktop placements fall away.
 */
export const grid = style({
  "@media": { [COMPACT]: { columnGap: 0, gridTemplateColumns: "minmax(0, 1fr)" } },
  columnGap: PAGE.gap,
  display: "grid",
  gridTemplateColumns: `repeat(${PAGE.columns}, minmax(0, 1fr))`,
})

// Placements are written for twelve columns and set by each component's own
// class; on compact screens every child spans the single column in source order.
globalStyle(`${grid} > *`, {
  "@media": { [COMPACT]: { gridColumn: "1 / -1 !important", gridRow: "auto !important" } },
})

/** Vertical space after a section; the next section starts without its own top. */
/** A photograph across the page: 2:1 on desktop, 4:3 on phones so faces stay large. */
export const widePhoto = style({
  "@media": { [PHONE]: { aspectRatio: "4 / 3" } },
  aspectRatio: "2 / 1",
  backgroundColor: color.tint,
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})

export const section = style({ paddingBottom: RHYTHM.section })

// ---- Type ------------------------------------------------------------------

const serifHeading = {
  color: color.heading,
  fontFamily: font.serif,
  fontWeight: 400,
} as const

export const display = style({ ...serifHeading, ...step(TYPE_SCALE.display) })
export const title = style({ ...serifHeading, ...step(TYPE_SCALE.title) })
export const heading = style({ ...serifHeading, ...step(TYPE_SCALE.heading) })
export const subheading = style({ ...serifHeading, ...step(TYPE_SCALE.subheading) })

export const lead = style({
  color: color.text,
  fontFamily: font.serif,
  ...step(TYPE_SCALE.lead),
})

/** Practical running text in Glober. */
export const body = style({ color: color.text, fontFamily: font.sans, ...step(TYPE_SCALE.body) })

/** Editorial running text in Elena. */
export const bodySerif = style({
  color: color.text,
  fontFamily: font.serif,
  ...step(TYPE_SCALE.bodySerif),
})

export const small = style({ color: color.text, fontFamily: font.sans, ...step(TYPE_SCALE.small) })

export const caption = style({
  color: color.subtle,
  fontFamily: font.sans,
  ...step(TYPE_SCALE.caption),
})

/** Paragraphs in a prose block keep one line of space between them. */
export const prose = style({
  display: "grid",
  rowGap: "0.9em",
})

/** Hide text visually while keeping it available to assistive technology. */
export const visuallyHidden = style({
  border: 0,
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
})

// ---- Links and buttons -----------------------------------------------------

/** Text, arrow, and gap of every inline action. */
const inlineAction = {
  alignItems: "center",
  display: "inline-flex",
  fontFamily: font.sans,
} as const

/** The underline and arrow color of an outward link: the destination brand's color. */
export const outboundAccent = createVar()

const arrowMotion = {
  "@media": {
    "(prefers-reduced-motion: no-preference)": { transition: "transform 160ms ease-out" },
  },
} as const

/** An inline action: text in the accent color followed by an arrow. */
export const arrowLink = style({
  ...inlineAction,
  color: color.accent,
  columnGap: "0.6em",
  ...step(TYPE_SCALE.action),
  selectors: {
    "&:hover": { textDecoration: "underline", textUnderlineOffset: "0.25em" },
  },
})

/** Inline actions on project pages carry a thin underline in their own color. */
export const arrowLinkUnderlined = style({
  borderBottom: "1px solid currentColor",
  paddingBottom: scaled("4px"),
  selectors: { "&:hover": { textDecoration: "none" } },
})

/** The outward action: plain text on a brand-colored underline. */
export const outboundLink = style({
  ...inlineAction,
  borderBottom: `2px solid ${outboundAccent}`,
  color: color.heading,
  columnGap: "0.55em",
  fontSize: scaled("19px"),
  lineHeight: 1.5,
  paddingBottom: scaled("4px"),
})

export const button = style({
  ...inlineAction,
  backgroundColor: color.accentStrong,
  // In em, so the corner keeps its proportion to the label.
  borderRadius: "0.21em",
  color: "#fff",
  columnGap: scaled("14px"),
  flexShrink: 0,
  fontSize: scaled("19px"),
  height: scaled("56px"),
  lineHeight: 1,
  paddingInline: scaled("26px"),
  selectors: {
    "&:hover": { backgroundColor: `color-mix(in oklch, ${color.accentStrong} 88%, black)` },
  },
  whiteSpace: "nowrap",
})

/** The arrow nudges toward its destination on hover. */
export const arrow = style({
  flexShrink: 0,
  height: "1em",
  selectors: {
    [`${arrowLink}:hover &, ${outboundLink}:hover &, ${button}:hover &`]: {
      transform: "translateX(3px)",
    },
  },
  width: "1em",
  ...arrowMotion,
})

export const outboundArrow = style([
  arrow,
  {
    color: outboundAccent,
    selectors: { [`${outboundLink}:hover &`]: { transform: "translate(2px, -2px)" } },
  },
])

// ---- Illustrated story -------------------------------------------------------

/** Media reaches this far beyond the text edge on its outer side. */
const MEDIA_BLEED = scaled("40px")

export const story = style([
  grid,
  {
    alignItems: "center",
    rowGap: RHYTHM.block,
  },
])

/** Text placement, keyed by the illustration's side. */
export const storyContent = styleVariants({
  end: { gridColumn: "1 / span 5", gridRow: 1 },
  start: { gridColumn: "7 / span 6", gridRow: 1 },
})

/** Stacked on compact screens, the illustration stays inside the page. */
const stackedMedia = { "@media": { [COMPACT]: { marginInline: 0, marginTop: scaled("8px") } } }

export const storyMedia = styleVariants({
  end: {
    ...stackedMedia,
    gridColumn: "6 / span 7",
    gridRow: 1,
    marginRight: `calc(-1 * ${MEDIA_BLEED})`,
  },
  start: {
    ...stackedMedia,
    gridColumn: "1 / span 6",
    gridRow: 1,
    marginLeft: `calc(-1 * ${MEDIA_BLEED})`,
  },
})

export const storyList = style({ display: "grid", rowGap: RHYTHM.story })

export const storyIdentity = style({
  alignItems: "center",
  columnGap: scaled("20px"),
  display: "flex",
  flexWrap: "wrap",
  marginBottom: scaled("32px"),
  rowGap: scaled("12px"),
})

export const storyHeading = style([heading, { marginBottom: scaled("20px") }])

export const storyActions = style({
  alignItems: "center",
  columnGap: scaled("32px"),
  display: "flex",
  flexWrap: "wrap",
  marginTop: RHYTHM.action,
  rowGap: scaled("12px"),
})

export const media = style({ display: "block", height: "auto", width: "100%" })
