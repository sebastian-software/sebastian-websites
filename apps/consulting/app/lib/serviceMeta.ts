import type { ArdoMetaDescriptor } from "ardo/runtime"

import { pageMeta } from "@sebastian-websites/site/meta"
import { createSocialMeta, responsiveImage } from "@sebastian-websites/web-core"

import { HOME_PHOTO } from "./photos.ts"
import { variant } from "./site.ts"

const PREVIEW_WIDTH = 1200
const PREVIEW_HEIGHT = 630

const preview = responsiveImage(HOME_PHOTO.src, {
  aspectRatio: [PREVIEW_WIDTH, PREVIEW_HEIGHT],
  crop: HOME_PHOTO.crop,
  width: PREVIEW_WIDTH,
})

/**
 * Complete metadata for the dedicated, paired service routes.
 * @param path - The paired service route.
 * @param title - The localized page heading.
 * @param description - The localized service description.
 * @returns Page, social, and language metadata.
 */
export function serviceMeta(
  path: string,
  title: string,
  description: string
): ArdoMetaDescriptor[] {
  const pageTitle = `${title} – Sebastian Consulting`
  return pageMeta(variant, path, [
    { title: pageTitle },
    { content: description, name: "description" },
    ...createSocialMeta({
      description,
      image: { height: preview.height, url: preview.src, width: preview.width },
      locale: variant.locale,
      path,
      site: "consulting",
      siteName: "Sebastian Consulting",
      title: pageTitle,
    }),
  ])
}
