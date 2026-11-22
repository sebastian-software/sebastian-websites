import { style } from "@vanilla-extract/css"

export const logo = style({
  alignItems: "center",
  color: "#29362f",
  display: "inline-flex",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontWeight: 600,
  gap: "0.35em",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
})

export const mark = style({ display: "block", height: "1.6em", width: "1.6em" })
