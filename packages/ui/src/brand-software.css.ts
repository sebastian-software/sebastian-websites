import { EDITORIAL_COLORS, NEUTRALS, PALETTES } from "@sebastian-websites/tokens"
import { createGlobalTheme } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

export { GLOBAL_STYLES } from "./global.css.ts"

createGlobalTheme(":root", color, {
  ...PALETTES.software.roles,
  ...NEUTRALS.software,
  ...EDITORIAL_COLORS.software,
})
