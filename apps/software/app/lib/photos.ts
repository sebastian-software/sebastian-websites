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
  "(min-width: 1200px) and (min-height: 1025px) 623px, (min-width: 1200px) 560px, (min-width: 900px) 45vw, 90vw"

export const laptopPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, LAPTOP_FOCUS] },
  height: LANDSCAPE_HEIGHT,
  src: { height: 3520, path: "shooting-2024/color_09092024-19-retouched.png", width: 2352 },
  width: PHOTO_WIDTH,
}

export const buildingPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, BUILDING_FOCUS] },
  height: LANDSCAPE_HEIGHT,
  src: { height: 3520, path: "shooting-2024/color_09092024-26-retouched.png", width: 2352 },
  width: PHOTO_WIDTH,
}

export const wernerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, PORTRAIT_FOCUS] },
  height: PORTRAIT_MEDIUM,
  src: { height: 3520, path: "shooting-2024/color_09092024-3-retouched.png", width: 2352 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}

export const fastnerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [CENTER, PORTRAIT_FOCUS] },
  height: PORTRAIT_MEDIUM,
  src: { height: 3520, path: "shooting-2024/color_09092024-4-retouched.png", width: 2352 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}

const TEAM_FOCUS = 0.42

/** Both founders in the office lounge, across the homepage below the introduction. */
export const teamPhoto = {
  crop: { mode: "focus", point: [CENTER, TEAM_FOCUS] },
  src: { height: 2352, path: "shooting-2024/color_09092024-14-retouched.png", width: 3520 },
} as const satisfies Pick<BunnyImageProps, "crop" | "src">
