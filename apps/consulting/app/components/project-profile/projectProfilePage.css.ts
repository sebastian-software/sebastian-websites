import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

const PAGED_SCREEN = "screen and (min-width: 801px)"
const MOBILE = "screen and (max-width: 800px)"

export const body = style({
  "@media": {
    [MOBILE]: {
      background: "white",
      padding: 0,
    },
    print: {
      background: "none",
      margin: 0,
      padding: 0,
    },
  },
  color: printColors.night,
  fontFamily: printFonts.sans,
})

// Paragraphs avoid orphaned last words. `:where` keeps the rule below any
// component class that sets its own wrapping.
globalStyle(`:where(${body}) p`, { textWrap: "pretty" })

export const availabilityTopRow = style({
  "@media": {
    [MOBILE]: {
      alignItems: "flex-start",
      gridTemplateColumns: "1fr",
    },
  },
  alignItems: "baseline",
  display: "grid",
  gap: "0.35rem 1rem",
  gridTemplateColumns: "minmax(0, 1fr) auto",
})

export const availabilityCapacity = style({
  color: printColors.base,
  fontWeight: 700,
  whiteSpace: "nowrap",
})

export const firstPageSectionGap = style({
  "@media": {
    [PAGED_SCREEN]: {
      marginBottom: "3.25rem",
    },
    print: {
      marginBottom: "3.25rem",
    },
  },
})

export const fullProfileReference = style({
  color: printColors.dark,
  fontSize: "0.72rem",
  fontWeight: 600,
  margin: "0.85rem 0 0",
})

export const recentProductsSection = style({
  "@media": {
    [PAGED_SCREEN]: {
      marginTop: "3rem",
    },
    print: {
      marginTop: "3rem",
    },
  },
})

export const lastPage = style({
  "@media": {
    print: {
      breakAfter: "auto",
    },
  },
})

export const screenOnlyPageMarker = style({
  "@media": {
    print: {
      display: "none",
    },
  },
})

export const closingPageContent = style({
  "@media": {
    [PAGED_SCREEN]: {
      alignItems: "center",
      display: "flex",
      flex: "1 1 auto",
    },
    print: {
      alignItems: "center",
      display: "flex",
      flex: "1 1 auto",
    },
  },
})

globalStyle(`${closingPageContent} [data-profile-final-section]`, {
  "@media": {
    print: {
      marginTop: 0,
    },
    screen: {
      display: "flex",
      marginTop: 0,
    },
    "screen and (max-width: 800px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "1.5rem",
      paddingTop: 0,
    },
  },
})

export const langDe = style({ hyphenateLimitChars: "6 3 3", hyphens: "auto" })
export const langEn = style({ hyphenateLimitChars: "6 3 3", hyphens: "auto" })
