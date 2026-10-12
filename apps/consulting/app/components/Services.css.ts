import { editorial, SPACE_SCALE, typeStep } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/** The section heading leads the smaller headings in its three columns. */
export const heading = style([
  editorial.heading,
  {
    marginBottom: SPACE_SCALE.xl,
  },
])

export const list = style([
  editorial.grid,
  {
    columnGap: SPACE_SCALE.xl,
    listStyle: "none",
    margin: 0,
    padding: 0,
    rowGap: SPACE_SCALE.xl,
  },
])

export const item = style({ gridColumn: "span 4" })

export const title = style([
  editorial.subheading,
  {
    marginBottom: SPACE_SCALE.s,
  },
])

export const text = style([editorial.body, { fontSize: typeStep("0"), lineHeight: 1.55 }])
