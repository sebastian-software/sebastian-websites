import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { ServicePage } from "~/components/ServicePage"
import { getServicePage, SERVICE_PATHS } from "~/data/services"
import { serviceMeta } from "~/lib/serviceMeta"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const page = getServicePage("architecture")
  return serviceMeta(SERVICE_PATHS.architecture, page.title, page.description)
}

export default function ArchitectureReview(): ReactElement {
  return <ServicePage id="architecture" />
}
