import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { ImprintDocument } from "@sebastian-websites/legal"
import { pageMeta } from "@sebastian-websites/site/meta"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { variant } from "~/lib/site"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/imprint", [
    { title: t`Legal Notice – Sebastian Software app-tracking` },
  ])
}

export default function Imprint(): ReactElement {
  return (
    <main id="main">
      <ImprintDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
