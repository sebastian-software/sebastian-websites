import type { ArdoMetaDescriptor } from "ardo/runtime"

import { createFrameCopy } from "@sebastian-websites/ui/frame-copy"
import {
  createSeoLinks,
  createSocialMeta,
  responsiveImage,
  type SocialArticle,
  type SocialImage,
} from "@sebastian-websites/web-core"

import { teamPhoto } from "./photos.ts"
import { variant } from "./site.ts"

/** Open Graph's recommended large preview: 1200 × 630 pixels. */
const PREVIEW_WIDTH = 1200
const PREVIEW_HEIGHT = 630

/**
 * The default social preview of every page until posts get their own images:
 * both founders from the homepage photograph, cropped by the shared Bunny helper.
 */
const preview = responsiveImage(teamPhoto.src, {
  aspectRatio: [PREVIEW_WIDTH, PREVIEW_HEIGHT],
  crop: teamPhoto.crop,
  width: PREVIEW_WIDTH,
})
const DEFAULT_IMAGE: SocialImage = {
  height: preview.height,
  url: preview.src,
  width: preview.width,
}

export type PageMeta = {
  /** Article times for posts; they set `og:type=article`. */
  readonly article?: SocialArticle
  /**
   * Whether the page exists in the other language; defaults to true. A page
   * without a counterpart gets its canonical and no alternates.
   */
  readonly counterpart?: boolean
  readonly description: string
  /** The canonical route path. */
  readonly path: string
  readonly title: string
}

/**
 * The head metadata of an indexable route: title, description, the canonical
 * and cross-domain language links, and Open Graph with a Twitter card.
 *
 * @param page - The route's canonical path, copy, and optional article times.
 * @returns The route's meta descriptors.
 */
export function seoMeta(page: PageMeta): ArdoMetaDescriptor[] {
  const links = createSeoLinks(variant.site, variant.locale, {
    counterpart: page.counterpart ?? true,
    path: page.path,
  }).map<ArdoMetaDescriptor>((link) => ({
    href: link.href,
    rel: link.rel,
    tagName: "link",
    ...(link.hrefLang === undefined ? {} : { hrefLang: link.hrefLang }),
  }))
  return [
    ...links,
    { title: page.title },
    { content: page.description, name: "description" },
    ...createSocialMeta({
      ...(page.article === undefined ? {} : { article: page.article }),
      description: page.description,
      image: DEFAULT_IMAGE,
      locale: variant.locale,
      path: page.path,
      site: variant.site,
      siteName: createFrameCopy(__BUILD_YEAR__).brandNames.software,
      title: page.title,
    }),
  ]
}
