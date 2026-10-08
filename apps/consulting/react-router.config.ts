import type { Config } from "@react-router/dev/config"

import { PAGES } from "./app/lib/pages.ts"

const variant = process.env.SITE_VARIANT ?? "consulting-en"

export default {
  buildDirectory: `build/${variant}`,
  prerender: [...PAGES, "/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/404"],
  ssr: false,
} satisfies Config
