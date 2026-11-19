import { type BunnyImageProps, editorialSizes } from "@sebastian-websites/ui"

const CENTER = 0.5
const LAPTOP_FOCUS = 0.62
const BUILDING_FOCUS_X = 0.49
const BUILDING_FOCUS_Y = 0.745
const WERNER_FOCUS_X = 0.42
const WERNER_FOCUS_Y = 0.37
const FASTNER_FOCUS_X = 0.47
const FASTNER_FOCUS_Y = 0.38
const BUILDING_WIDTH = 768
const BUILDING_HEIGHT = 1024
const CLOSING_COLUMN_WIDTH = 384
const PORTRAIT_SMALL = 150
const PORTRAIT_MEDIUM = 300
const PORTRAIT_LARGE = 450
const PORTRAIT_ZOOM = 1.75

export type PhotoPlacement = Pick<BunnyImageProps, "crop" | "height" | "src" | "width" | "widths">

// The right column takes two fifths of the editorial grid after its gutter.
export const PHOTO_SIZES = editorialSizes(CLOSING_COLUMN_WIDTH)

export const laptopPhoto = {
  crop: { mode: "focus", point: [CENTER, LAPTOP_FOCUS] },
  src: { height: 3520, path: "shooting-2024/color_09092024-19-retouched.png", width: 2352 },
} as const satisfies Pick<BunnyImageProps, "crop" | "src">

export const buildingPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [BUILDING_FOCUS_X, BUILDING_FOCUS_Y], zoom: 1.8 },
  height: BUILDING_HEIGHT,
  src: { height: 3520, path: "shooting-2024/color_09092024-26-retouched.png", width: 2352 },
  width: BUILDING_WIDTH,
}

export const wernerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [WERNER_FOCUS_X, WERNER_FOCUS_Y], zoom: PORTRAIT_ZOOM },
  height: PORTRAIT_MEDIUM,
  src: { height: 3520, path: "shooting-2024/color_09092024-3-retouched.png", width: 2352 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}

export const fastnerPhoto: PhotoPlacement = {
  crop: { mode: "focus", point: [FASTNER_FOCUS_X, FASTNER_FOCUS_Y], zoom: PORTRAIT_ZOOM },
  height: PORTRAIT_MEDIUM,
  src: { height: 3520, path: "shooting-2024/color_09092024-4-retouched.png", width: 2352 },
  width: PORTRAIT_MEDIUM,
  widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
}

const TEAM_FOCUS = 0.42

/** Both founders in the office lounge, at the top of the homepage. */
export const teamPhoto = {
  crop: { mode: "focus", point: [CENTER, TEAM_FOCUS] },
  src: { height: 2352, path: "shooting-2024/color_09092024-14-retouched.png", width: 3520 },
} as const satisfies Pick<BunnyImageProps, "crop" | "src">
