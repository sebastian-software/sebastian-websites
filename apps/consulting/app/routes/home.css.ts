import { color, editorial } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([editorial.page, { paddingTop: "112px" }])

export const hero = style([
  editorial.grid,
  editorial.section,
  { alignItems: "start", paddingBottom: "176px" },
])

export const heroTitle = style([
  editorial.display,
  { fontSize: "56px", gridColumn: "1 / span 7", lineHeight: 1.16, marginRight: "-32px" },
])

/** The offer sits behind a berry hairline, beside the headline. */
export const heroAside = style({
  borderLeft: `1px solid ${color.accent}`,
  gridColumn: "8 / span 5",
  marginLeft: "24px",
  paddingBlock: "4px",
  paddingLeft: "32px",
})

export const heroText = style([editorial.body, { fontSize: "19px", lineHeight: 1.55 }])

export const heroMore = style([heroText, { marginTop: "16px" }])

export const heroAction = style({ marginTop: "32px" })

export const block = style([editorial.section])

export const passage = style({ paddingBottom: "128px" })
