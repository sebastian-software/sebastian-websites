import type { PublicationTagLabel } from "ardo/config"

import { t } from "@palamedes/core/macro"

/**
 * The translated label of a registered tag key: one case per key in
 * `BLOG_TAGS` of web-core, each a Palamedes message, so both catalogs carry
 * it. The key stays the tag's identity in URLs, the sitemap, and feeds. Ardo
 * calls it while it renders, on the server and during hydration.
 * @param key - A key from the web-core tag registry.
 * @returns The label in the build's language, or the key for an unknown one.
 */
const tagLabel: PublicationTagLabel = (key) => {
  switch (key) {
    case "internationalization": {
      return t`Internationalization`
    }
    default: {
      return key
    }
  }
}

export default tagLabel
