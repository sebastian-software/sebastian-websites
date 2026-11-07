import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { PrivacyDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { ToolReportingPrivacy } from "~/components/ToolReportingPrivacy"
import { legalConfig } from "~/lib/legal"
import { seoMeta } from "~/lib/seo"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return seoMeta({
    description: t`How Sebastian Software GmbH processes personal data on this website, and the rights you have.`,
    path: "/privacy",
    title: t`Privacy Policy – Sebastian Software`,
  })
}

export default function Privacy(): ReactElement {
  return (
    <main id="main">
      <PrivacyDocument
        additionalSections={<ToolReportingPrivacy />}
        classes={legalClassNames}
        config={legalConfig}
      />
    </main>
  )
}
