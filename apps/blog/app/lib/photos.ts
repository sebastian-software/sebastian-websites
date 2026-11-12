import type { BunnyImageProps } from "@sebastian-websites/ui"

const CENTER = 0.5
const TEAM_FOCUS = 0.42

/** Both founders in the office lounge; the shared social preview of every page. */
export const teamPhoto = {
  crop: { mode: "focus", point: [CENTER, TEAM_FOCUS] },
  src: { height: 2352, path: "shooting-2024/color_09092024-14-retouched.png", width: 3520 },
} as const satisfies Pick<BunnyImageProps, "crop" | "src">
