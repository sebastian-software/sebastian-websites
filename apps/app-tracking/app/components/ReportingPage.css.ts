import {
  color,
  COMPACT,
  editorial,
  font,
  scaled,
  SPACE_SCALE,
  typeStep,
} from "@sebastian-websites/ui"
import { globalStyle, style } from "@vanilla-extract/css"

// The service explainer uses the shared grid and scale with restrained sans headings.
export const main = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: typeStep("0"),
  lineHeight: 1.65,
  paddingTop: SPACE_SCALE.l,
})
globalStyle("html", { colorScheme: "only light" })
globalStyle(`${main} h1`, {
  color: color.heading,
  fontFamily: font.sans,
  fontSize: typeStep("3"),
  fontWeight: 700,
  lineHeight: 1.22,
  textWrap: "pretty",
})
globalStyle(`${main} h2`, {
  alignItems: "flex-start",
  color: color.heading,
  display: "flex",
  fontFamily: font.sans,
  fontSize: typeStep("1"),
  fontWeight: 700,
  gap: SPACE_SCALE.xs,
  lineHeight: 1.35,
  marginBottom: SPACE_SCALE.m,
})
globalStyle(`${main} p + p`, { marginTop: SPACE_SCALE.s })
globalStyle(`${main} a`, {
  color: color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
})
globalStyle(`${main} strong`, { color: color.heading, fontWeight: 700 })

export const introBand = style({ backgroundColor: color.paper })
export const intro = style([
  editorial.page,
  {
    "@media": { [COMPACT]: { gridTemplateColumns: "minmax(0, 1fr)" } },
    alignItems: "center",
    display: "grid",
    gap: SPACE_SCALE.l,
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
    paddingBlock: SPACE_SCALE.xl,
  },
])
globalStyle(`${intro} p`, { fontSize: typeStep("-1"), marginTop: SPACE_SCALE.s })
export const lead = style({})
globalStyle(`${intro} .${lead}`, { fontSize: typeStep("0") })
export const primaryLink = style({
  alignItems: "center",
  backgroundColor: color.base,
  borderRadius: "2px",
  display: "inline-flex",
  gap: SPACE_SCALE.s,
  marginTop: SPACE_SCALE.m,
  padding: `${SPACE_SCALE.xs} ${SPACE_SCALE.s}`,
  selectors: {
    "&:hover": { backgroundColor: color.dark },
    [`${main} &`]: { color: color.white, textDecoration: "none" },
  },
})
export const workspaceImage = style({
  aspectRatio: "3 / 2",
  display: "block",
  height: "auto",
  objectFit: "cover",
  width: "100%",
})
export const document = style([editorial.page])
export const scopeNote = style({
  color: color.muted,
  fontSize: typeStep("-2"),
  marginBlock: `${SPACE_SCALE.m} 0`,
})
globalStyle(`${document} > section`, { paddingBlock: SPACE_SCALE.xl })
globalStyle(`${document} > section + section`, { borderTop: `1px solid ${color.line}` })
export const sectionIcon = style({
  color: color.accent,
  flex: `0 0 ${scaled("24px")}`,
  height: scaled("24px"),
  marginTop: "2px",
  width: scaled("24px"),
})
export const visuallyHidden = editorial.visuallyHidden
export const referenceLinks = style({ color: color.muted, fontSize: typeStep("-1") })
globalStyle(`${document} table`, {
  borderCollapse: "collapse",
  fontSize: typeStep("-1"),
  lineHeight: 1.6,
  marginBlock: SPACE_SCALE.m,
  width: "100%",
})
globalStyle(`${document} th, ${document} td`, {
  borderBottom: `1px solid ${color.line}`,
  padding: SPACE_SCALE.s,
  textAlign: "left",
  verticalAlign: "top",
})
globalStyle(`${document} thead`, { backgroundColor: color.tint })
globalStyle(`${document} thead th`, {
  color: color.heading,
  fontSize: typeStep("-2"),
  fontWeight: 700,
})
globalStyle(`${document} tbody th`, {
  color: color.heading,
  fontWeight: 600,
  overflowWrap: "anywhere",
  width: "20%",
})
export const controlsList = style({ marginBlock: SPACE_SCALE.m })
globalStyle(`${controlsList} > div`, {
  "@media": { [COMPACT]: { gap: SPACE_SCALE["3xs"], gridTemplateColumns: "minmax(0, 1fr)" } },
  display: "grid",
  gap: SPACE_SCALE.s,
  gridTemplateColumns: "20% minmax(0, 1fr)",
  paddingBlock: SPACE_SCALE.xs,
})
globalStyle(`${controlsList} dt`, { color: color.heading, fontWeight: 700 })
globalStyle(`${controlsList} dd`, { margin: 0 })
globalStyle(`${main} pre`, {
  backgroundColor: color.tint,
  borderLeft: `2px solid ${color.line}`,
  marginTop: SPACE_SCALE.s,
  padding: SPACE_SCALE.s,
  whiteSpace: "pre-wrap",
})
globalStyle(`${main} code`, {
  fontFamily: 'Consolas, "Liberation Mono", monospace',
  fontSize: typeStep("-1"),
  overflowWrap: "anywhere",
})
export const privacyBand = style({ backgroundColor: color.tint })
globalStyle(`${privacyBand} section`, { paddingBlock: SPACE_SCALE.xl })
export const furtherInformation = style({ paddingBlock: SPACE_SCALE.xl })
