import { describe, expect, it } from "vitest"

import { evaluateCss } from "./evaluateCss.ts"
import { em, ROOT_FONT_SIZE, ROOT_MAX_SCALE, scaled, scaledBetween } from "./root.ts"

/**
 * A length in CSS pixels at a short viewport side, with the fluid root applied.
 *
 * @param css - The length.
 * @param size - The shorter viewport side in CSS pixels.
 * @returns The length in CSS pixels.
 */
function at(css: string, size: number): number {
  return evaluateCss(css, size, evaluateCss(ROOT_FONT_SIZE, size))
}

describe("root font size", () => {
  it.each([
    [320, 16],
    [360, 16],
    [400, 17],
    [440, 18],
    [820, 18],
    [1024, 18],
    [1152, 19],
    [1280, 20],
    [2160, 20],
  ])("follows the shorter viewport side (%i px → %i px)", (size, expected) => {
    expect(evaluateCss(ROOT_FONT_SIZE, size)).toBeCloseTo(expected, 2)
  })

  it("never exceeds the desktop design by more than its largest scale", () => {
    expect(ROOT_MAX_SCALE).toBeCloseTo(20 / 18, 6)
  })
})

describe("scaled", () => {
  it("renders the desktop design exactly at an 18 px root", () => {
    expect(scaled("36px")).toBe("2rem")
    expect(at(scaled("24px"), 1024)).toBeCloseTo(24, 2)
    expect(at(scaled("24px"), 1280)).toBeCloseTo(24 * (20 / 18), 2)
  })

  it("joins several lengths and keeps zero unitless", () => {
    expect(scaled("0 27px")).toBe("0 1.5rem")
  })
})

describe("scaledBetween", () => {
  const display = scaledBetween("34px", "52px")

  it.each([
    [360, (34 / 17) * 16],
    [400, 34],
    [1024, 52],
    [1280, 52 * (20 / 18)],
  ])("renders both designs exactly and scales beyond (%i px)", (size, expected) => {
    expect(at(display, size)).toBeCloseTo(expected, 2)
  })

  it("interpolates between the designs", () => {
    const middle = at(display, 712)
    expect(middle).toBeGreaterThan(34)
    expect(middle).toBeLessThan(52)
  })

  it("follows the layout width while the root follows the shorter side", () => {
    const laptop = { cqi: 1440, svmin: 900, vw: 1440 }
    const root = evaluateCss(ROOT_FONT_SIZE, laptop)
    expect(root).toBeCloseTo(18, 2)
    expect(evaluateCss(display, laptop, root)).toBeCloseTo(52, 2)
  })

  it("handles lengths that shrink toward the desktop design", () => {
    expect(at(scaledBetween("20px", "18px"), 400)).toBeCloseTo(20, 2)
    expect(at(scaledBetween("20px", "18px"), 1024)).toBeCloseTo(18, 2)
  })

  it("collapses to plain rem when both designs share the ratio", () => {
    expect(scaledBetween("17px", "18px")).toBe("1rem")
  })
})

describe("em", () => {
  it("converts breakpoints against the default font size", () => {
    expect(em("1023px")).toBe("63.9375em")
  })
})

describe("design lengths", () => {
  it("pass keywords through and reject other units", () => {
    expect(scaled("0 auto")).toBe("0 auto")
    expect(scaled("1.5rem")).toBe("1.5rem")
    // @ts-expect-error -- a rem length is not a design length
    expect(() => scaledBetween("1rem", "18px")).toThrow(TypeError)
  })
})
