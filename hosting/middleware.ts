// The Bunny pull-zone middleware of every website target. Bundled by
// hosting/bundle.ts, which defines the storage zone, and published by
// hosting/provision.ts. It runs on Bunny's edge runtime, not in Node.
import * as BunnySdk from "@bunny.net/edgescript-sdk"

import { originRequest } from "./middleware-logic.ts"

declare const STORAGE_ZONE: string

BunnySdk.net.http
  .servePullZone()
  .onOriginRequest((context) => originRequest(context.request, STORAGE_ZONE))
