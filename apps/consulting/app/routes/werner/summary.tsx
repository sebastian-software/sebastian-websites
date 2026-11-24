import type { ReactNode } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"
import { jsonLd, personIdentity } from "@sebastian-websites/web-core"

import { WernerProfileDocument } from "~/components/werner-profile/WernerProfileDocument"
import { createSeoMetadata } from "~/lib/meta"
import { variant } from "~/lib/site"
import { COMPANY_BRAND } from "~/lib/untranslated"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(
    variant,
    "/werner/summary",
    createSeoMetadata({
      description: t`Frontend architecture, internationalization, UI quality, performance, and developer tooling.`,
      openGraphType: "profile",
      siteName: COMPANY_BRAND,
      title: t`Sebastian Werner – Executive Summary`,
    })
  )
}

export default function WernerSummary(): ReactNode {
  return (
    <>
      <script type="application/ld+json">
        {jsonLd({ "@context": "https://schema.org", ...personIdentity("werner", variant.locale) })}
      </script>
      <WernerProfileDocument view="executive_summary" />
    </>
  )
}
