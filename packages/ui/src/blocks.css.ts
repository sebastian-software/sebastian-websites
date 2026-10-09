import { RADIUS, scaled, SPACE, TYPE, typeStep } from "@sebastian-websites/tokens"
import { style, styleVariants } from "@vanilla-extract/css"

import { color, NARROW, ON_NIGHT } from "./theme.css.ts"

// ---- Hero ------------------------------------------------------------------

export const hero = style({
  background: `radial-gradient(55% 60% at 78% 35%, color-mix(in oklch, ${color.bright} 22%, ${color.paper}), transparent 72%)`,
  overflow: "hidden",
  padding: scaled("112px 0 104px"),
  position: "relative",
})

export const heroGrid = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  alignItems: "center",
  display: "grid",
  gap: scaled("80px"),
  gridTemplateColumns: "1.1fr 0.9fr",
})

export const heroLead = style({ margin: scaled("32px 0 20px") })
export const heroMore = style({ margin: scaled("0 0 40px") })

export const facts = style({
  borderTop: `1px solid ${color.line}`,
  display: "flex",
  flexWrap: "wrap",
  gap: scaled("56px"),
  marginTop: scaled("56px"),
  paddingTop: scaled("28px"),
})

export const factValue = style({
  color: color.dark,
  display: "block",
  fontSize: typeStep("2"),
  fontWeight: 300,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
})

export const factLabel = style({ color: color.muted, fontSize: TYPE.tiny })

// ---- Photos ----------------------------------------------------------------

export const photo = style({
  backgroundColor: color.line,
  borderRadius: RADIUS.panel,
  overflow: "hidden",
  position: "relative",
})

export const photoFrame = styleVariants({
  landscape: { aspectRatio: "4 / 3" },
  portrait: { aspectRatio: "4 / 5" },
  square: { aspectRatio: "1 / 1" },
})

export const photoImage = style({
  height: "100%",
  inset: 0,
  objectFit: "cover",
  position: "absolute",
  width: "100%",
})

export const caption = style({
  alignItems: "center",
  backdropFilter: "blur(6px)",
  backgroundColor: "oklch(1 0 0 / 0.86)",
  borderRadius: RADIUS.pill,
  bottom: scaled("20px"),
  color: color.ink,
  display: "flex",
  fontSize: TYPE.tiny,
  gap: scaled("10px"),
  left: scaled("20px"),
  padding: scaled("8px 14px"),
  position: "absolute",
})

export const dot = style({
  backgroundColor: color.vivid,
  borderRadius: "50%",
  display: "inline-block",
  flexShrink: 0,
  height: scaled("7px"),
  width: scaled("7px"),
})

// ---- Logo strip ------------------------------------------------------------

export const band = style({ backgroundColor: color.white, padding: scaled("36px 0") })

export const bandInner = style({
  "@media": { [NARROW]: { flexDirection: "column", gap: SPACE.md } },
  alignItems: "center",
  display: "flex",
  gap: scaled("48px"),
})

export const bandLabel = style({ marginBottom: 0, whiteSpace: "nowrap" })

export const logos = style({
  "@media": { [NARROW]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } },
  alignItems: "center",
  display: "grid",
  flex: 1,
  gap: SPACE.md,
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  minWidth: 0,
  padding: 0,
})

export const logo = style({
  filter: "grayscale(1) contrast(0.6) brightness(0.9)",
  height: scaled("22px"),
  marginInline: "auto",
  maxWidth: scaled("120px"),
  opacity: 0.8,
  width: "auto",
})

// ---- Columns, cards, rows --------------------------------------------------

export const column = style({
  borderTop: `1px solid ${color.line}`,
  display: "flex",
  flexDirection: "column",
  paddingTop: scaled("28px"),
})

export const columnNumber = style({
  color: color.vivid,
  display: "block",
  fontSize: TYPE.tiny,
  fontWeight: 600,
  letterSpacing: "0.08em",
  marginBottom: scaled("20px"),
})

export const columnLink = style({ marginTop: "auto", paddingTop: SPACE.md })

export const cards = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  display: "grid",
  gap: SPACE.md,
  gridTemplateColumns: "repeat(3, 1fr)",
})

export const card = style({
  backgroundColor: color.paper,
  borderRadius: RADIUS.panel,
  display: "flex",
  flexDirection: "column",
  padding: SPACE.lg,
})

export const cardTitle = style({
  fontSize: typeStep("2"),
  fontWeight: 400,
  letterSpacing: "-0.015em",
  margin: scaled("0 0 14px"),
})

export const cardText = style({
  color: color.muted,
  fontSize: typeStep("-1"),
  lineHeight: TYPE.bodyLineHeight,
})

export const status = style({
  alignSelf: "flex-start",
  backgroundColor: color.white,
  border: `1px solid ${color.line}`,
  borderRadius: RADIUS.pill,
  color: color.vivid,
  fontSize: TYPE.eyebrow,
  fontWeight: 600,
  letterSpacing: "0.06em",
  marginBottom: SPACE.md,
  padding: scaled("6px 10px"),
  textTransform: "uppercase",
  whiteSpace: "nowrap",
})

export const statusSoon = style({ color: color.muted })

export const lines = style({ borderBottom: `1px solid ${color.line}` })

export const lineRow = style({
  "@media": { [NARROW]: { gap: SPACE.sm, gridTemplateColumns: "1fr" } },
  borderTop: `1px solid ${color.line}`,
  display: "grid",
  gap: SPACE.xl,
  gridTemplateColumns: "1fr 2fr",
  padding: scaled("36px 0"),
})

export const lineTitle = style({
  fontSize: TYPE.body,
  fontWeight: 500,
  lineHeight: TYPE.bodyLineHeight,
  margin: 0,
})

export const lineText = style({
  color: color.muted,
  fontSize: TYPE.body,
  lineHeight: TYPE.bodyLineHeight,
  maxWidth: "62ch",
})

export const linesFoot = style({ paddingTop: scaled("32px") })

// ---- Numbers ---------------------------------------------------------------

export const numbers = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  alignItems: "start",
  borderTop: `1px solid ${ON_NIGHT.rule}`,
  display: "grid",
  gap: scaled("48px"),
  gridTemplateColumns: "repeat(3, 1fr)",
  paddingTop: SPACE.lg,
})

export const numberValue = style({ color: color.white, display: "block" })

export const numberLabel = style({
  color: ON_NIGHT.text,
  display: "block",
  fontSize: typeStep("-1"),
  lineHeight: 1.4,
  marginTop: scaled("14px"),
  minHeight: "2.8em",
})

export const numbersFoot = style({
  alignItems: "center",
  color: ON_NIGHT.muted,
  display: "flex",
  fontSize: TYPE.tiny,
  gap: scaled("8px"),
  justifyContent: "flex-end",
  marginTop: scaled("32px"),
})

export const liveDot = style([dot, { backgroundColor: color.bright }])

// ---- People ----------------------------------------------------------------

export const persons = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  display: "grid",
  gap: SPACE.xl,
  gridTemplateColumns: "1fr 1fr",
  marginTop: scaled("80px"),
})

export const person = style({
  alignItems: "start",
  borderTop: `1px solid ${color.line}`,
  display: "grid",
  gap: SPACE.md,
  gridTemplateColumns: `${scaled("72px")} 1fr`,
  paddingTop: scaled("28px"),
})

export const face = style({
  borderRadius: "50%",
  height: scaled("72px"),
  overflow: "hidden",
  position: "relative",
  width: scaled("72px"),
})

export const personName = style({
  display: "block",
  fontSize: typeStep("0"),
  fontWeight: 500,
  lineHeight: 1.3,
})

export const personRole = style({
  color: color.muted,
  display: "block",
  fontSize: TYPE.small,
  lineHeight: 1.4,
  margin: scaled("4px 0 12px"),
})

export const personText = style({ color: color.muted, fontSize: typeStep("-1"), lineHeight: 1.6 })

// ---- Closing ---------------------------------------------------------------

export const finalGrid = style({
  "@media": { [NARROW]: { gridTemplateColumns: "1fr" } },
  alignItems: "center",
  display: "grid",
  gap: scaled("80px"),
  gridTemplateColumns: "1.2fr 0.8fr",
})

export const finalLead = style({ margin: scaled("24px 0 36px") })
