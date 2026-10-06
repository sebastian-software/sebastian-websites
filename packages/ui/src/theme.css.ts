import { createThemeContract } from "@vanilla-extract/css"

/**
 * Components read colors by role only. Each site applies its brand palette to
 * these variables, so the same component renders in Software or Consulting.
 */
export const color = createThemeContract({
  base: null,
  bright: null,
  dark: null,
  night: null,
  paper: null,
  vivid: null,
})

export const font = {
  sans: '"Sebastian Sans", system-ui, sans-serif',
  slab: '"Sebastian Slab", Georgia, serif',
} as const

/** The licensed fonts, served from the company's font host (ADR-0013). */
export const FONT_STYLESHEET = "https://fonts.sebastian-software.com/fonts.css"
