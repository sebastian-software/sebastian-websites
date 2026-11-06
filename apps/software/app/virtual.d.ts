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
