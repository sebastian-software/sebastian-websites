import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { PrivacyDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { seoMeta } from "~/lib/seo"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return seoMeta({
    description: t`How Sebastian Software GmbH processes personal data on this blog, and the rights you have.`,
    path: "/privacy",
    title: t`Privacy Policy – Sebastian Software Blog`,
  })
}

export default function Privacy(): ReactElement {
  return (
    <main id="main">
      <PrivacyDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
