import { describe, expect, it } from "vitest"

import { evaluateCss } from "./evaluateCss.ts"
import { typeStep, typeStepRatio } from "./type.ts"

/**
 * The ratio from one step to the next on the desktop scale.
 *
 * @param step - The lower step.
 * @returns The ratio to the step above.
 */
function ratio(step: number): number {
  return typeStepRatio(1.2, step + 1) / typeStepRatio(1.2, step)
}

describe("type scale", () => {
  it.each([
    { desktop: 13.1, phone: 14, step: "-2" },
    { desktop: 18, phone: 17, step: "0" },
    { desktop: 26.3, phone: 21.8, step: "2" },
    { desktop: 52, phone: 35.6, step: "5" },
  ] as const)("step $step renders the phone and desktop designs", ({ desktop, phone, step }) => {
    expect(evaluateCss(typeStep(step), 400, 17)).toBeCloseTo(phone, 1)
    expect(evaluateCss(typeStep(step), 960, 18)).toBeCloseTo(desktop, 1)
  })

  it("grows the ratio from step to step", () => {
    expect(ratio(-2)).toBeLessThan(ratio(0))
    expect(ratio(0)).toBeCloseTo(1.2, 6)
    expect(ratio(5)).toBeGreaterThan(ratio(0))
  })

  it("keeps body text at the root", () => {
    expect(typeStep("0")).toBe("1rem")
  })
})
