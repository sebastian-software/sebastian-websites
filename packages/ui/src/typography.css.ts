import { scaled, SPACE, TYPE, typeStep } from "@sebastian-websites/tokens"
import { globalStyle, style } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

export const display = style({
  fontSize: TYPE.display,
  fontWeight: 300,
  letterSpacing: "-0.035em",
  lineHeight: 0.98,
})

export const displayAccent = style({ color: color.vivid, fontStyle: "normal" })

export const h2 = style({ fontSize: TYPE.h2 })

export const h2Large = style({ fontSize: typeStep("5"), maxWidth: "18ch" })

export const h3 = style({
  fontSize: TYPE.h3,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  marginBottom: SPACE.sm,
})

export const lead = style({
  color: color.muted,
  fontSize: TYPE.lead,
  fontWeight: 300,
  lineHeight: 1.5,
  maxWidth: "46ch",
})

export const text = style({
  fontSize: TYPE.body,
  lineHeight: TYPE.bodyLineHeight,
  maxWidth: "60ch",
})

export const textMuted = style([text, { color: color.muted }])

/** Paragraphs in a prose block keep 22 px between them. */
export const prose = style({})
globalStyle(`${prose} > p + p`, { marginTop: scaled("22px") })

export const numeral = style({
  fontSize: TYPE.numeral,
  fontWeight: 300,
  letterSpacing: "-0.035em",
  lineHeight: 0.95,
})
