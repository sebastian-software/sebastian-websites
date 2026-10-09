import { color, COMPACT, editorial, font, PHONE, scaled, typeStep } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

export const content = style({ position: "relative", zIndex: 1 })

/**
 * Beside a drawing on the right, the identity row may reach past the text column
 * into the drawing's margin; on the right-hand side it stays inside the page and
 * the status wraps below the wordmark.
 */
/** Stacked on compact screens, the row stays inside the page and may wrap. */
const wrapping = { "@media": { [COMPACT]: { flexWrap: "wrap", width: "auto" } } } as const

export const identity = styleVariants({
  end: [editorial.storyIdentity, { ...wrapping, flexWrap: "nowrap", width: "max-content" }],
  start: [editorial.storyIdentity, { ...wrapping, flexWrap: "nowrap" }],
})

export const mark = style({
  "@media": { [PHONE]: { height: scaled("72px") } },
  display: "block",
  flexShrink: 0,
  height: scaled("92px"),
  width: "auto",
})

export const name = style({
  alignItems: "baseline",
  columnGap: scaled("28px"),
  display: "flex",
  flexWrap: "wrap",
  rowGap: scaled("10px"),
})

export const wordmark = styleVariants({
  "palamedes-plus": { display: "block", height: scaled("34px"), width: "auto" },
  terminaro: { display: "block", height: scaled("33px"), width: "auto" },
})

/** VorOrt keeps its name as ordinary text until its logo is settled. */
export const textName = style({
  color: color.heading,
  fontFamily: font.serif,
  fontSize: typeStep("5"),
  letterSpacing: "-0.02em",
  lineHeight: 1,
})

export const status = style({
  borderBottom: `1px solid currentColor`,
  color: color.accent,
  fontFamily: font.sans,
  fontSize: typeStep("0"),
  lineHeight: 1.3,
  paddingBottom: "2px",
  whiteSpace: "nowrap",
})

export const text = editorial.bodySerif
