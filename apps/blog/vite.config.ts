import { websiteViteConfig } from "@sebastian-websites/site/config"

import { blogData } from "./scripts/blog-data.ts"

export default websiteViteConfig({
  root: import.meta.dirname,
  define: { __BLOG_INDEXED__: JSON.stringify(process.env.BLOG_INDEXED !== "false") },
  plugins: [blogData()],
})
