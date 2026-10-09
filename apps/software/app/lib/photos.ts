import type { BunnyImageProps } from "@sebastian-websites/ui"

const CENTER = 0.5
const LAPTOP_FOCUS = 0.62
const BUILDING_FOCUS = 0.76
const PORTRAIT_FOCUS = 0.22
const PHOTO_WIDTH = 800
const LANDSCAPE_HEIGHT = 600
const PORTRAIT_SMALL = 72
const PORTRAIT_MEDIUM = 144
const PORTRAIT_LARGE = 216

export type PhotoPlacement = Pick<BunnyImageProps, "crop" | "height" | "src" | "width" | "widths">

// 560 design pixels grow to 623 px where the root reaches its largest size.
export const PHOTO_SIZES =
  "(min-width: 1281px) and (min-height: 1025px) 623px, (min-width: 1200px) 560px, (min-width: 900px) 45vw, 90vw"

export const laptopPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, LAPTOP_FOCUS] },
  height: LANDSCAPE_HEIGHT,
  src: { height: 5942, path: "shooting-2024/shoot-19.jpg", width: 3961 },
  width: PHOTO_WIDTH,
}

export const buildingPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, BUILDING_FOCUS] },
  height: LANDSCAPE_HEIGHT,
  src: { height: 5166, path: "shooting-2024/shoot-26.jpg", width: 3444 },
  width: PHOTO_WIDTH,
}

export const wernerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, PORTRAIT_FOCUS] },
  height: PORTRAIT_MEDIUM,
  src: { height: 5861, path: "shooting-2024/shoot-3.jpg", width: 3907 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}

export const fastnerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, PORTRAIT_FOCUS] },
  height: PORTRAIT_MEDIUM,
  src: { height: 5890, path: "shooting-2024/shoot-4.jpg", width: 3927 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}
