import { type PaletteId, PALETTES } from "./palettes.ts"

/**
 * The spacing scale of the design system: an 8 px base, used for every gap,
 * padding, and section rhythm (design/DESIGN.md).
 */
export const SPACE = {
  lg: "40px",
  md: "24px",
  section: "128px",
  sm: "16px",
  xl: "64px",
  xs: "8px",
  xxl: "96px",
} as const

/** Corner radii: pills for buttons and status marks, panels for cards and photos. */
export const RADIUS = {
  card: "16px",
  panel: "24px",
  pill: "999px",
} as const

/** The page container: 1320 px, widening to 1480 px on very large screens. */
export const CONTAINER = {
  gutter: "24px",
  max: "1320px",
  wide: "1480px",
  wideFrom: "1700px",
} as const

/** The type scale. Display and headline sizes are fluid; text sizes are fixed. */
export const TYPE = {
  body: "17px",
  bodyLineHeight: 1.65,
  display: "clamp(56px, 6.4vw, 108px)",
  eyebrow: "12px",
  h2: "clamp(28px, 3.6vw, 44px)",
  h3: "22px",
  intro: "18px",
  lead: "22px",
  numeral: "80px",
  small: "14px",
  tiny: "13px",
} as const

export type NeutralRole = "ink" | "line" | "muted" | "white"

/**
 * The neutral roles each brand derives from its hue: text, muted text, hairlines,
 * and the white of panels. Chroma stays low so the neutrals read as grey with a
 * trace of the brand.
 *
 * @param hue - The brand hue in OKLCH degrees.
 * @returns The four neutral colours.
 */
export function deriveNeutrals(hue: number): Readonly<Record<NeutralRole, string>> {
  return {
    ink: `oklch(0.2 0.03 ${hue})`,
    line: `oklch(0.88 0.015 ${hue})`,
    muted: `oklch(0.48 0.03 ${hue})`,
    white: "#fff",
  }
}

export const NEUTRALS = {
  consulting: deriveNeutrals(PALETTES.consulting.hue),
  software: deriveNeutrals(PALETTES.software.hue),
} as const satisfies Readonly<Record<PaletteId, Readonly<Record<NeutralRole, string>>>>
