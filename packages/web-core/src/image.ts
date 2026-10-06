/** The canonical hostname is enabled after its DNS and TLS are verified. */
export const ASSET_HOST: Readonly<{
  canonicalOrigin: string
  origin: string
  productionActive: boolean
}> = {
  canonicalOrigin: "https://assets.sebastian-software.com",
  origin: "https://sebastian-websites-assets.b-cdn.net",
  productionActive: false,
} as const

export type ImageSource = {
  readonly height: number
  readonly path: string
  readonly width: number
}

export type ImageOptions = {
  readonly aspectRatio: readonly [number, number]
  /** Focal coordinates relative to the original, from 0 to 1. */
  readonly focus?: readonly [number, number]
  readonly quality?: number
  readonly width: number
  readonly widths?: readonly number[]
}

export type ResponsiveImage = {
  readonly height: number
  readonly src: string
  readonly srcSet: string
  readonly width: number
}

const DEFAULT_QUALITY = 85
const MAX_QUALITY = 100

type Geometry = {
  readonly cropHeight: number
  readonly cropWidth: number
  readonly ratio: number
  readonly widths: readonly number[]
}

function geometry(source: ImageSource, options: ImageOptions): Geometry {
  const [horizontal, vertical] = options.aspectRatio
  const ratio = horizontal / vertical
  if (
    ![horizontal, vertical, source.width, source.height].every(
      (value) => Number.isFinite(value) && value > 0
    )
  ) {
    throw new Error("Image dimensions must be positive")
  }
  const cropWidth = Math.floor(Math.min(source.width, source.height * ratio))
  const cropHeight = Math.floor(cropWidth / ratio)
  const widths = [
    ...new Set(options.widths ?? [Math.round(options.width / 2), options.width, options.width * 2]),
  ].toSorted((a, b) => a - b)
  if (
    widths.some((width) => !Number.isSafeInteger(width) || width <= 0 || width > cropWidth) ||
    !widths.includes(options.width)
  ) {
    throw new Error("Image variants must fit the source crop and include the placement width")
  }
  return { cropHeight, cropWidth, ratio, widths }
}

function assertOptions(source: ImageSource, options: ImageOptions, quality: number): void {
  if (quality < 1 || quality > MAX_QUALITY || !Number.isInteger(quality)) {
    throw new Error("Invalid image quality")
  }
  if (options.focus?.some((point) => !Number.isFinite(point) || point < 0 || point > 1)) {
    throw new Error("Invalid focal coordinates")
  }
  if (source.path.split("/").some((part) => part === "" || part === "." || part === "..")) {
    throw new Error("Image source must be a relative asset path")
  }
}

/**
 * Creates responsive Bunny variants. The focal crop uses the original's largest
 * rectangle at the requested ratio; resizing happens after cropping in Bunny.
 *
 * @param source - Public source path and original pixel dimensions.
 * @param options - Placement width, ratio, focal point, and responsive widths.
 * @returns Image attributes with matching intrinsic dimensions.
 */
export function image(source: ImageSource, options: ImageOptions): ResponsiveImage {
  const dimensions = geometry(source, options)
  const quality = options.quality ?? DEFAULT_QUALITY
  assertOptions(source, options, quality)
  const origin: string = ASSET_HOST.productionActive
    ? ASSET_HOST.canonicalOrigin
    : ASSET_HOST.origin
  const urlFor = (width: number): string => {
    const path = source.path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")
    const url = new URL(path, `${origin}/`)
    url.searchParams.set("width", String(width))
    url.searchParams.set("aspect_ratio", options.aspectRatio.join(":"))
    if (options.focus !== undefined) {
      url.searchParams.set(
        "focus_crop",
        `${dimensions.cropWidth},${dimensions.cropHeight},${options.focus.join(",")}`
      )
    }
    url.searchParams.set("quality", String(quality))
    return url.href
  }
  return {
    height: Math.round(options.width / dimensions.ratio),
    src: urlFor(options.width),
    srcSet: dimensions.widths.map((width) => `${urlFor(width)} ${width}w`).join(", "),
    width: options.width,
  }
}
