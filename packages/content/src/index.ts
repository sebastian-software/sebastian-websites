export { clients } from "./data/clients.ts"
export { FAMILIES, FERRAMENTA_REPOSITORIES } from "./data/families.ts"
export { testimonials } from "./data/testimonials.ts"
export {
  type ActivityProjection,
  fetchActivity,
  fetchMetricsSummary,
  METRICS_URL,
  type MetricsSnapshot,
  type MetricsSummary,
  projectActivity,
  type RegistryPackage,
  type RepositoryActivity,
  summarizeMetrics,
} from "./metrics.ts"
export type { Client, Consultant, Locale, Testimonial } from "./types.ts"
