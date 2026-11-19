import { COMPACT, editorial, scaled, SPACE_SCALE, typeStep } from "@sebastian-websites/ui/styles"
import { style } from "@vanilla-extract/css"

export const region = style([
  editorial.grid,
  { "@media": { [COMPACT]: { rowGap: scaled("40px") } }, alignItems: "center" },
])

export const map = style({
  gridColumn: "1 / span 6",
  margin: 0,
})

export const aside = style({ gridColumn: "7 / span 6" })

export const since = style([
  editorial.subheading,
  { fontSize: typeStep("2"), marginBottom: scaled("14px") },
])

export const values = style([
  editorial.title,
  {
    fontSize: typeStep("4"),
    lineHeight: 1.16,
    marginBlock: SPACE_SCALE.l,
  },
])
