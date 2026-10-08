import type { BrandId } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import { FAVICONS, WEB_MANIFEST_PATH } from "./favicons.ts"

export type FaviconLinksProps = {
  readonly brand: BrandId
}

/**
 * The head links of a site's favicon set, all hashed assets. The ICO declares
 * its 32 px size, so browsers that read SVG icons do not download it as well;
 * the unhashed `/favicon.ico` in each app's public folder serves clients that
 * never read the page.
 *
 * @param props - The brand whose icons the site shows.
 * @returns The icon, Apple touch icon, and manifest links.
 */
export function FaviconLinks(props: FaviconLinksProps): ReactElement {
  const icons = FAVICONS[props.brand]
  return (
    <>
      <link href={icons.ico} rel="icon" sizes="32x32" />
      <link href={icons.svg} rel="icon" type="image/svg+xml" />
      <link href={icons.appleTouch} rel="apple-touch-icon" />
      <link href={WEB_MANIFEST_PATH} rel="manifest" />
    </>
  )
}
