import { cssNumber, fluid, type FluidStop } from "./fluid.ts"

/**
 * The fluid root font size, which every rem length follows. It grows with the
 * shorter side of the viewport, a proxy for the device and its reading
 * distance: 16 px on small phones, 17 px at 400 px, 18 px on large phones and
 * through tablets and laptops, then up to 20 px on large monitors. The share of
 * a larger screen that does not go into the root becomes room for content.
 */
const ROOT_POINTS = {
  laptop: { at: 1024, px: 18 },
  largeMonitor: { at: 1280, px: 20 },
  largePhone: { at: 440, px: 18 },
  smallPhone: { at: 360, px: 16 },
} as const

/** The root's stops, ascending by the shorter viewport side. */
export const ROOT_STOPS: readonly FluidStop[] = [
  ROOT_POINTS.smallPhone,
  ROOT_POINTS.largePhone,
  ROOT_POINTS.laptop,
  ROOT_POINTS.largeMonitor,
].map(({ at, px }) => [at, px] as const)

/**
 * Beyond the laptop, the root also needs the width to grow: a tall but narrow
 * window, such as half of a large monitor, keeps the laptop size, and widening
 * a window enlarges the text while making it taller alone does not.
 */
const WIDE_POINTS = {
  laptop: { at: 1280, px: 18 },
  largeMonitor: { at: 2560, px: 20 },
} as const

/** The width stops, ascending by the viewport width. */
export const WIDE_STOPS: readonly FluidStop[] = [WIDE_POINTS.laptop, WIDE_POINTS.largeMonitor].map(
  ({ at, px }) => [at, px] as const
)

/**
 * The root font size as CSS, relative to the reader's default font size: the
 * smaller of the device curve along the shorter side and the width curve, so
 * it grows past the laptop size only in windows that are both tall and wide.
 */
export const ROOT_FONT_SIZE = `min(${fluid(ROOT_STOPS)}, ${fluid(WIDE_STOPS, { unit: "vw" })})`

/**
 * The body size of the desktop design. At this root, which laptops and
 * tablets get, design pixels are CSS pixels.
 */
const DESKTOP_BODY_PX = 18

/** The body size of the phone design, which the root reaches at a 400 px short side. */
const PHONE_BODY_PX = 17

/**
 * The viewport widths of the phone and the desktop design. On phones the root
 * is 17 px at this width; the desktop layout starts at 960 px with an 18 px root.
 */
const PHONE_AT_PX = 400
const DESKTOP_AT_PX = 960

/** The largest root relative to the desktop design, for estimates such as `sizes`. */
export const ROOT_MAX_SCALE = ROOT_POINTS.largeMonitor.px / DESKTOP_BODY_PX

/** A design length written as CSS pixels, such as `"24px"`. */
export type DesignLength = `${number}px`

/**
 * The number of pixels in a design length.
 *
 * @param length - A length such as `"24px"`.
 * @returns Its pixels.
 */
function pixels(length: string): number {
  const value = Number(length.endsWith("px") ? length.slice(0, -"px".length) : Number.NaN)
  if (!Number.isFinite(value)) throw new TypeError(`Expected a pixel length, got "${length}".`)
  return value
}

/**
 * Lengths of the desktop design that grow with the root. One design pixel is a
 * CSS pixel at an 18 px root. Zero and keywords such as `auto` pass through.
 *
 * @param lengths - One or more space-separated lengths, as for `padding`: `"14px 24px"`.
 * @returns The rem lengths.
 */
export function scaled(lengths: string): string {
  return lengths
    .split(" ")
    .map((length) =>
      length.endsWith("px") ? `${cssNumber(pixels(length) / DESKTOP_BODY_PX)}rem` : length
    )
    .join(" ")
}

/**
 * A length that differs between the phone and the desktop design, such as a
 * headline or the space between sections. Its ratio to the root follows the
 * layout width, from the phone design (400 px) to the desktop layout (960 px),
 * so both designs render exactly and everything between is interpolated. The
 * root itself follows the device, so the two combine: readable on every
 * device, proportioned for the room the layout has.
 *
 * @param phoneLength - The length in the phone design, set against a 17 px body.
 * @param desktopLength - The length in the desktop design, set against an 18 px body.
 * @returns The CSS length.
 */
export function scaledBetween(phoneLength: DesignLength, desktopLength: DesignLength): string {
  return remBetween(
    { at: PHONE_AT_PX, ratio: pixels(phoneLength) / PHONE_BODY_PX },
    { at: DESKTOP_AT_PX, ratio: pixels(desktopLength) / DESKTOP_BODY_PX }
  )
}

/** A length as a multiple of the root at a viewport width. */
export type RatioStop = { readonly at: number; readonly ratio: number }

/**
 * A length in rem whose ratio to the root moves linearly along the viewport
 * width between two stops and holds beyond them. The root brings its own
 * growth, so the length grows with both.
 *
 * @param from - The ratio at the narrower width.
 * @param to - The ratio at the wider width.
 * @returns The CSS length.
 */
export function remBetween(from: RatioStop, to: RatioStop): string {
  if (cssNumber(from.ratio) === cssNumber(to.ratio)) return `${cssNumber(to.ratio)}rem`
  // tan(atan2(a, b)) divides two lengths into a plain number: the progress
  // from one stop to the other along the viewport width.
  const progress = `tan(atan2(100vw - ${String(from.at)}px, ${String(to.at - from.at)}px))`
  const rise = to.ratio - from.ratio
  const ratio = `${cssNumber(from.ratio)} ${rise < 0 ? "-" : "+"} ${cssNumber(Math.abs(rise))} * ${progress}`
  return `calc(1rem * clamp(${cssNumber(Math.min(from.ratio, to.ratio))}, ${ratio}, ${cssNumber(Math.max(from.ratio, to.ratio))}))`
}

/** The browser's default font size, against which em media queries resolve. */
const DEFAULT_FONT_PX = 16

/**
 * A breakpoint in em, so media queries follow the reader's default font size
 * rather than the fluid root.
 *
 * @param length - The breakpoint in CSS pixels at a 16 px default, such as `"1023px"`.
 * @returns The em length.
 */
export function em(length: DesignLength): string {
  return `${cssNumber(pixels(length) / DEFAULT_FONT_PX)}em`
}
