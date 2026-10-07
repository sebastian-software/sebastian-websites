import { style } from "@vanilla-extract/css"

import { variables } from "~/styles/theme.css"

const PAPER_WIDTH = "210mm"
const MOBILE = "screen and (max-width: 800px)"
const RAIL = "screen and (min-width: 1240px)"

export const rail = style({
  "@media": {
    [MOBILE]: {
      padding: "0 1.25rem 2rem",
    },
    print: { display: "none" },
    [RAIL]: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      gap: "2rem",
      margin: 0,
      position: "sticky",
      top: "5.5rem",
      width: "19rem",
    },
    screen: {
      display: "grid",
      gap: "1.5rem",
      margin: "2.5rem auto 0",
      maxWidth: PAPER_WIDTH,
    },
  },
  fontFamily: variables.font.body,
})

export const railModule = style({
  borderTop: `1px solid ${variables.color.border}`,
  paddingTop: "1rem",
})

export const railHeading = style({
  color: variables.color.dark,
  fontFamily: variables.font.heading,
  fontSize: "1rem",
  fontWeight: variables.fontWeight.medium,
  margin: "0 0 0.5rem",
})

export const railText = style({
  color: variables.color.mutedForeground,
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: "0 0 0.9rem",
})

export const railActions = style({
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
})

export const railLink = style({
  color: variables.color.base,
  display: "inline-flex",
  fontSize: "0.875rem",
  fontWeight: variables.fontWeight.semibold,
  minHeight: "2.75rem",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
})

export const railStand = style({
  color: variables.color.mutedForeground,
  fontSize: "0.75rem",
  margin: "0.6rem 0 0",
})
