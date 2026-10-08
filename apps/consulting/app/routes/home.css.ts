import { color, COMPACT, editorial, PHONE } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

export const main = style([
  editorial.page,
  {
    "@media": { [COMPACT]: { paddingTop: "72px" }, [PHONE]: { paddingTop: "48px" } },
    paddingTop: "112px",
  },
])

export const hero = style([
  editorial.grid,
  editorial.section,
  {
    "@media": {
      [COMPACT]: { paddingBottom: "120px", rowGap: "32px" },
      [PHONE]: { paddingBottom: "96px" },
    },
    alignItems: "start",
    paddingBottom: "176px",
  },
])

export const heroTitle = style([
  editorial.display,
  {
    "@media": {
      [COMPACT]: { fontSize: "46px", marginRight: 0 },
      [PHONE]: { fontSize: "36px" },
    },
    fontSize: "56px",
    gridColumn: "1 / span 7",
    lineHeight: 1.16,
    marginRight: "-32px",
  },
])

/** The offer sits behind a berry hairline, beside the headline. */
export const heroAside = style({
  "@media": { [COMPACT]: { marginLeft: 0, paddingLeft: "24px" }, [PHONE]: { paddingLeft: "20px" } },
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

export const passage = style({
  "@media": { [COMPACT]: { paddingBottom: "104px" }, [PHONE]: { paddingBottom: "80px" } },
  paddingBottom: "128px",
})
