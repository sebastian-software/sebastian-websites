import type { createI18n } from "@palamedes/core"
import type { ArdoServerRenderContext } from "ardo/runtime"

import { createServerI18nScope } from "@palamedes/runtime/server"
import { createViteCatalogDelivery } from "@palamedes/vite-plugin/delivery"
import { PageError } from "@sebastian-websites/ui"
import { createPageErrorCopy } from "@sebastian-websites/ui/error-copy"
import { createElement } from "ardo/react"
import { renderToStaticMarkup } from "ardo/react-dom/server"
import path from "node:path"

/**
 * Scope translations across Ardo's page and document renders.
 * @param create - The locale-bound translation factory.
 * @returns The Ardo render-context hook.
 */
export function withSiteI18n(create: () => ReturnType<typeof createI18n>) {
  const scope = createServerI18nScope()
  const variantId = process.env.SITE_VARIANT ?? `${path.basename(process.cwd())}-en`
  const delivery = createViteCatalogDelivery({
    clientDirectory: path.resolve(process.env.SITE_OUTPUT_ROOT ?? "build", variantId, "client"),
    development: import.meta.env.DEV,
  })
  return async (context: ArdoServerRenderContext): ReturnType<ArdoServerRenderContext["render"]> =>
    scope.run(create(), async () => {
      const document = await context.render()
      const locale = variantId.endsWith("-de") ? "de" : "en"
      const transform = delivery.createDocumentTransform(delivery.getLocaleBinding(locale), {
        errorHtml: renderToStaticMarkup(createElement(PageError, { copy: createPageErrorCopy() })),
      })
      transform.end(document.html)
      let html = ""
      for await (const chunk of transform) html += String(chunk)
      return { ...document, html }
    })
}
