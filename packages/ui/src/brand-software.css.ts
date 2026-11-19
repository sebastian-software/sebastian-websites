import { EDITORIAL_COLORS, NEUTRALS, PALETTES, scaled } from "@sebastian-websites/tokens"
import { createGlobalTheme, globalStyle } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

export { GLOBAL_STYLES } from "./global.css.ts"

createGlobalTheme(":root", color, {
  ...PALETTES.software.roles,
  ...NEUTRALS.software,
  ...EDITORIAL_COLORS.software,
})

// Anchor targets sit below the sticky navigation and its fade.
globalStyle(":root", { scrollPaddingTop: scaled("120px") })
