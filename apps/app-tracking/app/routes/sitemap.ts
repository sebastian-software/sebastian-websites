import { createSitemap } from "@sebastian-websites/web-core"

import { PAGES } from "~/lib/pages"
import { variant } from "~/lib/site"

export function loader(): Response {
  return new Response(createSitemap(variant.site, variant.locale, PAGES), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
