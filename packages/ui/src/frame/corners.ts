import type { StyleRule } from "@vanilla-extract/css"

import { scaled } from "@sebastian-websites/tokens"

/** A squircle needs a larger radius to read as the same roundness. */
const SQUIRCLE_SCALE = 1.6

/**
 * Continuous (squircle) exterior corners where the browser supports
 * `corner-shape`, with a smaller circular radius elsewhere.
 *
 * @param radius - The circular fallback radius in design pixels; it grows with the root.
 * @returns Style rules for both cases.
 */
export function continuousCorners(radius: number): StyleRule {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- `corner-shape` is newer than the CSS type definitions; vanilla-extract emits it as is.
  const squircle = { cornerShape: "squircle" } as unknown as StyleRule
  return {
    "@supports": {
      "(corner-shape: squircle)": {
        borderRadius: scaled(`${String(Math.round(radius * SQUIRCLE_SCALE))}px`),
        ...squircle,
      },
    },
    borderRadius: scaled(`${String(radius)}px`),
  }
}
