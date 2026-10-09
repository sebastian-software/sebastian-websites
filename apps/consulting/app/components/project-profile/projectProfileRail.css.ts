import { style } from "@vanilla-extract/css"

import { variables } from "~/styles/theme.css"

import { DOCKED, dockedRail, STACKED } from "../profile-screen/stage.css"

const PAPER_WIDTH = "210mm"
const MOBILE = "screen and (max-width: 800px)"

export const rail = style({
  "@media": {
    [DOCKED]: {
      ...dockedRail,
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
    [MOBILE]: {
      display: "grid",
      gap: "1.5rem",
      margin: "2.5rem auto 0",
      maxWidth: PAPER_WIDTH,
      padding: "0 1.25rem 2rem",
    },
    print: { display: "none" },
    [STACKED]: {
      display: "grid",
      gap: "1.5rem",
      marginTop: "2.5rem",
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
