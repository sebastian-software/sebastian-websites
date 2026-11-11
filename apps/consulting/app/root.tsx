import { createSiteRoot } from "@sebastian-websites/site/root"
import "@sebastian-websites/ui/brand-consulting.css"

// eslint-disable-next-line import/no-unassigned-import -- Initialize the public translation runtime before Ardo resolves page metadata.
import "~/lib/i18n"
import "~/styles/print-pages.css"
import "~/styles/print.css"
import { variant } from "~/lib/site"

const { App, ErrorBoundary, Layout, meta } = createSiteRoot({ variant, year: __BUILD_YEAR__ })

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads the root layout, recovery component, and metadata exports.
export { ErrorBoundary, Layout, meta }
export default App
