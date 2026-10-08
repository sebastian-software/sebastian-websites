import { createWebManifest } from "@sebastian-websites/ui"
import { SITE_BRAND } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

/** The installed app's name; brand names are the same in both languages. */
const NAME = "Sebastian Software"

export function loader(): Response {
  return new Response(createWebManifest(SITE_BRAND[variant.site], NAME), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  })
}
