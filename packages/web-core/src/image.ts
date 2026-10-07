/** The canonical hostname is enabled after its DNS and TLS are verified. */
export const ASSET_HOST: Readonly<{
  canonicalOrigin: string
  origin: string
  productionActive: boolean
}> = {
  canonicalOrigin: "https://assets.sebastian-software.com",
  origin: "https://sebastian-websites-assets.b-cdn.net",
  productionActive: true,
} as const

export type ImageSource = {
  readonly height: number
  /** Vite development URL; absent from production builds. */
  readonly localSrc?: string
  readonly path: string
  readonly width: number
}

export type ImageCrop =
  | { readonly mode: "center" }
  | { readonly mode: "faces" }
  | {
      readonly mode: "focus"
      readonly point: readonly [number, number]
      /** Crops tighter than the largest rectangle, for comparable framing; at least 1. */
      readonly zoom?: number
    }

export type ImageOptions = {
  readonly aspectRatio: readonly [number, number]
  readonly crop?: ImageCrop
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
  const zoom = options.crop?.mode === "focus" ? (options.crop.zoom ?? 1) : 1
  if (!Number.isFinite(zoom) || zoom < 1) {
    throw new Error("Image zoom must be at least 1")
  }
  const cropWidth = Math.floor(Math.min(source.width, source.height * ratio) / zoom)
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
  assertCrop(options)
  if (source.path.split("/").some((part) => part === "" || part === "." || part === "..")) {
    throw new Error("Image source must be a relative asset path")
  }
}

function assertCrop(options: ImageOptions): void {
  const focus = options.crop?.mode === "focus" ? options.crop.point : options.focus
  if (focus?.some((point) => !Number.isFinite(point) || point < 0 || point > 1)) {
    throw new Error("Invalid focal coordinates")
  }
  if (options.focus !== undefined && options.crop !== undefined) {
    throw new Error("Use either crop or the legacy focus option")
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
    const focus = options.crop?.mode === "focus" ? options.crop.point : options.focus
    // Bunny ignores `focus_crop` when `aspect_ratio` is present; the focus
    // rectangle already carries the ratio, so each crop sends one parameter.
    if (options.crop?.mode === "faces") {
      url.searchParams.set("face_crop", `${dimensions.cropWidth},${dimensions.cropHeight}`)
    } else if (focus === undefined) {
      url.searchParams.set("aspect_ratio", options.aspectRatio.join(":"))
    } else {
      url.searchParams.set(
        "focus_crop",
        `${dimensions.cropWidth},${dimensions.cropHeight},${focus.join(",")}`
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

// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Shared responsive image width ladder in pixels.
const RESPONSIVE_WIDTHS = [320, 480, 640, 960, 1280, 1920, 2560] as const
const MAX_PIXEL_DENSITY = 3

/**
 * Builds browser-selectable variants up to 3x the placement width, bounded by
 * the original crop. Shared with components and responsive preloads.
 *
 * @param source - Original dimensions, shared asset path, and optional local URL.
 * @param options - Placement dimensions, crop, and optional candidate widths.
 * @returns Image attributes; local development serves the unprocessed original.
 */
export function responsiveImage(source: ImageSource, options: ImageOptions): ResponsiveImage {
  if (!Number.isSafeInteger(options.width) || options.width <= 0) {
    throw new Error("Image placement width must be a positive integer")
  }
  // Validate the dimensions before deriving the maximum crop width.
  const dimensions = geometry(source, { ...options, width: 1, widths: [1] })
  const width = Math.min(options.width, dimensions.cropWidth)
  const maxWidth = Math.min(options.width * MAX_PIXEL_DENSITY, dimensions.cropWidth)
  const candidates = options.widths ?? [...RESPONSIVE_WIDTHS, maxWidth]
  if (candidates.some((candidate) => !Number.isSafeInteger(candidate) || candidate <= 0)) {
    throw new Error("Image variant widths must be positive integers")
  }
  const widths = [
    ...new Set([...candidates.map((candidate) => Math.min(candidate, maxWidth)), width]),
  ]
  const result = image(source, { ...options, width, widths })
  return source.localSrc === undefined ? result : { ...result, src: source.localSrc, srcSet: "" }
}
