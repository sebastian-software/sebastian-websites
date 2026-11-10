import type { ArdoMetaDescriptor } from "ardo/runtime"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { pageMeta } from "@sebastian-websites/site/meta"

import { ReportingPage } from "~/components/ReportingPage"
import { variant } from "~/lib/site"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads page metadata.
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/", [
    { title: t`Usage reporting and privacy – app-tracking` },
    {
      content: t`Why Sebastian Software asks for optional usage reports, what those reports contain, and how to inspect, disable, or delete them.`,
      name: "description",
    },
  ])
}
export default function Home(): ReactElement {
  return <ReportingPage />
}
