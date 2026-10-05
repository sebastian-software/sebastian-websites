import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { PALETTES, ROLES } from "./palettes.ts"

const fixture = (brand: string): string =>
  readFileSync(new URL(`fixtures/${brand}.css`, import.meta.url), "utf8")

describe("brand palettes", () => {
  it.each(["software", "consulting"] as const)("matches the brand tokens of %s", (brand) => {
    const css = fixture(brand)
    const palette = PALETTES[brand]
    for (const role of ROLES) {
      const name = palette.names[role].toLowerCase()
      expect(css).toContain(`--${brand}-${name}: ${palette.roles[role]};`)
      expect(css).toContain(`--${brand}-${role}: var(--${brand}-${name});`)
    }
  })
})
