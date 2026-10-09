import { scaled, typeStep } from "@sebastian-websites/tokens"
import { style } from "@vanilla-extract/css"

import { caption, display, lead, page } from "../editorial/editorial.css.ts"
import { COMPACT, PHONE } from "../responsive.ts"
import { color, font } from "../theme.css.ts"

export const main = style([
  page,
  {
    "@media": {
      [COMPACT]: { paddingBlock: scaled("72px 104px") },
      [PHONE]: { paddingBlock: scaled("48px 80px") },
    },
    paddingBlock: scaled("112px 160px"),
  },
])

export const eyebrow = style([
  caption,
  {
    color: color.accent,
    fontWeight: 600,
    letterSpacing: "0.22em",
    marginBottom: scaled("20px"),
    textTransform: "uppercase",
  },
])

export const title = style([display, { marginBottom: scaled("24px"), maxWidth: "14em" }])

export const text = style([lead, { maxWidth: "28em" }])

export const links = style({
  "@media": { [PHONE]: { marginTop: scaled("28px") } },
  borderTop: `1px solid ${color.rule}`,
  display: "grid",
  listStyle: "none",
  margin: scaled("40px 0 0"),
  maxWidth: scaled("560px"),
  padding: 0,
})

export const link = style({
  alignItems: "center",
  borderBottom: `1px solid ${color.rule}`,
  color: color.heading,
  columnGap: scaled("12px"),
  display: "flex",
  fontFamily: font.sans,
  fontSize: typeStep("0"),
  justifyContent: "space-between",
  minHeight: scaled("56px"),
  paddingBlock: scaled("12px"),
  selectors: { "&:hover": { color: color.accent } },
})

export const arrow = style({ color: color.accent, flexShrink: 0, height: "1em", width: "1em" })
