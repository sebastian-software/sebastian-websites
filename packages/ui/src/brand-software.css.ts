import { PALETTES } from "@sebastian-websites/tokens"
import { createGlobalTheme } from "@vanilla-extract/css"

import { color } from "./theme.css.ts"

createGlobalTheme(":root", color, PALETTES.software.roles)
