import type { Config } from "@react-router/dev/config"

import { PAGES } from "./app/lib/pages.ts"

const variant = process.env.SITE_VARIANT ?? "opensource-en"

export default {
  buildDirectory: `build/${variant}`,
  prerender: [...PAGES, "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"],
  ssr: false,
} satisfies Config
