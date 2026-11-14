import { createSiteConfig } from "@sebastian-websites/site/config"

import { profileContent } from "./scripts/profile-content.ts"

export default createSiteConfig({
  site: "consulting",
  root: import.meta.dirname,
  title: "Sebastian Consulting",
  vite: { plugins: [profileContent()] },
})
