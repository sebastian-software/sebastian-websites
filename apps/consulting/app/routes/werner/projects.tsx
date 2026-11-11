import type { ReactNode } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"

import { WernerProfileDocument } from "~/components/werner-profile/WernerProfileDocument"
import { createSeoMetadata } from "~/lib/meta"
import { variant } from "~/lib/site"
import { COMPANY_BRAND } from "~/lib/untranslated"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(
    variant,
    "/werner/projects",
    createSeoMetadata({
      description: t`Frontend architecture, internationalization, UI quality, performance, and developer tooling.`,
      openGraphType: "profile",
      siteName: COMPANY_BRAND,
      title: t`Sebastian Werner – Project History`,
    })
  )
}

export default function WernerProjects(): ReactNode {
  return <WernerProfileDocument view="project_history" />
}
