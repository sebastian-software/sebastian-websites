import { fetchMetricsSummary } from "@sebastian-websites/content"
import { runBuilds } from "@sebastian-websites/site/build"

// Both domains receive the same immutable metrics observation.
process.env.SOFTWARE_METRICS = JSON.stringify(await fetchMetricsSummary())
await runBuilds("software")
