import { style } from "@vanilla-extract/css"

import { variables } from "~/styles/theme.css"

// ─── Mobile booking bar ─────────────────────────────────────
// Same pattern as the home MobileBookingBar, but for the profile pages:
// visible below the rail breakpoint's little sibling (900px, where the header
// booking CTA disappears) and stepping aside while the closing CTA is on screen.
export const mobileBar = style({
  "@media": {
    "(min-width: 900px)": {
      display: "none",
    },
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
    print: {
      display: "none",
    },
  },
  "@supports": {
    "(backdrop-filter: blur(12px))": {
      backgroundColor: "oklch(100% 0 0 / 80%)",
    },
  },
  alignItems: "center",
  backdropFilter: "blur(12px)",
  backgroundColor: "oklch(100% 0 0 / 92%)",
  borderTop: `1px solid ${variables.color.border}`,
  bottom: 0,
  columnGap: variables.space.md,
  display: "flex",
  insetInline: 0,
  justifyContent: "space-between",
  paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
  paddingInline: "1.25rem",
  paddingTop: "0.75rem",
  position: "fixed",
  transform: "translateY(110%)",
  transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.35s",
  visibility: "hidden",
  zIndex: 39,
})

export const mobileBarVisible = style({
  transform: "translateY(0)",
  visibility: "visible",
})

export const mobileBarLink = style({
  ":focus-visible": {
    color: variables.color.vivid,
  },
  color: variables.color.dark,
  fontSize: "0.9375rem",
  fontWeight: variables.fontWeight.medium,
  textDecoration: "none",
  whiteSpace: "nowrap",
})
