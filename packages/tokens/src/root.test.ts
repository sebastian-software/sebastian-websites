import { describe, expect, it } from "vitest"

import { evaluateCss } from "./evaluateCss.ts"
import { em, ROOT_FONT_SIZE, ROOT_MAX_SCALE, scaled, scaledBetween } from "./root.ts"

/**
 * A viewport for the evaluator.
 *
 * @param width - The viewport width in CSS pixels.
 * @param height - The viewport height in CSS pixels.
 * @returns The size each fluid unit follows.
 */
function viewport(width: number, height: number): { cqi: number; svmin: number; vw: number } {
  return { cqi: width, svmin: Math.min(width, height), vw: width }
}

/**
 * The root font size of a viewport.
 *
 * @param width - The viewport width in CSS pixels.
 * @param height - The viewport height in CSS pixels.
 * @returns The root font size in CSS pixels.
 */
function rootAt(width: number, height: number): number {
  return evaluateCss(ROOT_FONT_SIZE, viewport(width, height))
}

/**
 * A length in CSS pixels on a square viewport, with the fluid root applied.
 *
 * @param css - The length.
 * @param size - The viewport side in CSS pixels.
 * @returns The length in CSS pixels.
 */
function at(css: string, size: number): number {
  return evaluateCss(css, size, evaluateCss(ROOT_FONT_SIZE, size))
}

describe("root font size", () => {
  it.each([
    { expected: 16, height: 780, name: "small phone", width: 360 },
    { expected: 17, height: 870, name: "iPhone", width: 400 },
    { expected: 18, height: 956, name: "large phone", width: 440 },
    { expected: 17, height: 400, name: "phone in landscape", width: 900 },
    { expected: 18, height: 1180, name: "tablet", width: 820 },
    { expected: 18, height: 900, name: "laptop", width: 1440 },
    { expected: 18, height: 1300, name: "half of a large monitor", width: 1280 },
    { expected: 20, height: 1300, name: "large monitor", width: 2560 },
    { expected: 18, height: 960, name: "1920 × 1080 desktop", width: 1920 },
  ])("fits a $name ($width × $height → $expected px)", ({ expected, height, width }) => {
    expect(rootAt(width, height)).toBeCloseTo(expected, 1)
  })

  it("grows when a tall window widens, not when a wide window grows taller", () => {
    expect(rootAt(1920, 1300)).toBeGreaterThan(rootAt(1440, 1300))
    expect(rootAt(1440, 1300)).toBeCloseTo(rootAt(1440, 1024), 0)
  })

  it("never exceeds the desktop design by more than its largest scale", () => {
    expect(ROOT_MAX_SCALE).toBeCloseTo(20 / 18, 6)
  })
})

describe("scaled", () => {
  it("renders the desktop design exactly at an 18 px root", () => {
    expect(scaled("36px")).toBe("2rem")
    expect(at(scaled("24px"), 1024)).toBeCloseTo(24, 2)
    expect(at(scaled("24px"), 2560)).toBeCloseTo(24 * (20 / 18), 2)
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
    [2560, 52 * (20 / 18)],
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
