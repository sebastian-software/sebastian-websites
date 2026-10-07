import { EDITORIAL_COLORS, NEUTRALS, PALETTES } from "@sebastian-websites/tokens"
import { createGlobalTheme, globalStyle } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

export { GLOBAL_STYLES } from "./global.css.ts"

createGlobalTheme(":root", color, {
  ...PALETTES.consulting.roles,
  ...NEUTRALS.consulting,
  ...EDITORIAL_COLORS.consulting,
})

// A faint fibre grain gives the neutral Consulting paper its texture; it stays
// achromatic so the berry accent remains the only warm color on the page.
const PAPER_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.32 0 0 0 0 0.3 0 0 0 0.55 0"/></filter><rect width="240" height="240" filter="url(#g)" opacity="0.18"/></svg>'
)}")`

globalStyle("body", { backgroundImage: PAPER_GRAIN })
