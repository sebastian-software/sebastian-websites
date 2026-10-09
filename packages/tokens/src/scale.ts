import { type PaletteId, PALETTES } from "./palettes.ts"
import { em, scaled, scaledBetween } from "./root.ts"

/**
 * The spacing scale of the design system: an 8 px base, used for every gap,
 * padding, and section rhythm (design/DESIGN.md).
 */
export const SPACE = {
  lg: scaled("40px"),
  md: scaled("24px"),
  section: scaled("128px"),
  sm: scaled("16px"),
  xl: scaled("64px"),
  xs: scaled("8px"),
  xxl: scaled("96px"),
} as const

/** Corner radii: pills for buttons and status marks, panels for cards and photos. */
export const RADIUS = {
  card: scaled("16px"),
  panel: scaled("24px"),
  pill: "999px",
} as const

/** The page container: 1320 design pixels, widening to 1480 on very wide screens. */
export const CONTAINER = {
  gutter: scaled("24px"),
  max: scaled("1320px"),
  wide: scaled("1480px"),
  wideFrom: em("1700px"),
} as const

/** The type scale. Body text is the root; display and headline sizes move from the phone to the desktop design. */
export const TYPE = {
  body: "1rem",
  bodyLineHeight: 1.65,
  display: scaledBetween("56px", "92px"),
  eyebrow: scaled("12px"),
  h2: scaledBetween("28px", "44px"),
  h3: scaled("22px"),
  intro: scaled("18px"),
  lead: scaled("22px"),
  numeral: scaled("80px"),
  small: scaled("14px"),
  tiny: scaled("13px"),
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
