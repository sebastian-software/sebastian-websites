import { FRAME, PALETTES, RHYTHM, scaled, TYPE_SCALE, typeStep } from "@sebastian-websites/tokens"
import { style, styleVariants } from "@vanilla-extract/css"

import { grid, heading, lead, outboundAccent, title } from "../editorial/editorial.css.ts"
import { COMPACT, FRAME_WIDTH, PHONE } from "../responsive.ts"
import { color, font } from "../theme.css.ts"
import { continuousCorners } from "./corners.ts"

const FIELD_RADIUS = 6
const PANEL_RADIUS = 24
const FIELD_HEIGHT = scaled("58px")

/** The second half of the grid: the form, its status, and the drawing. */
const END_HALF = "7 / span 6"

/** Neutral slate for the newsletter action, shared by both brands. */
const ACTION = "oklch(0.33 0.012 250)"

/** The page ending belongs to the screen; printed documents end with their own content. */
export const ending = style({ "@media": { print: { display: "none" } } })

// ---- Newsletter: a quiet utility passage ------------------------------------

export const newsletter = style([
  grid,
  {
    "@media": {
      [COMPACT]: { paddingBottom: scaled("104px") },
      [PHONE]: { paddingBottom: scaled("80px") },
    },
    alignItems: "start",
    paddingBottom: scaled("148px"),
  },
])

export const newsletterTitle = style([
  heading,
  { gridColumn: "1 / span 6", marginBottom: scaled("12px") },
])

export const newsletterText = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: typeStep("1"),
  gridColumn: "1 / span 5",
  gridRow: 2,
  lineHeight: 1.5,
})

export const form = style({
  "@media": {
    [COMPACT]: { marginTop: scaled("28px"), maxWidth: scaled("560px") },
    [PHONE]: { flexDirection: "column", rowGap: scaled("12px") },
  },
  columnGap: scaled("16px"),
  display: "flex",
  gridColumn: END_HALF,
  gridRow: 2,
  marginTop: scaled("-6px"),
})

export const field = style([
  continuousCorners(FIELD_RADIUS),
  {
    "::placeholder": { color: color.subtle, opacity: 1 },
    "@media": { [PHONE]: { flex: "none", height: scaled("52px") } },
    backgroundColor: FRAME.shell,
    border: `1px solid ${color.rule}`,
    color: color.heading,
    flex: 1,
    fontFamily: font.sans,
    fontSize: typeStep("0"),
    height: FIELD_HEIGHT,
    minWidth: 0,
    paddingInline: scaled("20px"),
    selectors: {
      "&:focus-visible": { borderColor: color.accent, outlineOffset: "2px" },
      '&[aria-invalid="true"]': { borderColor: "oklch(0.5 0.18 25)" },
    },
  },
])

export const submit = style([
  continuousCorners(FIELD_RADIUS),
  {
    "@media": { [PHONE]: { height: scaled("52px") } },
    backgroundColor: ACTION,
    border: 0,
    color: "#fff",
    cursor: "pointer",
    flexShrink: 0,
    fontFamily: font.sans,
    fontSize: typeStep("1"),
    height: FIELD_HEIGHT,
    paddingInline: scaled("38px"),
    selectors: {
      "&:disabled": { cursor: "progress", opacity: 0.72 },
      "&:hover:not(:disabled)": { backgroundColor: `color-mix(in oklch, ${ACTION} 85%, black)` },
    },
  },
])

export const status = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: TYPE_SCALE.small.size,
  gridColumn: END_HALF,
  gridRow: 3,
  lineHeight: TYPE_SCALE.small.lineHeight,
  marginTop: scaled("12px"),
  minHeight: "1.5em",
})

export const statusProblem = style({ color: "oklch(0.48 0.17 25)" })

// ---- Invitation: an unboxed editorial spread ---------------------------------

export const invitation = style([
  grid,
  {
    "@media": { [COMPACT]: { rowGap: scaled("40px") }, [PHONE]: { paddingBottom: scaled("64px") } },
    alignItems: "center",
    paddingBottom: scaled("88px"),
  },
])

/** The outward link takes the color of the brand it leads to. */
export const invitationAccent = styleVariants({
  consulting: { vars: { [outboundAccent]: PALETTES.consulting.roles.base } },
  software: { vars: { [outboundAccent]: PALETTES.software.roles.base } },
})

export const invitationCopy = style({ gridColumn: "1 / span 6" })

export const invitationTitle = style([
  title,
  {
    "@media": {
      [PHONE]: { marginBottom: scaled("20px") },
    },
    fontSize: typeStep("4"),
    lineHeight: 1.16,
    marginBottom: scaled("28px"),
  },
])

export const invitationText = style([lead, { maxWidth: "20em" }])

export const invitationAction = style({ marginTop: RHYTHM.action })

export const invitationArt = style({
  "@media": { [COMPACT]: { maxWidth: scaled("420px"), paddingLeft: 0 } },
  gridColumn: END_HALF,
  paddingLeft: scaled("40px"),
})

export const invitationImage = style({ display: "block", height: "auto", width: "100%" })

// ---- Footer: the current site's substantial inset panel -----------------------

export const footer = style([ending, { paddingBottom: scaled("24px") }])

export const panel = style([
  continuousCorners(PANEL_RADIUS),
  {
    "@media": {
      [COMPACT]: { padding: scaled("44px 40px 28px") },
      [PHONE]: { padding: scaled("32px 24px 24px") },
    },
    backgroundColor: FRAME.panel,
    boxShadow: FRAME.panelShadow,
    color: color.text,
    fontFamily: font.sans,
    marginInline: "auto",
    padding: scaled("56px 56px 32px"),
    width: FRAME_WIDTH,
  },
])

export const footerTop = style({
  "@media": { [PHONE]: { gridTemplateColumns: "minmax(0, 1fr)", rowGap: scaled("36px") } },
  columnGap: scaled("48px"),
  display: "grid",
  gridTemplateColumns: "1fr auto",
})

export const footerHome = style({ borderRadius: scaled("8px"), display: "inline-block" })

export const footerLogo = style({
  "@media": { [PHONE]: { height: scaled("64px") } },
  display: "block",
  height: scaled("88px"),
  width: "auto",
})

export const address = style({
  fontSize: typeStep("-1"),
  fontStyle: "normal",
  lineHeight: 1.42,
  marginTop: scaled("28px"),
})

export const plainLink = style({ selectors: { "&:hover": { color: color.accent } } })

export const aside = style({
  "@media": { [PHONE]: { minWidth: 0, rowGap: scaled("28px") } },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minWidth: scaled("224px"),
  paddingTop: "2px",
})

export const index = style({
  "@media": { [PHONE]: { lineHeight: scaled("40px") } },
  display: "grid",
  fontSize: typeStep("0"),
  lineHeight: scaled("28.5px"),
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const profiles = style({
  columnGap: scaled("36px"),
  display: "flex",
  fontSize: typeStep("-1"),
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const profile = style([
  plainLink,
  { alignItems: "center", columnGap: scaled("10px"), display: "inline-flex", lineHeight: 1 },
])

export const glyph = style({
  color: color.heading,
  flexShrink: 0,
  height: scaled("20px"),
  width: scaled("20px"),
})

export const baseline = style({
  "@media": {
    [PHONE]: { alignItems: "flex-start", flexDirection: "column", rowGap: scaled("12px") },
  },
  alignItems: "baseline",
  borderTop: `1px solid ${color.rule}`,
  display: "flex",
  fontSize: typeStep("-1"),
  justifyContent: "space-between",
  marginTop: scaled("30px"),
  paddingTop: scaled("24px"),
})

export const legal = style({
  "@media": { [PHONE]: { flexWrap: "wrap", lineHeight: scaled("40px") } },
  columnGap: scaled("24px"),
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
})
