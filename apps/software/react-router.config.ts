import type { Config } from "@react-router/dev/config"

const variant = process.env.SITE_VARIANT ?? "software-en"

export default {
  buildDirectory: `build/${variant}`,
  prerender: ["/"],
  ssr: false,
} satisfies Config
