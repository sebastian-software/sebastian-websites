import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"

import { ReportingPage } from "~/components/ReportingPage"

import type { Route } from "./+types/home"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads page metadata.
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Usage reporting and privacy – app-tracking` },
    {
      content: t`Why Sebastian Software asks for optional usage reports, what those reports contain, and how to inspect, disable, or delete them.`,
      name: "description",
    },
  ]
}
export default function Home(): ReactElement {
  return <ReportingPage />
}
