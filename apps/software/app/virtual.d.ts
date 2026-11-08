declare module "virtual:software-metrics" {
  import type { MetricsSummary } from "@sebastian-websites/content"

  const metrics: MetricsSummary
  export default metrics
}

declare module "virtual:software-catalog" {
  import type { CompiledCatalogMessages } from "@palamedes/core"

  export const messages: CompiledCatalogMessages
}

declare module "@sebastian-websites/ui/styles.css"

declare module "virtual:software-blog-tags" {
  /**
   * The tag keys with an archive in the other language, written by `build.ts`
   * while staging the posts. Only the tag archive module imports it.
   */
  const tags: { readonly otherLanguage: readonly string[] }
  export default tags
}
