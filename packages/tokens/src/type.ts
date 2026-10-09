import { remBetween } from "./root.ts"

/**
 * The steps of the type scale: step 0 is body text, negative steps are
 * captions and labels, positive steps leads and headings.
 */
export const TYPE_STEPS = ["-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7"] as const

export type TypeStepName = (typeof TYPE_STEPS)[number]

/**
 * The ratio between body text and the step above it, at the viewport widths
 * of the phone and the desktop design. A wider layout gets more contrast
 * between text and headings.
 */
const BASE_RATIO = {
  desktop: { at: 960, ratio: 1.2 },
  phone: { at: 400, ratio: 1.125 },
} as const

/**
 * How much the ratio grows from one step to the next. Steps below body text
 * shrink less than a constant ratio would, so labels stay readable, and
 * display sizes grow more, so they stand apart: an ease-in along the scale.
 */
const RATIO_GROWTH = 1.015

/**
 * The size of a step relative to body text: `ratio^n · growth^(n·(n−1)/2)`,
 * so the ratio between step n and n + 1 is `ratio · growth^n`.
 *
 * @param ratio - The ratio between body text and step 1.
 * @param step - The step number: 0 for body text, negative below it.
 * @returns The size as a multiple of body text.
 */
export function typeStepRatio(ratio: number, step: number): number {
  return ratio ** step * RATIO_GROWTH ** ((step * (step - 1)) / 2)
}

/**
 * The font size of a type scale step. Body text is the root; the scale's
 * ratio follows the layout width from the phone to the desktop design, and
 * the root adds its own growth on larger screens.
 *
 * @param step - The step, such as `"3"`.
 * @returns The CSS length.
 */
export function typeStep(step: TypeStepName): string {
  const value = Number(step)
  return remBetween(
    { at: BASE_RATIO.phone.at, ratio: typeStepRatio(BASE_RATIO.phone.ratio, value) },
    { at: BASE_RATIO.desktop.at, ratio: typeStepRatio(BASE_RATIO.desktop.ratio, value) }
  )
}
