import { color, font, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** The skills catalog as a pale panel, standing in for a drawing. */
export const panel = style({
  "@media": { [PHONE]: { padding: "24px 22px 26px" } },
  backgroundColor: color.tint,
  border: `1px solid ${color.rule}`,
  borderRadius: "12px",
  boxShadow: `inset 0 5px 0 ${color.accent}`,
  padding: "32px 36px 34px",
})

export const label = style({
  color: color.subtle,
  fontFamily: font.sans,
  fontSize: "13px",
  letterSpacing: "0.18em",
  marginBottom: "18px",
  textTransform: "uppercase",
})

export const list = style({
  display: "grid",
  listStyle: "none",
  margin: 0,
  padding: 0,
  rowGap: "2px",
})

export const item = style({
  alignItems: "baseline",
  borderTop: `1px solid ${color.rule}`,
  columnGap: "16px",
  display: "grid",
  fontFamily: font.sans,
  gridTemplateColumns: "2em minmax(0, 1fr) auto",
  padding: "9px 0",
  selectors: { "&:last-child": { borderBottom: `1px solid ${color.rule}` } },
})

export const number = style({ color: color.accent, fontSize: "13px", letterSpacing: "0.12em" })

export const name = style({ color: color.heading, fontSize: "18px" })

export const slug = style({
  color: color.subtle,
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: "14px",
})

export const foot = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: "15px",
  lineHeight: 1.5,
  marginTop: "18px",
})
