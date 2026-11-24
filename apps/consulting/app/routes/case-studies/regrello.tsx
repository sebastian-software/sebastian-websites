import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { CaseStudy } from "~/components/CaseStudy"
import { getRegrelloCaseStudy, REGRELLO_CASE_PATH } from "~/data/case-studies/regrello"
import { serviceMeta } from "~/lib/serviceMeta"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads route metadata
export function meta(): ArdoMetaDescriptor[] {
  const study = getRegrelloCaseStudy()
  return serviceMeta(REGRELLO_CASE_PATH, study.title, study.description)
}

export default function RegrelloCaseStudy(): ReactElement {
  return <CaseStudy study={getRegrelloCaseStudy()} />
}
