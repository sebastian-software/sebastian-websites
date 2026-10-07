import { color, editorial, font } from "@sebastian-websites/ui"
import { createVar, style, styleVariants } from "@vanilla-extract/css"

import type { GroupId } from "~/lib/collection"

const groupAccent = createVar()
const groupSurface = createVar()

/** Restrained Software roles: Teal for tools and services, Lagoon on Frost for libraries. */
export const groupTone = styleVariants({
  libraries: { vars: { [groupAccent]: "#00718d", [groupSurface]: "#e7f0f3" } },
  tools: { vars: { [groupAccent]: "#005164", [groupSurface]: "#f0f7f8" } },
} satisfies Record<GroupId, unknown>)

export const head = style({ marginBottom: "64px" })

export const title = style([
  editorial.display,
  { fontSize: "60px", lineHeight: 1.15, marginBottom: "10px" },
])

export const subtitle = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "24px",
  lineHeight: 1.4,
})

export const group = style({ selectors: { "& + &": { marginTop: "96px" } } })

export const groupTitle = style([
  editorial.title,
  {
    fontSize: "44px",
    marginBottom: "16px",
    selectors: { [`${groupTone.libraries} &`]: { color: groupAccent } },
  },
])

export const grid = style({
  display: "grid",
  gap: "22px 20px",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const tile = style({
  backgroundColor: groupSurface,
  border: "1px solid oklch(0.9 0.02 215)",
  borderRadius: "6px",
  // The accent bar follows the rounded corners instead of cutting them.
  boxShadow: `inset 0 5px 0 ${groupAccent}`,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "20px 24px 18px",
  position: "relative",
  selectors: { "&:hover": { borderColor: `color-mix(in oklch, ${groupAccent} 30%, white)` } },
})

export const name = style({
  color: color.heading,
  fontFamily: font.serif,
  fontSize: "29px",
  fontWeight: 400,
  letterSpacing: "-0.01em",
  lineHeight: 1.2,
  marginBottom: "4px",
})

/** The whole tile is the link target; the title carries the accessible name. */
export const link = style({
  selectors: {
    "&::after": { content: '""', inset: 0, position: "absolute" },
    "&:focus-visible": { outline: "none" },
    "&:focus-visible::after": {
      borderRadius: "6px",
      outline: `2px solid ${color.accent}`,
      outlineOffset: "2px",
    },
  },
})

export const description = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: "17px",
  lineHeight: 1.4,
  marginBottom: "14px",
})

export const badges = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  listStyle: "none",
  margin: "0 0 12px",
  padding: 0,
})

export const badge = style({
  backgroundColor: `color-mix(in oklch, ${groupAccent} 12%, white)`,
  borderRadius: "999px",
  color: groupAccent,
  fontFamily: font.sans,
  fontSize: "16px",
  lineHeight: 1,
  padding: "6px 14px",
})

export const runtime = style({
  color: color.text,
  fontFamily: font.sans,
  fontSize: "16px",
  marginBottom: "12px",
})

export const updated = style({
  alignItems: "center",
  color: color.subtle,
  display: "flex",
  fontFamily: font.sans,
  fontSize: "16px",
  justifyContent: "space-between",
  marginTop: "auto",
})

export const arrow = style({ color: groupAccent, height: "22px", width: "22px" })
