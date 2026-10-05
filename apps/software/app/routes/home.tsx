import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"

import type { Route } from "./+types/home"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [{ title: t`Sebastian Software` }]
}

export default function Home(): ReactElement {
  return (
    <main>
      <h1>
        <Trans>Experience. Clarity. Enthusiasm.</Trans>
      </h1>
      <p>
        <Trans>The new Sebastian Software site is being built.</Trans>
      </p>
    </main>
  )
}
