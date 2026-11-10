import { withSiteI18n } from "@sebastian-websites/site/server"

import { createSiteI18n } from "./lib/i18n.ts"

export const withRenderContext = withSiteI18n(createSiteI18n)
