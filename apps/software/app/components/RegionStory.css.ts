import { color, COMPACT, editorial, font, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const region = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: "40px" } }, alignItems: "center" },
])

export const map = style({
  "@media": { [COMPACT]: { marginLeft: 0 } },
  gridColumn: "1 / span 8",
  margin: "0 0 0 -40px",
  position: "relative",
})

/** Place names stay HTML so they translate; each sits beside its part of the drawing. */
export const place = style({
  color: color.heading,
  fontFamily: font.serif,
  fontSize: "17px",
  lineHeight: 1,
  position: "absolute",
  textShadow: "0 0 6px #fff, 0 0 2px #fff",
  transform: "translate(-50%, -50%)",
  whiteSpace: "nowrap",
})

export const aside = style({
  "@media": {
    [COMPACT]: { marginLeft: 0, paddingLeft: "28px" },
    [PHONE]: { paddingLeft: "20px" },
  },
  borderLeft: `1px solid ${color.rule}`,
  gridColumn: "9 / span 4",
  marginLeft: "-48px",
  paddingBlock: "8px",
  paddingLeft: "48px",
})

export const since = style([editorial.subheading, { fontSize: "28px", marginBottom: "14px" }])

export const rule = style({
  backgroundColor: color.accent,
  blockSize: "1px",
  border: 0,
  inlineSize: "48px",
  margin: "36px 0",
  opacity: 0.45,
})

export const values = style([
  editorial.title,
  {
    "@media": { [COMPACT]: { fontSize: "36px" }, [PHONE]: { fontSize: "30px" } },
    fontSize: "44px",
    lineHeight: 1.16,
  },
])
