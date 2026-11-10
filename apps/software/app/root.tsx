import { createSiteRoot } from "@sebastian-websites/site/root"
import "@sebastian-websites/ui/brand-software.css"

// eslint-disable-next-line import/no-unassigned-import -- Initialize translations before Ardo evaluates route metadata.
import "~/lib/i18n"
import { blogPageReference } from "~/lib/blog"
import { variant } from "~/lib/site"

const { App, ErrorBoundary, Layout, meta } = createSiteRoot({
  pageReference: blogPageReference,
  variant,
  year: __BUILD_YEAR__,
})

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads root metadata and document exports.
export { ErrorBoundary, Layout, meta }
export default App
