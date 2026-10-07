import { color, editorial, font } from "@sebastian-websites/ui"
import { style, styleVariants } from "@vanilla-extract/css"

import type { FeaturedId } from "~/data/featured"

export const eyebrow = style({
  color: color.accent,
  fontFamily: font.sans,
  fontSize: "13px",
  letterSpacing: "0.26em",
  lineHeight: 1,
  marginBottom: "22px",
  textTransform: "uppercase",
})

/** The lockup may reach past the text column; the drawing leaves room for it. */
export const identity = styleVariants({
  end: [
    editorial.storyIdentity,
    { columnGap: "22px", flexWrap: "nowrap", marginBottom: "36px", width: "max-content" },
  ],
  start: [editorial.storyIdentity, { columnGap: "22px", flexWrap: "nowrap", marginBottom: "36px" }],
})

export const artwork = style({ display: "block", flexShrink: 0, width: "auto" })

/** Ardo's name is set in its own system sans, as on its documentation site. */
export const ardoName = style({
  color: "oklch(0.28 0.07 330)",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  fontSize: "46px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1,
})

export const title = style([editorial.storyHeading, { fontSize: "29px", lineHeight: 1.3 }])

export const text = style([editorial.body, { color: color.text }])

/** Each project keeps its own link color. */
export const projectLink = styleVariants({
  ardo: { color: "#b72a6f" },
  dalo: { color: "oklch(0.55 0.17 35)" },
  ferramenta: { color: "oklch(0.52 0.15 38)" },
  palamedes: { color: "oklch(0.53 0.15 55)" },
} satisfies Record<FeaturedId, { color: string }>)

export const actions = style([
  editorial.storyActions,
  { alignItems: "flex-start", columnGap: "28px", flexDirection: "column", rowGap: "16px" },
])
