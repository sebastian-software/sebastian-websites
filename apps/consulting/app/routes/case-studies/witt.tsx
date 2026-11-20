import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { CaseStudy } from "~/components/CaseStudy"
import { getWittCaseStudy, WITT_CASE_PATH } from "~/data/case-studies/witt"
import { serviceMeta } from "~/lib/serviceMeta"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const study = getWittCaseStudy()
  return serviceMeta(WITT_CASE_PATH, study.title, study.description)
}

export default function WittCaseStudy(): ReactElement {
  return <CaseStudy study={getWittCaseStudy()} />
}
