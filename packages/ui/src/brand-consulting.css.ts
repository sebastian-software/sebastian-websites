import { NEUTRALS, PALETTES } from "@sebastian-websites/tokens"
import { createGlobalTheme } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

export { GLOBAL_STYLES } from "./global.css.ts"

createGlobalTheme(":root", color, { ...PALETTES.consulting.roles, ...NEUTRALS.consulting })
