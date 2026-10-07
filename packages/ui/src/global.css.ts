import { globalStyle } from "@vanilla-extract/css"

import { color, font } from "./theme.css.ts"

// The base every site shares: box sizing, the sans as body face, the canvas
// background, Elena Regular for headings, and quiet defaults for images and links.
globalStyle("*, *::before, *::after", { boxSizing: "border-box" })
globalStyle("html", {
  MozOsxFontSmoothing: "grayscale",
  scrollPaddingTop: "96px",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
})
globalStyle("body", {
  backgroundColor: color.canvas,
  color: color.ink,
  fontFamily: font.sans,
  fontWeight: 400,
  lineHeight: 1.55,
  margin: 0,
})
globalStyle("img", { display: "block", maxWidth: "100%" })
globalStyle("a", { color: "inherit", textDecoration: "none" })
globalStyle("p", { margin: 0 })
globalStyle("h1, h2, h3, h4", {
  fontFamily: font.serif,
  fontKerning: "normal",
  fontWeight: 400,
  letterSpacing: "-0.012em",
  lineHeight: 1.2,
  margin: 0,
  textWrap: "balance",
})
globalStyle(":focus-visible", {
  borderRadius: "4px",
  outline: `2px solid ${color.accent}`,
  outlineOffset: "3px",
})

/** Importing this marker pulls the global base styles into a stylesheet. */
export const GLOBAL_STYLES = "global"
