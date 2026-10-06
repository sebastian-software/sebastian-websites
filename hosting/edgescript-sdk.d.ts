/**
 * The slice of Bunny's edge-script SDK the middleware uses. The edge runtime
 * provides the module; the bundle keeps it external.
 */
declare module "@bunny.net/edgescript-sdk" {
  export type OriginRequestContext = { readonly request: Request }
  export type OriginRequestHandler = (
    context: OriginRequestContext
  ) => Promise<Request | Response> | Request | Response
  export type PullZoneServer = {
    readonly onOriginRequest: (handler: OriginRequestHandler) => PullZoneServer
  }
  export const net: {
    readonly http: {
      readonly servePullZone: () => PullZoneServer
    }
  }
}
