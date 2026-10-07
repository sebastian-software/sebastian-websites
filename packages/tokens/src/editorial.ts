import { type PaletteId, PALETTES } from "./palettes.ts"

/**
 * The editorial system of the selected designs (design/IMPLEMENTATION-BRIEF.md):
 * a 12-column page of 1040 px, Elena for headings and editorial passages, Glober
 * for practical text, and generous, evenly distributed vertical rhythm. Sizes are
 * fixed on desktop; extra viewport width becomes margin, not larger content.
 */
export const PAGE = {
  columns: 12,
  gap: "32px",
  /** The smallest margin beside the page on narrow desktop windows. */
  margin: "48px",
  /** Header shell and footer panel reach this far beyond the text edge. */
  overhang: "24px",
  width: "1040px",
} as const

/** One step of the type scale: size, line height, and tracking. */
export type TypeStep = {
  readonly letterSpacing: string
  readonly lineHeight: number
  readonly size: string
}

/**
 * The editorial type scale. Headings and leads are set in Elena Regular, body
 * text in Glober or Elena depending on the passage, labels in Glober.
 */
export const TYPE_SCALE = {
  /** Inline actions such as "Explore Terminaro →". */
  action: { letterSpacing: "0", lineHeight: 1.4, size: "19px" },
  /** Practical running text in Glober. */
  body: { letterSpacing: "0", lineHeight: 1.6, size: "18px" },
  /** Editorial running text in Elena, whose small x-height needs a larger size. */
  bodySerif: { letterSpacing: "0", lineHeight: 1.5, size: "20px" },
  /** Captions, badges, and the legal baseline. */
  caption: { letterSpacing: "0", lineHeight: 1.45, size: "14px" },
  /** The page's main editorial headline. */
  display: { letterSpacing: "-0.015em", lineHeight: 1.2, size: "52px" },
  /** Story and passage headings. */
  heading: { letterSpacing: "-0.01em", lineHeight: 1.28, size: "34px" },
  /** Editorial introductions. */
  lead: { letterSpacing: "-0.005em", lineHeight: 1.45, size: "24px" },
  /** Navigation, links, and secondary text. */
  small: { letterSpacing: "0", lineHeight: 1.5, size: "16px" },
  /** Quiet headings such as the newsletter and tile titles. */
  subheading: { letterSpacing: "-0.01em", lineHeight: 1.3, size: "26px" },
  /** Section headings. */
  title: { letterSpacing: "-0.012em", lineHeight: 1.2, size: "40px" },
} as const satisfies Readonly<Record<string, TypeStep>>

/** Vertical rhythm, from the gap inside a block to the space between sections. */
export const RHYTHM = {
  /** Between text and its action. */
  action: "32px",
  /** Between heading, text, and action inside a block. */
  block: "24px",
  /** Between a section heading and its content. */
  head: "56px",
  /** Between the end of one section and the start of the next. */
  section: "160px",
  /** Between consecutive illustrated stories. */
  story: "160px",
} as const

/** The floating header shell and the footer panel. */
export const FRAME = {
  capsule: "#f3f4f6",
  /** The desktop header height (implementation brief: 48 CSS pixels). */
  headerHeight: "48px",
  headerTop: "16px",
  panel: "#f1f2f3",
  panelRadius: "28px",
  panelShadow: "0 1px 2px oklch(0.2 0.01 250 / 0.04), 0 18px 40px -18px oklch(0.2 0.01 250 / 0.2)",
  /** Corner radii; `corner-shape: squircle` makes them continuous where supported. */
  radius: "18px",
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
