import { websiteViteConfig } from "@sebastian-websites/site/config"

export default websiteViteConfig({
  root: import.meta.dirname,
  optimizeDeps: { include: ["marked"] },
  ssr: { optimizeDeps: { include: ["marked"] } },
})
