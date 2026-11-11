declare module "virtual:software-metrics" {
  import type { MetricsSummary } from "@sebastian-websites/content"

  const metrics: MetricsSummary
  export default metrics
}

declare module "virtual:software-blog-data" {
  const data: {
    readonly counterparts: Readonly<Record<string, null | string>>
    readonly otherLanguage: readonly string[]
  }
  export default data
}
