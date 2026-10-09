import { BREAKPOINTS } from "@sebastian-websites/tokens"
import { createThemeContract } from "@vanilla-extract/css"

/**
 * Components read colors by role only. Each site applies its brand palette, the
 * neutrals derived from its hue, and its editorial roles, so the same component
 * renders in Software or Consulting (design/DESIGN.md).
 */
export const color = createThemeContract({
  /** Links and small accents of the current brand. */
  accent: null,
  /** Filled buttons of the current brand. */
  accentStrong: null,
  base: null,
  bright: null,
  /** The page background. */
  canvas: null,
  dark: null,
  /** Editorial headings. */
  heading: null,
  ink: null,
  line: null,
  muted: null,
  night: null,
  paper: null,
  /** The one contained accent passage of a page. */
  passage: null,
  /** Hairlines and dividers in editorial layouts. */
  rule: null,
  /** Secondary text: captions, metadata, badges. */
  subtle: null,
  /** Running text. */
  text: null,
  /** Pale panels inside the page. */
  tint: null,
  vivid: null,
  white: null,
})

export const font = {
  sans: 'var(--sebastian-font-sans, "Glober", system-ui, sans-serif)',
  serif: 'var(--sebastian-font-serif, "Elena", Georgia, serif)',
  slab: 'var(--sebastian-font-serif, "Elena", Georgia, serif)',
} as const

/** Versioned typography CSS from the brand site; binaries use the asset host (ADR-0013). */
export const FONT_STYLESHEET = "https://brand.sebastian-software.com/fonts.css"

/** Text colors on Midnight sections, independent of the brand hue. */
export const ON_NIGHT = {
  muted: "oklch(1 0 0 / 0.6)",
  rule: "oklch(1 0 0 / 0.15)",
  text: "oklch(1 0 0 / 0.8)",
} as const

/** The breakpoint below which the desktop grids collapse to one column. */
export const NARROW = `(max-width: ${BREAKPOINTS.compact})`
