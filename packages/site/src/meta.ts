import type { ArdoMetaDescriptor } from "ardo/runtime"

import { createSeoLinks, type VariantDefinition } from "@sebastian-websites/web-core"

/**
 * Attach the preserved cross-domain canonical and language links to route metadata.
 * @param variant - The domain and language being rendered.
 * @param path - The public page path.
 * @param descriptors - The route metadata.
 * @returns Metadata including canonical and alternate language links.
 */
export function pageMeta(
  variant: VariantDefinition,
  path: string,
  descriptors: ArdoMetaDescriptor[]
): ArdoMetaDescriptor[] {
  return [
    ...descriptors,
    ...createSeoLinks(variant.site, variant.locale, path).map((link) => ({
      tagName: "link" as const,
      ...link,
    })),
  ]
}
