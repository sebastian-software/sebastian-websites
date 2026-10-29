import { t } from "@palamedes/core/macro"

import type { PageErrorCopy } from "./PageError.tsx"

/**
 * Resolves recovery text while the root catalog is available. The server also
 * embeds the rendered view, so initial catalog failures need no translation.
 *
 * @returns Recovery labels in the current document's language.
 */
export function createPageErrorCopy(): PageErrorCopy {
  return {
    home: t`Go to the home page`,
    reload: t`Reload page`,
    text: t`We couldn't load this page. Check your connection and reload, or return to the home page.`,
    title: t`This page couldn't be loaded.`,
  }
}
