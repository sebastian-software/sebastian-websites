/**
 * Test support: evaluates the CSS lengths this package emits.
 */

// Fluid units are hundredths of the size they follow.
const PER_UNIT = 100

// The CSS functions that `fluid()` emits, applied to their numeric arguments.
const FUNCTIONS: ReadonlyMap<string, (values: readonly number[]) => number> = new Map([
  ["atan2", ([y = 0, x = 1]) => Math.atan2(y, x)],
  ["calc", ([value = Number.NaN]) => value],
  ["clamp", ([min = 0, preferred = 0, max = 0]) => Math.max(min, Math.min(preferred, max))],
  ["round", ([value = 0, grid = 1]) => Math.round(value / grid) * grid],
  ["tan", ([angle = 0]) => Math.tan(angle)],
])

/**
 * Evaluates the subset of CSS that `fluid()` emits (calc, clamp, round, tan, atan2, + - *,
 * rem, px, and the fluid units) to CSS pixels.
 *
 * @param css - The emitted length.
 * @param size - The size every fluid unit follows, or one size per unit, in CSS pixels.
 * @param root - The root font size in CSS pixels.
 * @returns The length in CSS pixels.
 */
export function evaluateCss(
  css: string,
  size: number | Readonly<Record<"cqi" | "svmin" | "vw", number>>,
  root = 16
): number {
  const sizes = typeof size === "number" ? { cqi: size, svmin: size, vw: size } : size
  const tokens = css
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .replaceAll(",", " ")
    .split(" ")
    .filter((token) => token !== "" && token !== "(" && token !== "nearest")
  const scales = new Map([
    ["", 1],
    ["cqi", sizes.cqi / PER_UNIT],
    ["px", 1],
    ["rem", root],
    ["svmin", sizes.svmin / PER_UNIT],
    ["vw", sizes.vw / PER_UNIT],
  ])
  let position = 0
  const take = (): string => tokens[position++] ?? ""

  const factor = (): number => {
    const token = take()
    const apply = FUNCTIONS.get(token)
    if (apply !== undefined) {
      const values: number[] = []
      while (tokens[position] !== ")") values.push(expression())
      take()
      return apply(values)
    }
    const unit = [...scales.keys()].find((name) => name !== "" && token.endsWith(name)) ?? ""
    const amount = Number(token.slice(0, token.length - unit.length))
    const scale = scales.get(unit)
    if (Number.isNaN(amount) || scale === undefined) throw new Error(`Unexpected token ${token}`)
    return amount * scale
  }
  const term = (): number => {
    let value = factor()
    while (tokens[position] === "*" && take() === "*") value *= factor()
    return value
  }
  function expression(): number {
    let value = term()
    while (tokens[position] === "+" || tokens[position] === "-") {
      value = take() === "+" ? value + term() : value - term()
    }
    return value
  }

  const result = expression()
  if (position !== tokens.length) throw new Error(`Unparsed rest in ${css}`)
  return result
}
