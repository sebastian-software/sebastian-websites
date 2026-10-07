import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { PrivacyDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"

import type { Route } from "./+types/privacy"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [{ title: t`Privacy Policy – Sebastian Consulting` }]
}

export default function Privacy(): ReactElement {
  return (
    <main id="main">
      <PrivacyDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
