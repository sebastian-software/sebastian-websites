import type { ArdoMetaDescriptor } from "ardo/runtime"

import { createSeoLinks } from "@sebastian-websites/web-core"

import { variant } from "./site.ts"

/**
 * Keep canonical and cross-domain language URLs on every content route.
 * @param path - The canonical route path.
 * @returns Link metadata for both domains.
 */
export function seoMeta(path: string): ArdoMetaDescriptor[] {
  return createSeoLinks(variant.site, variant.locale, path).map<ArdoMetaDescriptor>((link) => ({
    href: link.href,
    rel: link.rel,
    tagName: "link",
    ...(link.hrefLang === undefined ? {} : { hrefLang: link.hrefLang }),
  }))
}
