import { color, editorial } from "@sebastian-websites/ui"
import { style } from "@vanilla-extract/css"

/**
 * The blog's one eyebrow: the small accent line above a listing title, a
 * post title, and the next step. Listings and posts compose their placement.
 */
export const eyebrow = style([
  editorial.caption,
  {
    color: color.accent,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },
])
