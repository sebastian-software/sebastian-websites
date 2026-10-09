import { type PaletteId, PALETTES } from "./palettes.ts"
import { em, scaled, scaledBetween } from "./root.ts"
import { SPACE_SCALE } from "./space.ts"
import { typeStep } from "./type.ts"

/** The widest column of the page grid; it grows with the root. */
const COLUMN = scaled("52px")

/** The space between columns. */
const GUTTER = SPACE_SCALE.l

/**
 * The editorial system of the selected designs (design/IMPLEMENTATION-BRIEF.md):
 * a 12-column page, Elena for headings and editorial passages, Glober for
 * practical text, and generous, evenly distributed vertical rhythm.
 *
 * The page is a fluid grid after Utopia (utopia.fyi): it fills the width
 * between its margins up to twelve of its widest columns and their gutters.
 * Columns grow with the root, gutters and margins with the space scale, so a
 * wider screen gives the page more room as well as larger type; beyond that
 * width, the margins take the rest.
 */
export const PAGE = {
  columns: 12,
  gap: GUTTER,
  margin: SPACE_SCALE.s,
  /** Header shell and footer panel reach this far beyond the text edge. */
  overhang: scaledBetween("8px", "24px"),
  width: `calc(12 * ${COLUMN} + 11 * ${GUTTER})`,
} as const

/** The page width of the original desktop design, the reference for image widths. */
export const DESIGN_PAGE_WIDTH = 1040

/**
 * Layout breakpoints, in em so they follow the reader's default font size.
 * Compact screens (phones, portrait tablets, small windows) stack the grid into
 * one column and fold the header into a menu; from 960 px the column layout
 * applies, which also starts its own space range. Phones change layout details
 * only. Sizes need no breakpoints: the root, the type scale, and the space
 * scale move them continuously.
 */
export const BREAKPOINTS = {
  compact: em("959px"),
  phone: em("639px"),
} as const

/** One step of the type scale: size, line height, and tracking. */
export type TypeStep = {
  readonly letterSpacing: string
  readonly lineHeight: number
  readonly size: string
}

/**
 * Elena's small x-height needs a slightly larger size to match Glober at the
 * same step.
 */
const ELENA_OPTICAL_SIZE = 1.1

/**
 * The editorial roles on the type scale. Headings and leads are set in Elena
 * Regular, body text in Glober or Elena depending on the passage, labels in
 * Glober. A component may choose a smaller step for a heading in a narrow
 * column.
 */
export const TYPE_SCALE = {
  /** Inline actions such as "Explore Terminaro →". */
  action: { letterSpacing: "0", lineHeight: 1.4, size: typeStep("0") },
  /** Practical running text in Glober. */
  body: { letterSpacing: "0", lineHeight: 1.6, size: typeStep("0") },
  /** Editorial running text in Elena. */
  bodySerif: {
    letterSpacing: "0",
    lineHeight: 1.5,
    size: `calc(${typeStep("0")} * ${String(ELENA_OPTICAL_SIZE)})`,
  },
  /** Captions, badges, and the legal baseline. */
  caption: { letterSpacing: "0", lineHeight: 1.45, size: typeStep("-2") },
  /** The page's main editorial headline. */
  display: { letterSpacing: "-0.015em", lineHeight: 1.2, size: typeStep("5") },
  /** Story and passage headings. */
  heading: { letterSpacing: "-0.01em", lineHeight: 1.28, size: typeStep("3") },
  /** Editorial introductions. */
  lead: { letterSpacing: "-0.005em", lineHeight: 1.45, size: typeStep("1") },
  /** Navigation, links, and secondary text. */
  small: { letterSpacing: "0", lineHeight: 1.5, size: typeStep("-1") },
  /** Quiet headings such as the newsletter and tile titles. */
  subheading: { letterSpacing: "-0.01em", lineHeight: 1.3, size: typeStep("2") },
  /** Section headings. */
  title: { letterSpacing: "-0.012em", lineHeight: 1.2, size: typeStep("4") },
} as const satisfies Readonly<Record<string, TypeStep>>

/** Vertical rhythm, from the gap inside a block to the space between sections. */
export const RHYTHM = {
  /** Between text and its action. */
  action: SPACE_SCALE.m,
  /** Between heading, text, and action inside a block. */
  block: SPACE_SCALE.s,
  /** Between a section heading and its content. */
  head: SPACE_SCALE.xl,
  /** Between the end of one section and the start of the next. */
  section: SPACE_SCALE["3xl"],
  /** Between consecutive illustrated stories. */
  story: SPACE_SCALE["3xl"],
} as const

/** The floating header shell and the footer panel. */
export const FRAME = {
  capsule: "#f3f4f6",
  /** The desktop header height (implementation brief: 48 design pixels). */
  headerHeight: scaled("48px"),
  headerTop: scaled("16px"),
  panel: "#f1f2f3",
  panelRadius: scaled("28px"),
  panelShadow: "0 1px 2px oklch(0.2 0.01 250 / 0.04), 0 18px 40px -18px oklch(0.2 0.01 250 / 0.2)",
  /** Corner radii; `corner-shape: squircle` makes them continuous where supported. */
  radius: scaled("18px"),
  shadow: "0 1px 2px oklch(0.2 0.01 250 / 0.05), 0 10px 30px -8px oklch(0.2 0.01 250 / 0.14)",
  /** Achromatic surfaces shared by both brands. */
  shell: "#ffffff",
} as const

/** The editorial color roles every component reads. */
export type EditorialRole =
  "accent" | "accentStrong" | "canvas" | "heading" | "passage" | "rule" | "subtle" | "text" | "tint"

/**
 * Editorial colors per brand. Software stays in its teal hue, Consulting in its
 * berry hue on a neutral warm paper; text colors are dark neutrals with a trace
 * of the hue so that pink and pale-blue fields never compete.
 */
export const EDITORIAL_COLORS = {
  consulting: {
    accent: "oklch(0.44 0.175 3)",
    accentStrong: "oklch(0.44 0.175 3)",
    canvas: "oklch(0.98 0.003 80)",
    heading: "oklch(0.27 0.025 290)",
    /** The one contained judgment passage. */
    passage: "oklch(0.925 0.022 356)",
    rule: "oklch(0.86 0.012 330)",
    subtle: "oklch(0.52 0.018 310)",
    text: "oklch(0.43 0.02 300)",
    tint: "oklch(0.96 0.006 80)",
  },
  software: {
    accent: PALETTES.software.roles.vivid,
    accentStrong: PALETTES.software.roles.dark,
    canvas: "oklch(0.993 0.002 218)",
    heading: "oklch(0.27 0.05 228)",
    passage: PALETTES.software.roles.paper,
    rule: "oklch(0.86 0.02 225)",
    subtle: "oklch(0.52 0.03 228)",
    text: "oklch(0.42 0.04 230)",
    /** Pale panels such as the open foundations and project tiles. */
    tint: "oklch(0.975 0.013 215)",
  },
} as const satisfies Readonly<Record<PaletteId, Readonly<Record<EditorialRole, string>>>>
