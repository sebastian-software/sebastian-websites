import { color, font } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

const base = style({
  alignItems: "center",
  borderRadius: "4px",
  columnGap: "8px",
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
  default: [base, { fontSize: "16px", height: "48px", paddingInline: "24px" }],
  lg: [base, { fontSize: "19px", height: "56px", paddingInline: "26px" }],
  sm: [base, { fontSize: "16px", height: "44px", paddingInline: "16px" }],
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
