import type { ArdoServerRenderContext } from "ardo/runtime"

import { createServerI18nScope } from "@palamedes/runtime/server"

import { createSiteI18n } from "./lib/i18n.ts"

const scope = createServerI18nScope()

/**
 * Keep the selected locale scoped across the complete Ardo page and document render.
 * @param context - Ardo's complete render callback.
 * @returns The rendered document and status.
 */
export async function withRenderContext(
  context: ArdoServerRenderContext
): ReturnType<ArdoServerRenderContext["render"]> {
  return scope.run(createSiteI18n(), context.render)
}
