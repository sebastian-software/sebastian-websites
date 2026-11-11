import type { ReactNode } from "react"

import { WernerProfile } from "~/components/werner-profile/WernerProfile"
import { getConsultant } from "~/data/werner.data"
import { activeLocale } from "~/lib/i18n"
import { PROFILE_PHOTOS } from "~/lib/photos"

export function WernerProfileDocument({
  view,
}: {
  readonly view: "executive_summary" | "project_history"
}): ReactNode {
  const consultant = getConsultant()
  return (
    <WernerProfile
      consultant={{ ...consultant, photo: PROFILE_PHOTOS.werner.sheet }}
      lang={activeLocale}
      view={view}
    />
  )
}
