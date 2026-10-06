import { image } from "@sebastian-websites/web-core"

const CENTER = 0.5
const HERO_FOCUS = 0.72
const LAPTOP_FOCUS = 0.62
const BUILDING_FOCUS = 0.76
const PORTRAIT_FOCUS = 0.22
const LANDSCAPE_WIDTH = 4
const LANDSCAPE_HEIGHT = 3
const PORTRAIT_SMALL = 72
const PORTRAIT_MEDIUM = 144
const PORTRAIT_LARGE = 216

export const PHOTO_SIZES = "(min-width: 1200px) 560px, (min-width: 900px) 45vw, 90vw"

export const heroPhoto = image(
  { height: 5397, path: "shooting-2024/shoot-39.jpg", width: 3598 },
  { aspectRatio: [1, 1], focus: [CENTER, HERO_FOCUS], width: 800 }
)

export const laptopPhoto = image(
  { height: 5942, path: "shooting-2024/shoot-19.jpg", width: 3961 },
  { aspectRatio: [LANDSCAPE_WIDTH, LANDSCAPE_HEIGHT], focus: [CENTER, LAPTOP_FOCUS], width: 800 }
)

export const buildingPhoto = image(
  { height: 5166, path: "shooting-2024/shoot-26.jpg", width: 3444 },
  { aspectRatio: [LANDSCAPE_WIDTH, LANDSCAPE_HEIGHT], focus: [CENTER, BUILDING_FOCUS], width: 800 }
)

export const wernerPhoto = image(
  { height: 5861, path: "shooting-2024/shoot-3.jpg", width: 3907 },
  {
    aspectRatio: [1, 1],
    focus: [CENTER, PORTRAIT_FOCUS],
    width: 144,
    widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
  }
)

export const fastnerPhoto = image(
  { height: 5890, path: "shooting-2024/shoot-4.jpg", width: 3927 },
  {
    aspectRatio: [1, 1],
    focus: [CENTER, PORTRAIT_FOCUS],
    width: 144,
    widths: [PORTRAIT_SMALL, PORTRAIT_MEDIUM, PORTRAIT_LARGE],
  }
)
