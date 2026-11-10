declare module "virtual:opensource-build-data" {
  import type { ActivityProjection } from "@sebastian-websites/content"

  import type { Snapshot } from "~/lib/metrics-model"

  export const activity: ActivityProjection
  export const metrics: Snapshot
}
