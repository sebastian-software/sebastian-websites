import { useEffect } from "ardo/react"

import { initializeBrandInteractions } from "../interactions.ts"
import content from "./brand.html?raw"

/** Keep the public reference markup independent of the framework shell. */
export default function BrandAssets() {
  useEffect(initializeBrandInteractions, [])
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}
