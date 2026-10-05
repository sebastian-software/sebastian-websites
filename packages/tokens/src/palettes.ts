/**
 * The binding brand palettes: one OKLCH hue per brand in six lightness steps.
 * Values mirror `sebastian-brand/tokens/*.css`; the role names are shared by all
 * brands so components never reference a brand directly.
 */
export const ROLES = ["night", "dark", "base", "vivid", "bright", "paper"] as const
export type Role = (typeof ROLES)[number]

export type BrandPalette = {
  readonly hue: number
  readonly names: Readonly<Record<Role, string>>
  readonly roles: Readonly<Record<Role, string>>
}

const LIGHTNESS = {
  base: 0.4,
  bright: 0.7,
  dark: 0.25,
  night: 0.15,
  paper: 0.95,
  vivid: 0.5,
} as const satisfies Readonly<Record<Role, number>>

function oklch(role: Role, chroma: number, hue: number): string {
  return `oklch(${LIGHTNESS[role]} ${chroma} ${hue})`
}

type PaletteSpec = {
  readonly chroma: Readonly<Record<Role, number>>
  readonly hue: number
  readonly names: Readonly<Record<Role, string>>
}

function definePalette({ chroma, hue, names }: PaletteSpec): BrandPalette {
  const roles = {
    base: oklch("base", chroma.base, hue),
    bright: oklch("bright", chroma.bright, hue),
    dark: oklch("dark", chroma.dark, hue),
    night: oklch("night", chroma.night, hue),
    paper: oklch("paper", chroma.paper, hue),
    vivid: oklch("vivid", chroma.vivid, hue),
  }
  return { hue, names, roles }
}

export const PALETTES = {
  consulting: definePalette({
    chroma: { base: 0.17, bright: 0.2, dark: 0.1, night: 0.05, paper: 0.01, vivid: 0.2 },
    hue: 2,
    names: {
      base: "Burgundy",
      bright: "Ember",
      dark: "Mulberry",
      night: "Plum",
      paper: "Linen",
      vivid: "Ruby",
    },
  }),
  software: definePalette({
    chroma: { base: 0.08, bright: 0.11, dark: 0.05, night: 0.02, paper: 0.01, vivid: 0.11 },
    hue: 218,
    names: {
      base: "Teal",
      bright: "Signal",
      dark: "Midnight",
      night: "Space",
      paper: "Frost",
      vivid: "Lagoon",
    },
  }),
} as const satisfies Readonly<Record<string, BrandPalette>>

export type PaletteId = keyof typeof PALETTES
