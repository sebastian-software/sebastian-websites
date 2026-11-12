import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { ImprintDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { seoMeta } from "~/lib/seo"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return seoMeta({
    description: t`Provider details of Sebastian Software GmbH in Mainz: address, contact, commercial register, and VAT ID.`,
    path: "/imprint",
    title: t`Legal Notice – Sebastian Software Blog`,
  })
}

export default function Imprint(): ReactElement {
  return (
    <main id="main">
      <ImprintDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
