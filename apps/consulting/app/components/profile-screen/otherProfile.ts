import type { Portrait } from "~/lib/photos"

import { getConsultant as getFastnerConsultant } from "~/data/fastner.data"
import { getConsultant as getWernerConsultant } from "~/data/werner.data"
import { PROFILE_PHOTOS } from "~/lib/photos"

export type OtherProfile = {
  focus: string
  name: string
  photo: Portrait
  slug: string
}

// The boutique has exactly two consultants; each profile cross-links the
// other one. Name and focus line come from the live consultant data so the
// teaser can never drift from the profile it points to.
export function getOtherProfile(currentId: string): OtherProfile {
  if (currentId === "werner") {
    const fastner = getFastnerConsultant()
    return {
      focus: fastner.focus,
      name: fastner.name,
      photo: PROFILE_PHOTOS.fastner.teaser,
      slug: "fastner",
    }
  }
  const werner = getWernerConsultant()
  return {
    focus: werner.focus,
    name: werner.name,
    photo: PROFILE_PHOTOS.werner.teaser,
    slug: "werner",
  }
}
