import { defineArdoConfig } from "ardo/config"

// Public token, font, and logo URLs are an external contract (ADR-0013).
export default defineArdoConfig({
  title: "Sebastian — Brand Assets",
  description: "Brand assets for the Sebastian brand system: color tokens, logos, and icons.",
  siteUrl: "https://brand.sebastian-software.com",
  outDir: "build",
  lang: "en",
  icons: false,
  seo: { llms: false },
  linkCheck: { level: "error" },
})
