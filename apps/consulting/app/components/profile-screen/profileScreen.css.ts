import { style } from "@vanilla-extract/css"

import { printColors, variables } from "~/styles/theme.css"

// Screen-only chrome around the printable A4 sheet: the two-column shell,
// the sticky info rail, the closing CTA section and the mobile booking bar.
// Everything in this file is invisible in print — the sheet stays the single
// source for the PDF/print output.

// Rail and sheet sit side by side from RAIL_UP; in the RAIL_DOWN band the
// rail's modules form a grid under the sheet; on PHONE they stack single
// column. The three queries are disjoint so cascade order never matters.
// 794px sheet + 19rem rail + gaps ≈ 1240px.
const RAIL_UP = "screen and (min-width: 1240px)"
const RAIL_DOWN = "screen and (min-width: 801px) and (max-width: 1239px)"
const PHONE = "screen and (max-width: 800px)"

// Shared small-copy size for the rail modules (13px).
const FONT_SMALL = "0.8125rem"
const INLINE_FLEX = "inline-flex"

// ─── Two-column shell ───────────────────────────────────────
export const layoutShell = style({
  "@media": {
    [RAIL_UP]: {
      alignItems: "flex-start",
      display: "flex",
      gap: "clamp(2.5rem, 3.5vw, 4rem)",
      justifyContent: "center",
    },
  },
})

// ─── Info rail ──────────────────────────────────────────────
export const rail = style({
  "@media": {
    [PHONE]: {
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "1fr",
      margin: "2.5rem auto 0",
      padding: "0 1.25rem 0.5rem",
    },
    print: {
      display: "none",
    },
    [RAIL_DOWN]: {
      display: "grid",
      gap: "1.5rem 2rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
      margin: "2.5rem auto 0",
      maxWidth: "210mm",
    },
    [RAIL_UP]: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      gap: "2rem",
      position: "sticky",
      // Header (4rem) plus breathing room.
      top: "5.5rem",
      width: "19rem",
    },
  },
  fontFamily: variables.font.body,
})

export const railModule = style({
  borderTop: `1px solid ${variables.color.border}`,
  paddingTop: "1rem",
})

// The booking module leads the rail; below the rail breakpoint the header CTA,
// the closing section and the mobile bar already carry the booking path.
export const railBooking = style({
  "@media": {
    [PHONE]: {
      display: "none",
    },
    [RAIL_DOWN]: {
      display: "none",
    },
  },
})

export const railHeading = style({
  color: variables.color.dark,
  fontFamily: variables.font.heading,
  fontSize: "1rem",
  fontWeight: variables.fontWeight.medium,
  margin: "0 0 0.5rem",
})

export const railText = style({
  color: variables.color.mutedForeground,
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: "0 0 0.9rem",
})

export const railBookingButton = style({
  width: "100%",
})

// ─── PDF module ─────────────────────────────────────────────
// Same quiet register as the other rail modules; the booking CTA stays the
// only loud element in the rail.
export const railPdfActions = style({
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
})

// Quiet secondary action under the PDF button (browser print as fallback path)
export const railPrintLink = style({
  ":focus-visible": {
    color: variables.color.vivid,
  },
  "@media": {
    "(hover: hover) and (pointer: fine)": {
      ":hover": {
        color: variables.color.vivid,
      },
    },
  },
  alignItems: "center",
  appearance: "none",
  background: "none",
  border: 0,
  color: variables.color.mutedForeground,
  cursor: "pointer",
  display: INLINE_FLEX,
  fontSize: FONT_SMALL,
  minHeight: "2.25rem",
  padding: 0,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
})

export const railPdfStand = style({
  color: variables.color.mutedForeground,
  fontSize: "0.75rem",
  margin: "0.6rem 0 0",
})

// ─── Other consultant module ────────────────────────────────
export const railOtherLink = style({
  alignItems: "center",
  color: "inherit",
  display: "flex",
  gap: "0.9rem",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${variables.color.vivid}`,
      outlineOffset: "3px",
    },
  },
  textDecoration: "none",
})

export const railOtherPhoto = style({
  border: `1.5pt solid ${printColors.base}`,
  flexShrink: 0,
  height: "4.5rem",
  objectFit: "cover",
  width: "3.5rem",
})

export const railOtherText = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
})

export const railOtherName = style({
  "@media": {
    "(hover: hover) and (pointer: fine)": {
      selectors: {
        [`${railOtherLink}:hover &`]: {
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
      },
    },
  },
  color: variables.color.base,
  fontFamily: variables.font.heading,
  fontSize: "1rem",
  fontWeight: variables.fontWeight.medium,
})

export const railOtherFocus = style({
  color: variables.color.mutedForeground,
  fontSize: FONT_SMALL,
  lineHeight: 1.4,
})

// ─── Home link ──────────────────────────────────────────────
export const railHomeLink = style({
  ":focus-visible": {
    textDecoration: "underline",
  },
  "@media": {
    "(hover: hover) and (pointer: fine)": {
      ":hover": {
        color: variables.color.vivid,
        textDecoration: "underline",
      },
    },
  },
  alignItems: "center",
  color: variables.color.mutedForeground,
  display: INLINE_FLEX,
  fontSize: "0.875rem",
  fontWeight: variables.fontWeight.medium,
  gap: "0.4rem",
  minHeight: "2.75rem",
  textDecoration: "none",
  textUnderlineOffset: "3px",
})

// ─── Closing CTA section ────────────────────────────────────
export const outro = style({
  "@media": {
    [PHONE]: {
      padding: "3.5rem 1.5rem 4.5rem",
    },
    print: {
      display: "none",
    },
  },
  margin: "0 auto",
  maxWidth: "38rem",
  padding: "5rem 1.5rem 6rem",
  textAlign: "center",
})

export const outroHeading = style({
  color: variables.color.dark,
  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
  marginBottom: "0.75rem",
})

export const outroText = style({
  color: variables.color.mutedForeground,
  fontSize: "1.0625rem",
  lineHeight: 1.6,
  marginBottom: "1.75rem",
})

export const outroSecondary = style({
  color: variables.color.mutedForeground,
  fontSize: "0.9375rem",
  lineHeight: 1.6,
  marginTop: "1.75rem",
})

export const outroOtherLink = style({
  ":focus-visible": {
    color: variables.color.vivid,
  },
  "@media": {
    "(hover: hover) and (pointer: fine)": {
      ":hover": {
        color: variables.color.vivid,
      },
    },
  },
  color: variables.color.base,
  fontWeight: variables.fontWeight.semibold,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
})
