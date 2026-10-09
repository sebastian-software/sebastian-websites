import { color, COMPACT, editorial, font, scaled, typeStep } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

import type { FeaturedId } from "~/data/featured"

export const eyebrow = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: typeStep("-2"),
  letterSpacing: "0.26em",
  lineHeight: 1,
  marginBottom: scaled("22px"),
  textTransform: "uppercase",
})

/** The lockup may reach past the text column; the drawing leaves room for it. */
/** Stacked on compact screens, the lockup stays inside the page and may wrap. */
const wrapping = {
  "@media": { [COMPACT]: { flexWrap: "wrap", marginBottom: scaled("28px"), width: "auto" } },
} as const

export const identity = styleVariants({
  end: [
    editorial.storyIdentity,
    {
      ...wrapping,
      columnGap: scaled("22px"),
      flexWrap: "nowrap",
      marginBottom: scaled("36px"),
      width: "max-content",
    },
  ],
  start: [
    editorial.storyIdentity,
    { ...wrapping, columnGap: scaled("22px"), flexWrap: "nowrap", marginBottom: scaled("36px") },
  ],
})

export const artwork = style({ display: "block", flexShrink: 0, width: "auto" })

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
  ferramenta: { color: "oklch(0.52 0.15 38)" },
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
