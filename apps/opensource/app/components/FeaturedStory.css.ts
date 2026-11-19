import { color, editorial, font, scaled, typeStep } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

import type { FeaturedId } from "~/data/featured"

export const familyName = style({ fontSize: typeStep("3") })

export const artwork = style({ display: "block", height: "auto", maxWidth: "100%" })

/** Ardo's name is set in its own system sans, as on its documentation site. */
export const ardoName = style({
  color: "oklch(0.28 0.07 330)",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  fontSize: typeStep("4"),
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1,
})

/** A project without a mark sets its name in the editorial serif. */
export const textName = style({
  color: color.heading,
  fontFamily: font.serif,
  fontSize: typeStep("4"),
  letterSpacing: "-0.01em",
  lineHeight: 1,
})

export const title = style([
  editorial.storyHeading,
  {
    fontSize: typeStep("2"),
    lineHeight: 1.3,
  },
])

export const text = style([editorial.body, { color: color.text }])

/** Each project keeps its own link color. */
export const projectLink = styleVariants({
  ardo: { color: "#b72a6f" },
  dalo: { color: "oklch(0.55 0.17 35)" },
  "effective-agent": { color: "#a54e2c" },
  ferramenta: { color: "#88492f" },
  palamedes: { color: "oklch(0.53 0.15 55)" },
} satisfies Record<FeaturedId, { color: string }>)

export const actions = style([
  editorial.storyActions,
  {
    alignItems: "flex-start",
    columnGap: scaled("28px"),
    flexDirection: "column",
    rowGap: scaled("16px"),
  },
])
