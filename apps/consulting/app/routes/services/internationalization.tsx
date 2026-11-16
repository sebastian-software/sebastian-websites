import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { ServicePage } from "~/components/ServicePage"
import { getServicePage, SERVICE_PATHS } from "~/data/services"
import { serviceMeta } from "~/lib/serviceMeta"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const page = getServicePage("internationalization")
  return serviceMeta(SERVICE_PATHS.internationalization, page.title, page.description)
}

export default function Internationalization(): ReactElement {
  return <ServicePage id="internationalization" />
}
