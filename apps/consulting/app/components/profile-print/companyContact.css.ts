import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

// ─── Company Contact Section ─────────────────────────────────
// Print-only: register court, VAT id and build date are mandatory PDF content
// but a conversion-dead ending in the browser — there the screen-only closing
// CTA section takes over.
export const companyContact = style({
  "@media": {
    print: {
      breakInside: "avoid",
    },
    screen: {
      display: "none",
    },
  },
  alignItems: "flex-start",
  breakInside: "avoid",
  display: "flex",
  gap: "2.5rem",
  justifyContent: "center",
  marginTop: "auto",
  paddingTop: "3rem",
})

// The consultant profile ends with a compact colophon below a hairline, so it
// can share the last page with the archive instead of opening a page of its own.
export const companyContactColophon = style({
  borderTop: "0.5pt solid oklch(0.82 0.008 75)",
  gap: "8mm",
  justifyContent: "flex-start",
  marginTop: "9mm",
  paddingTop: "6mm",
})

export const companyContactLogo = style({
  "@media": {
    "screen and (max-width: 800px)": {
      width: "140pt",
    },
  },
  flexShrink: 0,
  height: "auto",
  width: "180pt",
})

export const companyContactLogoColophon = style({
  width: "100pt",
})

export const companyContactDetails = style({
  color: printColors.night,
  fontSize: "0.85rem",
  lineHeight: 1.6,
})

export const companyContactName = style({
  color: printColors.base,
  fontFamily: printFonts.slab,
  fontSize: "1rem",
  fontWeight: 500,
  marginBottom: "0.75rem",
  marginTop: "0.875rem",
})

export const companyContactAddress = style({
  marginBottom: "0.5rem",
})

export const companyContactInfo = style({
  color: printColors.dark,
  fontSize: "0.75rem",
  marginBottom: "0.75rem",
})

export const companyContactLinks = style({
  fontSize: "0.85rem",
})

export const companyContactCopyright = style({
  color: printColors.dark,
  fontSize: "0.7rem",
  marginTop: "1rem",
})

// Two text columns keep the colophon short enough to share the last page.
globalStyle(`${companyContactColophon} ${companyContactDetails}`, {
  columnGap: "8mm",
  columns: 2,
  flex: 1,
  lineHeight: 1.45,
})

globalStyle(`${companyContactColophon} ${companyContactDetails} p`, {
  breakInside: "avoid",
})

globalStyle(`${companyContactColophon} ${companyContactName}`, {
  marginTop: 0,
})

globalStyle(`${companyContactColophon} ${companyContactCopyright}`, {
  marginTop: "0.5rem",
})
