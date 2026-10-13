import type { ReactNode } from "react"

import { t } from "@palamedes/core/macro"
import { useLoaderData } from "react-router"

import { WernerProfile } from "~/components/werner-profile/WernerProfile"
import { getConsultant } from "~/data/werner.data"
import { activeLocale } from "~/lib/i18n"
import { createSeoMetadata } from "~/lib/meta"
import { PROFILE_PHOTOS } from "~/lib/photos"
import { COMPANY_BRAND } from "~/lib/untranslated"

import type { Route } from "./+types/profile.werner.document"

// eslint-disable-next-line react-refresh/only-export-components -- route loader and metadata share the document module
export function loader({ params }: Route.LoaderArgs): {
  view: "executive_summary" | "project_history"
} {
  if (params.document === "summary") return { view: "executive_summary" }
  if (params.document === "projects") return { view: "project_history" }
  // eslint-disable-next-line @typescript-eslint/only-throw-error -- React Router uses Response for HTTP error status
  throw new Response("Not found", { status: 404 })
}

// eslint-disable-next-line react-refresh/only-export-components -- route metadata is part of the route contract
export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  return createSeoMetadata({
    description: t`Frontend architecture, internationalization, UI quality, performance, and developer tooling.`,
    openGraphType: "profile",
    siteName: COMPANY_BRAND,
    title:
      params.document === "projects"
        ? t`Sebastian Werner – Project History`
        : t`Sebastian Werner – Executive Summary`,
  })
}

export default function WernerProfileDocument(): ReactNode {
  const { view } = useLoaderData<typeof loader>()
  const consultant = getConsultant()
  return (
    <WernerProfile
      consultant={{ ...consultant, photo: PROFILE_PHOTOS.werner.sheet }}
      lang={activeLocale}
      view={view}
    />
  )
}
