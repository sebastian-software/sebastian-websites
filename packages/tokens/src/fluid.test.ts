import { describe, expect, it } from "vitest"

import { evaluateCss as evaluate } from "./evaluateCss.ts"
import { fluid, type FluidStop } from "./fluid.ts"

const BASE: readonly FluidStop[] = [
  [360, 16],
  [440, 18],
  [1024, 20],
  [1280, 22],
]

describe("fluid", () => {
  it("matches Utopia's calculator for two stops", () => {
    expect(
      fluid(
        [
          [320, 16],
          [480, 20],
        ],
        { unit: "vw" }
      )
    ).toBe("clamp(1rem, 0.5rem + 2.5vw, 1.25rem)")
    expect(
      fluid(
        [
          [320, 16],
          [480, 40],
        ],
        { unit: "vw" }
      )
    ).toBe("clamp(1rem, -2rem + 15vw, 2.5rem)")
    expect(
      fluid(
        [
          [960, 16],
          [1920, 24],
        ],
        { unit: "vw" }
      )
    ).toBe("clamp(1rem, 0.5rem + 0.8333vw, 1.5rem)")
  })

  it("grows with the shorter viewport side by default", () => {
    expect(
      fluid([
        [360, 16],
        [440, 18],
      ])
    ).toBe("clamp(1rem, 0.4375rem + 2.5svmin, 1.125rem)")
  })

  it.each([
    [320, 16],
    [360, 16],
    [400, 17],
    [440, 18],
    [732, 19],
    [1024, 20],
    [1152, 21],
    [1280, 22],
    [2560, 22],
  ])("passes through every stop and holds beyond them (%i px → %i px)", (size, expected) => {
    expect(evaluate(fluid(BASE), size)).toBeCloseTo(expected, 2)
  })

  it("adds one clamped ramp per changing segment", () => {
    expect(
      fluid([
        [360, 16],
        [440, 18],
        [1024, 18],
        [1280, 20],
      ])
    ).toBe(
      "calc(1rem + clamp(0rem, -0.5625rem + 2.5svmin, 0.125rem) + clamp(0rem, -0.5rem + 0.7813svmin, 0.125rem))"
    )
  })

  it("follows segments that shrink", () => {
    const stops: readonly FluidStop[] = [
      [400, 40],
      [800, 24],
      [1200, 32],
    ]
    for (const [size, expected] of [
      [300, 40],
      [600, 32],
      [800, 24],
      [1000, 28],
      [1600, 32],
    ] as const) {
      expect(evaluate(fluid(stops, { unit: "cqi" }), size)).toBeCloseTo(expected, 2)
    }
    expect(
      fluid(
        [
          [400, 24],
          [800, 16],
        ],
        { unit: "vw" }
      )
    ).toBe("clamp(1rem, 2rem - 2vw, 1.5rem)")
  })

  it("rounds to a grid", () => {
    const css = fluid(
      [
        [360, 16],
        [440, 18],
      ],
      { grid: 1 }
    )
    expect(css).toBe("round(nearest, clamp(1rem, 0.4375rem + 2.5svmin, 1.125rem), 1px)")
    expect(evaluate(css, 402)).toBe(17)
    expect(evaluate(css, 421)).toBe(18)
  })

  it("scales values and stops with the default font size", () => {
    expect(evaluate(fluid(BASE), 400 * 1.25, 20)).toBeCloseTo(17 * 1.25, 2)
  })

  it("collapses constant values to a plain length", () => {
    expect(
      fluid([
        [360, 18],
        [1280, 18],
      ])
    ).toBe("1.125rem")
    expect(
      fluid([
        [360, 18],
        [800, 18],
        [1280, 18],
      ])
    ).toBe("1.125rem")
  })

  it("rejects unusable stops", () => {
    expect(() => fluid([[360, 16]])).toThrow(RangeError)
    expect(() =>
      fluid([
        [440, 16],
        [360, 18],
      ])
    ).toThrow(RangeError)
    expect(() =>
      fluid([
        [360, 16],
        [360, 18],
      ])
    ).toThrow(RangeError)
    expect(() =>
      fluid([
        [360, Number.NaN],
        [440, 18],
      ])
    ).toThrow(RangeError)
  })
})
