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
    src: { height: 5890, path: "shooting-2024/shoot-4.jpg", width: 3927 },
  },
  werner: {
    crop: { mode: "focus", point: [WERNER_FACE, FACE_HEIGHT], zoom: WERNER_ZOOM },
    src: { height: 5861, path: "shooting-2024/shoot-3.jpg", width: 3907 },
  },
} as const satisfies Readonly<Record<string, Portrait>>
