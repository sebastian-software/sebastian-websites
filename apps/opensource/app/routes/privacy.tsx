import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { PrivacyDocument } from "@sebastian-websites/legal"
import { pageMeta } from "@sebastian-websites/site/meta"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { variant } from "~/lib/site"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/privacy", [
    { title: t`Privacy Policy – Sebastian Software Open Source` },
  ])
}

export default function Privacy(): ReactElement {
  return (
    <main id="main">
      <PrivacyDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
