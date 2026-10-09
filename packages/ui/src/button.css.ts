import { RADIUS, scaled, typeStep } from "@sebastian-websites/tokens"
import { style, styleVariants } from "@vanilla-extract/css"

import { sectionTone } from "./layout.css.ts"
import { color } from "./theme.css.ts"

const base = style({
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: RADIUS.pill,
  display: "inline-flex",
  fontSize: typeStep("-1"),
  fontWeight: 600,
  gap: scaled("8px"),
  lineHeight: 1,
  padding: scaled("14px 24px"),
})

/** Primary for the one main action, secondary beside it, ghost for inline links. */
export const button = styleVariants({
  ghost: [base, { color: color.vivid, paddingInline: 0 }],
  primary: [
    base,
    {
      backgroundColor: color.dark,
      color: color.white,
      selectors: {
        [`${sectionTone.night} &`]: { backgroundColor: color.white, color: color.dark },
      },
    },
  ],
  secondary: [
    base,
    {
      backgroundColor: color.white,
      borderColor: color.line,
      color: color.ink,
      selectors: {
        [`${sectionTone.night} &`]: {
          backgroundColor: "transparent",
          borderColor: "oklch(1 0 0 / 0.3)",
          color: color.white,
        },
      },
    },
  ],
})
