import { createThemeContract } from "@vanilla-extract/css"

/**
 * Components read colours by role only. Each site applies its brand palette and
 * the neutrals derived from its hue, so the same component renders in Software
 * or Consulting (design/DESIGN.md).
 */
export const color = createThemeContract({
  base: null,
  bright: null,
  dark: null,
  ink: null,
  line: null,
  muted: null,
  night: null,
  paper: null,
  vivid: null,
  white: null,
})

export const font = {
  sans: 'var(--sebastian-font-sans, "Sebastian Sans", system-ui, sans-serif)',
  slab: 'var(--sebastian-font-serif, "Sebastian Slab", Georgia, serif)',
} as const

/** The licensed fonts, served from the company's font host (ADR-0013). */
export const FONT_STYLESHEET = "https://fonts.sebastian-software.com/fonts.css"

/** Text colours on Midnight sections, independent of the brand hue. */
export const ON_NIGHT = {
  muted: "oklch(1 0 0 / 0.6)",
  rule: "oklch(1 0 0 / 0.15)",
  text: "oklch(1 0 0 / 0.8)",
} as const

/** The breakpoint below which the desktop grids collapse to one column. */
export const NARROW = "(max-width: 900px)"
