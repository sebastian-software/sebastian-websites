import type { ImageCrop, ImageOptions, ImageSource } from "@sebastian-websites/web-core"
import type { ComponentPropsWithRef, ReactElement } from "react"

import { responsiveImage } from "@sebastian-websites/web-core"

export type BunnyImageVariant = {
  readonly aspectRatio: readonly [number, number]
  readonly crop?: ImageCrop
  readonly media: string
  readonly sizes: string
  /** Optional alternative original for this layout. */
  readonly src?: ImageSource
  readonly widths?: readonly number[]
}

export type BunnyImageProps = {
  readonly alt: string
  readonly crop?: ImageCrop
  readonly height: number
  readonly priority?: boolean
  readonly quality?: number
  /** CSS display widths, including media conditions for fluid placements. */
  readonly sizes: string
  readonly sources?: readonly BunnyImageVariant[]
  readonly src: ImageSource
  readonly width: number
  readonly widths?: readonly number[]
} & Omit<
  ComponentPropsWithRef<"img">,
  "alt" | "children" | "height" | "sizes" | "src" | "srcSet" | "width"
>

function loadingAttributes(
  props: BunnyImageProps
): Pick<BunnyImageProps, "fetchPriority" | "loading"> {
  return props.priority === true
    ? { fetchPriority: "high", loading: "eager" }
    : { fetchPriority: props.fetchPriority, loading: props.loading ?? "lazy" }
}

const NO_SOURCES: readonly BunnyImageVariant[] = []

function pictureSource(
  variant: BunnyImageVariant,
  src: ImageSource,
  options: ImageOptions
): ReactElement {
  if (variant.media.trim() === "" || variant.sizes.trim() === "") {
    throw new Error("Picture sources require nonempty media and sizes")
  }
  const image = responsiveImage(variant.src ?? src, {
    ...options,
    aspectRatio: variant.aspectRatio,
    crop: variant.crop ?? options.crop,
    widths: variant.widths ?? options.widths,
  })
  return (
    <source
      height={image.height}
      key={variant.media}
      media={variant.media}
      sizes={image.srcSet === "" ? undefined : variant.sizes}
      srcSet={image.srcSet || image.src}
      width={image.width}
    />
  )
}

/**
 * A responsive Bunny image, with optional art direction through picture sources.
 * Native image attributes, styles, events, and refs belong to the img element.
 *
 * @param props - Original, placement dimensions, display sizes, and crop variants.
 * @returns An img, or a picture whose sources precede its fallback image.
 */
export function BunnyImage(props: BunnyImageProps): ReactElement {
  const {
    alt,
    crop,
    decoding = "async",
    fetchPriority,
    height,
    loading,
    priority = false,
    quality,
    sizes,
    sources = NO_SOURCES,
    src,
    width,
    widths,
    ...rest
  } = props
  if (!Number.isSafeInteger(height) || height <= 0 || sizes.trim() === "") {
    throw new Error("BunnyImage requires positive dimensions and nonempty sizes")
  }
  const options = { aspectRatio: [width, height] as const, crop, quality, width, widths }
  const fallback = responsiveImage(src, options)
  const img = (
    <img
      {...rest}
      alt={alt}
      decoding={decoding}
      {...loadingAttributes({ ...props, fetchPriority, loading, priority })}
      height={height}
      sizes={fallback.srcSet === "" ? undefined : sizes}
      src={fallback.src}
      srcSet={fallback.srcSet || undefined}
      width={width}
    />
  )
  if (sources.length === 0) return img
  return (
    <picture>
      {sources.map((variant) => pictureSource(variant, src, options))}
      {img}
    </picture>
  )
}
