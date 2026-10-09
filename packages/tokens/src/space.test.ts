import { describe, expect, it } from "vitest"

import { evaluateCss } from "./evaluateCss.ts"
import { SPACE_PROPERTIES, SPACE_SCALE } from "./space.ts"

/**
 * A space step in CSS pixels.
 *
 * @param layout - The layout class.
 * @param step - The custom property of the step.
 * @param where - Where to measure.
 * @param where.root - The root font size there, in CSS pixels.
 * @param where.width - The viewport width, in CSS pixels.
 * @returns The space in CSS pixels.
 */
function space(
  layout: keyof typeof SPACE_PROPERTIES,
  step: string,
  where: { readonly root: number; readonly width: number }
): number {
  return evaluateCss(SPACE_PROPERTIES[layout][step] ?? "", where.width, where.root)
}

/**
 * A desktop space step on a 1440 px laptop with an 18 px root.
 *
 * @param step - The custom property of the step.
 * @returns The space in CSS pixels.
 */
function laptop(step: string): number {
  return space("desktop", step, { root: 18, width: 1440 })
}

describe("space scale", () => {
  it.each([
    { expected: 16, layout: "mobile", root: 16, width: 360 },
    { expected: 24, layout: "mobile", root: 18, width: 959 },
    { expected: 16, layout: "desktop", root: 18, width: 960 },
    { expected: 28, layout: "desktop", root: 19, width: 1920 },
  ] as const)(
    "starts tight and grows across the $layout range ($width px → $expected px)",
    ({ expected, layout, root, width }) => {
      expect(space(layout, "--space-s", { root, width })).toBeCloseTo(expected, 2)
    }
  )

  it("keeps every step a multiple of the base", () => {
    expect(laptop("--space-l")).toBeCloseTo(2 * laptop("--space-s"), 2)
    expect(laptop("--space-3xl")).toBeCloseTo(6 * laptop("--space-s"), 2)
  })

  it("follows the root beyond its range", () => {
    expect(space("desktop", "--space-s", { root: 20, width: 2560 })).toBeCloseTo((28 / 19) * 20, 2)
  })

  it("refers to the steps through custom properties", () => {
    expect(SPACE_SCALE.m).toBe("var(--space-m)")
  })
})
