import { color, editorial, font, SPACE_SCALE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

import { eyebrow as eyebrowText } from "./eyebrow.css.ts"

/** A grid child across every column. */
const FULL_WIDTH = "1 / -1"
/** The title and the post list keep to eight of the twelve columns. */
const COLUMNS = "1 / span 8"

/**
 * The blog's page: the editorial page grid with the section rhythm below. The
 * space steps grow with each layout class, so no breakpoint resizes them.
 */
export const main = style([
  editorial.page,
  { paddingBottom: SPACE_SCALE["3xl"], paddingTop: SPACE_SCALE["2xl"] },
])

/** The head of the overview and of a tag archive: eyebrow, title, lead, feeds. */
export const head = style([
  editorial.grid,
  { marginBottom: SPACE_SCALE["2xl"], rowGap: SPACE_SCALE.s },
])

export const eyebrow = style([eyebrowText, { gridColumn: FULL_WIDTH }])

/**
 * The page's display headline across eight columns: a short title, so the
 * display step keeps it within two lines on a laptop.
 */
export const title = style([editorial.display, { gridColumn: COLUMNS }])

export const lead = style([editorial.lead, { gridColumn: "1 / span 7" }])

/** Visible subscribe links below the lead. */
export const feeds = style([
  editorial.small,
  {
    alignItems: "baseline",
    columnGap: SPACE_SCALE.m,
    display: "flex",
    flexWrap: "wrap",
    gridColumn: FULL_WIDTH,
    listStyle: "none",
    margin: 0,
    marginTop: SPACE_SCALE.xs,
    padding: 0,
    rowGap: SPACE_SCALE["2xs"],
  },
])

export const feedLink = style({
  borderBottom: "1px solid currentColor",
  color: color.accent,
  fontFamily: font.sans,
  selectors: { "&:hover": { color: color.heading } },
})

/** The post list and the empty state share the article column. */
export const body = style([editorial.grid])

export const list = style({
  borderTop: `1px solid ${color.rule}`,
  gridColumn: COLUMNS,
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const item = style({
  borderBottom: `1px solid ${color.rule}`,
  display: "grid",
  paddingBlock: SPACE_SCALE.l,
  rowGap: SPACE_SCALE.xs,
})

/** One step below the page title: a post title of 150 characters still fits three lines. */
export const itemTitle = style([editorial.heading])

export const itemLink = style({
  selectors: { "&:hover": { color: color.accent } },
})

export const itemDate = style([editorial.caption])

export const itemText = style([editorial.body, { maxWidth: "100%" }])

export const empty = style({
  borderTop: `1px solid ${color.rule}`,
  display: "grid",
  gridColumn: COLUMNS,
  paddingTop: SPACE_SCALE.l,
  rowGap: SPACE_SCALE.m,
})

export const emptyText = style([editorial.bodySerif])

/** The way back from a tag archive to every post. */
export const back = style({ gridColumn: FULL_WIDTH, marginTop: SPACE_SCALE.xl })
