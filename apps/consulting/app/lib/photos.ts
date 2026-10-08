import type { ImageCrop, ImageSource } from "@sebastian-websites/web-core"

/** A founder portrait from the shared asset zone; originals stay outside Git (ADR-0014). */
export type Portrait = {
  readonly crop: ImageCrop
  readonly src: ImageSource
}

// Zoom and focal point are tuned per photo so that both heads appear at a
// comparable scale and height in the shared 7:10 frame.
const FACE_HEIGHT = 0.36
const FASTNER_FACE = 0.47
const FASTNER_ZOOM = 1.62
const WERNER_FACE = 0.42
const WERNER_ZOOM = 1.48

export const PORTRAITS = {
  fastner: {
    crop: { mode: "focus", point: [FASTNER_FACE, FACE_HEIGHT], zoom: FASTNER_ZOOM },
    src: { height: 1536, path: "shooting-2024-edit/color_09092024-4-retouched.png", width: 1024 },
  },
  werner: {
    crop: { mode: "focus", point: [WERNER_FACE, FACE_HEIGHT], zoom: WERNER_ZOOM },
    src: { height: 1536, path: "shooting-2024-edit/color_09092024-3-retouched.png", width: 1024 },
  },
} as const satisfies Readonly<Record<string, Portrait>>

const SHOOT_15 = {
  height: 1024,
  path: "shooting-2024-edit/color_09092024-15-retouched.png",
  width: 1536,
} as const
const SHOOT_31 = {
  height: 1536,
  path: "shooting-2024-edit/color_09092024-31-retouched.png",
  width: 1024,
} as const
const SHOOT_32 = {
  height: 1024,
  path: "shooting-2024-edit/color_09092024-32-retouched.png",
  width: 1536,
} as const

/**
 * The printable profile's photo frame (128 × 170 pt). One 532 px variant gives
 * about 300 ppi on paper, matching the former print assets.
 */
export const SHEET_PHOTO = { height: 709, width: 532 } as const

// Focal points and zoom reproduce the framing of the former print assets,
// which were cropped by hand from the same originals.
const FASTNER_CENTER = 0.575
const FASTNER_SHEET_HEIGHT = 0.467
const FASTNER_TEASER_HEIGHT = 0.423
const WERNER_TEASER_CENTER = 0.533
const WERNER_TEASER_HEIGHT = 0.362

/**
 * Profile photographs from the shared asset zone: `sheet` fills the printable
 * profile's frame, `teaser` the 7:9 rail link to the other consultant.
 */
export const PROFILE_PHOTOS = {
  fastner: {
    sheet: {
      crop: { mode: "focus", point: [FASTNER_CENTER, FASTNER_SHEET_HEIGHT], zoom: 1.564 },
      src: SHOOT_31,
    },
    teaser: {
      crop: { mode: "focus", point: [FASTNER_CENTER, FASTNER_TEASER_HEIGHT], zoom: 3.406 },
      src: SHOOT_31,
    },
  },
  werner: {
    sheet: { crop: { mode: "center" }, src: SHOOT_15 },
    teaser: {
      crop: { mode: "focus", point: [WERNER_TEASER_CENTER, WERNER_TEASER_HEIGHT], zoom: 1.429 },
      src: SHOOT_32,
    },
  },
} as const satisfies Readonly<Record<string, Readonly<Record<"sheet" | "teaser", Portrait>>>>

// Both founders in conversation in front of the sandstone wall, cropped wide.
const TEAM_CENTER = 0.55
const TEAM_HEIGHT = 0.62

/** The team page's opening photograph. */
export const TEAM_PHOTO = {
  crop: { mode: "focus", point: [TEAM_CENTER, TEAM_HEIGHT], zoom: 1.3 },
  src: { height: 1024, path: "shooting-2024-edit/color_09092024-34-retouched.png", width: 1536 },
} as const satisfies Portrait
