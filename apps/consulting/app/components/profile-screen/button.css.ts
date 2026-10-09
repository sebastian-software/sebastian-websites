import { color, font, scaled } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

const base = style({
  alignItems: "center",
  borderRadius: "4px",
  columnGap: scaled("8px"),
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: 0,
  fontFamily: font.sans,
  fontWeight: 500,
  justifyContent: "center",
  textDecoration: "none",
  whiteSpace: "nowrap",
})

export const size = styleVariants({
  default: [
    base,
    { fontSize: scaled("16px"), height: scaled("48px"), paddingInline: scaled("24px") },
  ],
  lg: [base, { fontSize: scaled("19px"), height: scaled("56px"), paddingInline: scaled("26px") }],
  sm: [base, { fontSize: scaled("16px"), height: scaled("44px"), paddingInline: scaled("16px") }],
})

export const variant = styleVariants({
  default: {
    backgroundColor: color.accentStrong,
    color: "#fff",
    selectors: {
      "&:hover": { backgroundColor: `color-mix(in oklch, ${color.accentStrong} 88%, black)` },
    },
  },
  outline: {
    border: `1.5px solid ${color.base}`,
    color: color.base,
    selectors: { "&:hover": { backgroundColor: color.base, color: "#fff" } },
  },
})
