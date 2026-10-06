import { globalStyle } from "@vanilla-extract/css"

import { color, font } from "./theme.css.ts"

// The base every site shares: box sizing, the sans as body face, the paper
// background, and quiet defaults for images, links, and headings.
globalStyle("*, *::before, *::after", { boxSizing: "border-box" })
globalStyle("html", { WebkitFontSmoothing: "antialiased" })
globalStyle("body", {
  backgroundColor: color.paper,
  color: color.ink,
  fontFamily: font.sans,
  fontWeight: 400,
  lineHeight: 1.55,
  margin: 0,
})
globalStyle("img", { display: "block", maxWidth: "100%" })
globalStyle("a", { color: "inherit", textDecoration: "none" })
globalStyle("p", { margin: 0 })
globalStyle("h1, h2, h3", {
  fontWeight: 300,
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
  margin: 0,
})

/** Importing this marker pulls the global base styles into a stylesheet. */
export const GLOBAL_STYLES = "global"
