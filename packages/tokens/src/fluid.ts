/**
 * A point of a fluid value: at this viewport (or container) size in CSS
 * pixels, the value is this many CSS pixels.
 */
export type FluidStop = readonly [at: number, value: number]

/**
 * What a fluid value grows with. `svmin` follows the shorter side of the
 * stable viewport, which tracks the device size and stays put when a device
 * rotates or its browser toolbar collapses. `vw` follows the viewport width,
 * `cqi` the inline size of the nearest size container.
 */
export type FluidUnit = "cqi" | "svmin" | "vw"

export type FluidOptions = {
  /** Rounds the result to this grid in CSS pixels, so the value grows in whole steps. */
  readonly grid?: number
  /** Defaults to `svmin`. */
  readonly unit?: FluidUnit
}

/** The browser's default root font size, against which stops are written. */
const ROOT_PX = 16

/** Four decimals keep every value within a few thousandths of a pixel. */
const DECIMALS = 4

/** One fluid unit is a hundredth of the size it follows. */
const PER_UNIT = 100

/**
 * A number for CSS, rounded to four decimals, without trailing zeros or
 * negative zero.
 *
 * @param value - Any finite number.
 * @returns Its CSS form.
 */
export function cssNumber(value: number): string {
  return String(Number(value.toFixed(DECIMALS)) || 0)
}

/**
 * Converts pixels to rem against the default root font size.
 *
 * @param px - The length in CSS pixels.
 * @returns The rem length.
 */
function rem(px: number): string {
  return `${cssNumber(px / ROOT_PX)}rem`
}

/**
 * The preferred value of a clamp: `intercept ± slope·unit`.
 *
 * @param interceptPx - The value at size zero in CSS pixels.
 * @param slope - Pixels of value per pixel of size.
 * @param unit - The unit the value grows with.
 * @returns The linear expression.
 */
function line(interceptPx: number, slope: number, unit: FluidUnit): string {
  const growth = `${cssNumber(Math.abs(slope) * PER_UNIT)}${unit}`
  return `${rem(interceptPx)} ${slope < 0 ? "-" : "+"} ${growth}`
}

/**
 * Rejects fewer than two stops, non-finite numbers, and sizes out of order.
 *
 * @param stops - The stops to check.
 */
function validate(
  stops: readonly FluidStop[]
): asserts stops is readonly [FluidStop, ...FluidStop[]] {
  if (stops.length < 2) throw new RangeError("A fluid value needs at least two stops.")
  if (stops.some(([at, value]) => !Number.isFinite(at) || !Number.isFinite(value))) {
    throw new RangeError("Fluid stops must be finite.")
  }
  if (stops.slice(1).some(([at], index) => at <= stops[index][0])) {
    throw new RangeError("Fluid stops must be in strictly ascending order.")
  }
}

/**
 * A CSS length that interpolates linearly between stops and holds the first
 * and last value beyond them: Utopia's fluid sizing (utopia.fyi) with any
 * number of stops.
 *
 * Two stops produce Utopia's `clamp(min, intercept + slope, max)`. More stops
 * add one clamped ramp per segment to the first value, so each segment only
 * contributes between its own stops.
 *
 * Values are emitted in rem: a larger default font size scales the value and
 * moves its stops with it, as em-based media queries move. Browser zoom
 * narrows the viewport in CSS pixels and needs no special handling.
 *
 * @param stops - Size and value pairs in CSS pixels, sizes ascending.
 * @param options - The unit to grow with and an optional rounding grid.
 * @returns The CSS length.
 */
export function fluid(stops: readonly FluidStop[], options: FluidOptions = {}): string {
  validate(stops)
  const unit = options.unit ?? "svmin"
  const segments = stops.slice(1).map((to, index) => [stops[index], to] as const)

  let value: string
  if (segments.length === 1) {
    const [[fromAt, fromValue], [toAt, toValue]] = segments[0]
    const slope = (toValue - fromValue) / (toAt - fromAt)
    value =
      slope === 0
        ? rem(fromValue)
        : `clamp(${rem(Math.min(fromValue, toValue))}, ${line(fromValue - slope * fromAt, slope, unit)}, ${rem(Math.max(fromValue, toValue))})`
  } else {
    const ramps = segments.flatMap(([[fromAt, fromValue], [toAt, toValue]]) => {
      const rise = toValue - fromValue
      if (rise === 0) return []
      const slope = rise / (toAt - fromAt)
      return [
        `clamp(${rem(Math.min(0, rise))}, ${line(-slope * fromAt, slope, unit)}, ${rem(Math.max(0, rise))})`,
      ]
    })
    const first = rem(stops[0][1])
    value = ramps.length === 0 ? first : `calc(${[first, ...ramps].join(" + ")})`
  }

  return options.grid === undefined
    ? value
    : `round(nearest, ${value}, ${cssNumber(options.grid)}px)`
}
