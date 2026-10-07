import { color, font } from "@sebastian-websites/ui"

// Tokens of the profile documents. They keep the values of the
// sebastian-consulting.de print layout so the screen view and the PDFs stay
// unchanged inside the new frame; the brand roles resolve to the same Consulting
// palette.

const HUE = 2

// Heading metrics from the former Consulting base styles, which the print sheets
// were tuned against; the shared base sets looser values for site headings.
export const printHeadingMetrics = { letterSpacing: "-0.02em", lineHeight: 1.15 } as const

export const printFonts = {
  sans: font.sans,
  slab: font.serif,
}

export const printColors = {
  base: color.base,
  bright: color.bright,
  dark: color.dark,
  night: color.night,
  pale: "oklch(0.92 0.005 2)",
  paper: color.paper,
  tagBackground: "oklch(0.95 0.01 6)",
  vivid: color.vivid,
}

export const variables = {
  color: {
    base: color.base,
    border: `oklch(0.88 0.02 ${HUE})`,
    dark: color.dark,
    mutedForeground: color.base,
    vivid: color.vivid,
  },
  font: {
    body: font.sans,
    heading: font.serif,
  },
  fontWeight: {
    medium: "500",
    semibold: "600",
  },
  space: {
    md: "1rem",
  },
}
