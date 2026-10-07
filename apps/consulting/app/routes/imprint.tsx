import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ImprintDocument } from "@sebastian-websites/legal"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"

import type { Route } from "./+types/imprint"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [{ title: t`Legal Notice – Sebastian Consulting` }]
}

export default function Imprint(): ReactElement {
  return (
    <main id="main">
      <ImprintDocument classes={legalClassNames} config={legalConfig} />
    </main>
  )
}
