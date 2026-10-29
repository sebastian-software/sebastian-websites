import { createRobots } from "@sebastian-websites/web-core"

import { variant } from "~/lib/site"

export function loader(): Response {
  return new Response(createRobots(variant.site, variant.locale), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
