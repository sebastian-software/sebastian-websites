// The pull-zone middleware of a target that serves the Tereon collector under
// its own domain. Bundled by hosting/bundle.ts instead of middleware.ts only for
// targets with a collector, so every other target's bundle stays unchanged.
import * as BunnySdk from "@bunny.net/edgescript-sdk"

import {
  type CollectorForwarding,
  firstPartyOriginRequest,
  FORWARD_SECRET_NAME,
} from "./middleware-logic.ts"

declare const STORAGE_ZONE: string
declare const COLLECTOR: CollectorForwarding

/**
 * Reads the forwarder secret from the script's environment, where Bunny puts
 * script secrets; reading can throw where environment access is denied.
 *
 * @returns The secret, or undefined when it is not set.
 */
function forwardSecret(): string | undefined {
  try {
    return process.env[FORWARD_SECRET_NAME]
  } catch {
    return undefined
  }
}

BunnySdk.net.http.servePullZone().onOriginRequest(async (context) =>
  firstPartyOriginRequest(
    context.request,
    { forwarding: COLLECTOR, storageZone: STORAGE_ZONE },
    {
      // Called through an object, the global fetch would lose its receiver.
      fetch: async (input, init) => fetch(input, init),
      now: () => new Date(),
      secret: forwardSecret(),
    }
  )
)
