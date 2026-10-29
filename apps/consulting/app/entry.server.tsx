import { createServerI18nScope } from "@palamedes/runtime/server"
import { createBundledServerI18n } from "@palamedes/runtime/server/bundled"
import { createViteCatalogDelivery } from "@palamedes/vite-plugin/delivery"
import { createReadableStreamFromReadable } from "@react-router/node"
import { PageError } from "@sebastian-websites/ui"
import { createPageErrorCopy } from "@sebastian-websites/ui/error-copy"
import { fileURLToPath } from "node:url"
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server"
import { type EntryContext, ServerRouter } from "react-router"

import { variant } from "~/lib/site"

export const streamTimeout = 5000
const SERVER_ERROR_STATUS = 500

const scope = createServerI18nScope()
const delivery = createViteCatalogDelivery({
  clientDirectory: fileURLToPath(new URL("../client", import.meta.url)),
  development: import.meta.env.DEV,
})

// eslint-disable-next-line max-params -- React Router defines the server entry signature.
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
): Promise<Response> {
  if (request.method === "HEAD") {
    return new Response(null, { headers: responseHeaders, status: responseStatusCode })
  }

  let status = responseStatusCode
  const binding = delivery.getLocaleBinding(variant.locale)
  const i18n = await createBundledServerI18n({ locale: variant.locale, timeZone: "Europe/Berlin" })

  return scope.run(
    i18n,
    async () =>
      new Promise<Response>((resolve, reject) => {
        const document = delivery.createDocumentTransform(binding, {
          errorHtml: renderToStaticMarkup(<PageError copy={createPageErrorCopy()} />),
        })
        const { abort, pipe } = renderToPipeableStream(
          <ServerRouter context={routerContext} url={request.url} />,
          {
            // Wait for the complete document before writing static pages.
            onAllReady() {
              clearTimeout(timeout)
              responseHeaders.set("Content-Type", "text/html")
              pipe(document)
              resolve(
                new Response(createReadableStreamFromReadable(document), {
                  headers: responseHeaders,
                  status,
                })
              )
            },
            onError(error: unknown) {
              status = SERVER_ERROR_STATUS
              console.error(error)
            },
            onShellError(error: unknown) {
              clearTimeout(timeout)
              reject(
                error instanceof Error
                  ? error
                  : new Error("Document rendering failed", { cause: error })
              )
            },
          }
        )
        const timeout = setTimeout(abort, streamTimeout)
      })
  )
}
