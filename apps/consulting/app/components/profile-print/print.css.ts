import { globalStyle, style } from "@vanilla-extract/css"

import { printColors, printFonts } from "~/styles/theme.css"

import "./printPageMargin.css"

const borderBox = "border-box"

// ─── Document wrapper ───────────────────────────────────────
// On screen the sheet zooms to the width of the site header
// (profile-screen/stage.css.ts); `zoom` reflows unlike transform:scale, so the
// pt-based print typography stays untouched. Print keeps 1:1.
export const document = style({
  "@media": {
    print: {
      // WebKit lays narrow print documents out against a legacy 1.25x minimum
      // width and then scales them to the paper. An explicit physical content
      // width keeps Safari on the same 96px/72pt mapping as other browsers.
      boxSizing: borderBox,
      maxWidth: "none",
      width: "160mm",
    },
    screen: {
      // Layered paper shadow: a hairline ring plus three soft falloffs make
      // the sheet read as a physical page lifted off the page canvas.
      boxShadow: `0 0 0 1px oklch(0.15 0.05 2 / 0.05), 0 2px 4px oklch(0.15 0.05 2 / 0.1), 0 12px 28px oklch(0.15 0.05 2 / 0.13), 0 32px 64px oklch(0.15 0.05 2 / 0.13)`,
      width: "fit-content",
    },
    "screen and (max-width: 800px)": {
      boxShadow: "none",
    },
  },
  position: "relative",
})

// ─── A4 Page Container ──────────────────────────────────────
// Screen: 25mm margins all sides for optimal A4 layout
// Print: @page handles margins
export const page = style({
  "@media": {
    print: {
      boxShadow: "none",
      // Safari cannot reliably fragment a multi-page flex column. That evidence
      // is about block-level normal flow versus flex layout, and `flow-root` stays
      // on the block-level side of it; only Chromium prints from CI, so the
      // `flow-root` variant itself is unverified in WebKit.
      // The block formatting context it adds keeps the last block's bottom
      // margin inside the white sheet instead of letting it collapse out
      // through this edge into the seam below.
      display: "flow-root",
      margin: 0,
      minHeight: "auto",
      padding: 0,
      width: "auto",
    },
    screen: {
      boxShadow: "none",
      marginBottom: 0,
      minHeight: "auto",
    },
    "screen and (max-width: 800px)": {
      minHeight: "auto",
      padding: "1.5rem 1.25rem",
      width: "100%",
    },
  },
  background: "white",
  boxSizing: borderBox,
  color: printColors.night,
  display: "flex",
  flexDirection: "column",
  fontFamily: printFonts.sans,
  fontSize: "11pt",
  fontWeight: 400,
  lineHeight: 1.4,
  margin: "0 auto",
  minHeight: "297mm",
  MozOsxFontSmoothing: "grayscale",
  padding: "25mm",
  WebkitFontSmoothing: "antialiased",
  width: "210mm",
})

// First page - no forced break, content flows naturally
export const pageFirst = style({})

export const pageFlow = style({
  "@media": {
    print: {
      // Keep paged-media fragmentation in normal block flow. WebKit may
      // otherwise overlap later sections with a fragmented flex child; as on
      // `page`, that evidence is block-versus-flex and `flow-root` stays
      // block-level.
      // `flow-root` adds the same block formatting context as on `page`. No
      // margin escapes this box today, so it is a symmetric guard rather than
      // a fix — it keeps a later margin from silently leaking between sheets.
      display: "flow-root",
      padding: 0,
    },
    screen: {
      boxSizing: borderBox,
      margin: "0 auto",
      padding: "0 25mm 25mm 25mm",
      width: "210mm",
    },
    "screen and (max-width: 800px)": {
      padding: "0 1.25rem 1.5rem 1.25rem",
      width: "100%",
    },
  },
  // The flow spans every page after the profile introduction. Keeping its
  // paper color explicit prevents Chromium from painting the transparent
  // fragmented box with the site's pale canvas color during PDF export.
  background: "white",
  color: printColors.night,
  display: "flex",
  flexDirection: "column",
  fontFamily: printFonts.sans,
  fontSize: "11pt",
  fontWeight: 400,
  lineHeight: 1.4,
})

// ─── Global styles for print body ───────────────────────────
export const printBody = style({
  "@media": {
    print: {
      background: "none",
      margin: 0,
      padding: 0,
    },
    // Phones show the sheet as a plain white page; wider screens set it on
    // the site canvas (profile-screen/stage.css.ts).
    "screen and (max-width: 800px)": {
      background: "white",
      padding: 0,
    },
  },
})

// Paragraphs avoid orphaned last words. `:where` keeps the rule below any
// component class that sets its own wrapping.
globalStyle(`:where(${printBody}) p`, { textWrap: "pretty" })

export const link = style({
  "@media": {
    "screen and (max-width: 800px)": {
      alignItems: "center",
      display: "inline-flex",
      minHeight: "2.75rem",
    },
  },
  color: printColors.base,
  selectors: {
    "&:hover": {
      textDecoration: "underline",
      textUnderlineOffset: "2px",
    },
  },
  textDecoration: "none",
})

// ─── Language-specific styles ───────────────────────────────
// hyphenate-limit-chars avoids ugly two-letter breaks ("Sour-ce") in the
// narrow column next to the photo; Chromium ≥109 honors it, others ignore it.
export const langDe = style({
  hyphenateLimitChars: "6 3 3",
  hyphens: "auto",
})

export const langEn = style({
  hyphenateLimitChars: "6 3 3",
  hyphens: "auto",
})

// Apply quotes via global styles
globalStyle(`${langDe} q`, {
  quotes: "'\\201E' '\\201C' '\\201A' '\\2018'",
})

globalStyle(`${langEn} q`, {
  quotes: "'\\201C' '\\201D' '\\2018' '\\2019'",
})

// The sheet is set in rem against the reader's default size and zooms on its
// own; the fluid root of the editorial pages would change it on screen.
globalStyle(`html:has(${document})`, { fontSize: "100%" })
