import { em, remBetween } from "./root.ts"

/**
 * The space scale after Utopia (utopia.fyi): every step is a multiple of the
 * base space `s`.
 */
export const SPACE_STEPS = {
  "2xl": 4,
  "2xs": 0.5,
  "3xl": 6,
  "3xs": 0.25,
  "4xl": 8,
  l: 2,
  m: 1.5,
  s: 1,
  xl: 3,
  xs: 0.75,
} as const

export type SpaceStep = keyof typeof SPACE_STEPS

/** The base space `s` at a viewport width, with the root the type has there. */
type SpacePoint = { readonly at: number; readonly root: number; readonly s: number }

/** A layout class: the widths it covers and how far its base space grows. */
type SpaceRange = { readonly from: SpacePoint; readonly to: SpacePoint }

/**
 * Space takes the width the type leaves over, separately for each layout
 * class. Both classes start tight at 16 px and grow across their own range:
 * the stacked mobile layout up to 959 px, the column layout from 960 px, where
 * the columns first need the room. Beyond a range, space follows the root.
 */
export const SPACE_RANGES = {
  desktop: { from: { at: 960, root: 18, s: 16 }, to: { at: 1920, root: 19, s: 28 } },
  mobile: { from: { at: 360, root: 16, s: 16 }, to: { at: 959, root: 18, s: 24 } },
} as const satisfies Readonly<Record<string, SpaceRange>>

/** The first width of the column layout; below it, the mobile space range applies. */
export const LAYOUT_SPLIT = em("960px")

/**
 * One value per space step.
 *
 * @param value - The value of a step.
 * @returns The values, keyed by step.
 */
function mapSteps<T>(value: (step: SpaceStep) => T): Readonly<Record<SpaceStep, T>> {
  return {
    "2xl": value("2xl"),
    "2xs": value("2xs"),
    "3xl": value("3xl"),
    "3xs": value("3xs"),
    "4xl": value("4xl"),
    l: value("l"),
    m: value("m"),
    s: value("s"),
    xl: value("xl"),
    xs: value("xs"),
  }
}

/**
 * The custom property of a space step.
 *
 * @param step - The step, such as `m`.
 * @returns Its custom property name.
 */
function property(step: SpaceStep): string {
  return `--space-${step}`
}

/**
 * The space steps as CSS, to use in styles. Their values depend on the layout
 * class and are set on the root by the global styles (`SPACE_PROPERTIES`).
 */
export const SPACE_SCALE = mapSteps((step) => `var(${property(step)})`)

/**
 * The values of every space step for one layout class.
 *
 * @param range - The layout class.
 * @returns Custom property names and their values.
 */
function spaceProperties(range: SpaceRange): Readonly<Record<string, string>> {
  const values = mapSteps((step) =>
    remBetween(
      { at: range.from.at, ratio: (SPACE_STEPS[step] * range.from.s) / range.from.root },
      { at: range.to.at, ratio: (SPACE_STEPS[step] * range.to.s) / range.to.root }
    )
  )
  return Object.fromEntries(
    Object.entries(values).map(([step, value]) => [`--space-${step}`, value])
  )
}

/** The custom properties of the space scale for both layout classes. */
export const SPACE_PROPERTIES = {
  desktop: spaceProperties(SPACE_RANGES.desktop),
  mobile: spaceProperties(SPACE_RANGES.mobile),
} as const
