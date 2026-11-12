import { fetchMetricsSummary } from "@sebastian-websites/content"
import { createSiteConfig } from "@sebastian-websites/site/config"

import type { Plugin } from "ardo/vite"

const metrics = process.env.SOFTWARE_METRICS ?? JSON.stringify(await fetchMetricsSummary())
const data: Plugin = {
  name: "software:metrics",
  resolveId: (id) => (id === "virtual:software-metrics" ? `\0${id}` : undefined),
  load: (id) => (id === "\0virtual:software-metrics" ? `export default ${metrics}` : undefined),
}

export default createSiteConfig({
  site: "software",
  root: import.meta.dirname,
  vite: { plugins: [data] },
  title: "Sebastian Software",
})
