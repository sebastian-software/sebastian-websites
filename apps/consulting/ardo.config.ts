import { createSiteConfig } from "@sebastian-websites/site/config"

import { profileContent } from "./scripts/profile-content.ts"

export default createSiteConfig({
  site: "consulting",
  root: import.meta.dirname,
  title: "Sebastian Consulting",
  // The profile PDFs use their own print assets. Skip editorial image preparation
  // in the private preview used by the PDF renderer, before the normal site build.
  ...(process.env.CONSULTING_PDF_PREVIEW === "true" ? { images: undefined } : {}),
  vite: { plugins: [profileContent()] },
})
