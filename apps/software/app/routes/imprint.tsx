import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ImprintDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { seoMeta } from "~/lib/seo"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return [...seoMeta("/imprint"), { title: t`Legal Notice – Sebastian Software` }]
}

export default function Imprint(): ReactElement {
  return (
    <main id="main">
      <ImprintDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
