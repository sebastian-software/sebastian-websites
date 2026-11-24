import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { CaseStudy } from "~/components/CaseStudy"
import { ENBW_CASE_PATH, getEnbwCaseStudy } from "~/data/case-studies/enbw"
import { serviceMeta } from "~/lib/serviceMeta"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const study = getEnbwCaseStudy()
  return serviceMeta(ENBW_CASE_PATH, study.title, study.description)
}

export default function EnbwCaseStudy(): ReactElement {
  return <CaseStudy study={getEnbwCaseStudy()} />
}
