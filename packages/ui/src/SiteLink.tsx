import type { ComponentPropsWithRef, ReactElement } from "react"

import { Link } from "react-router"

export type SiteLinkProps = {
  readonly download?: boolean | string
} & Omit<ComponentPropsWithRef<"a">, "download">

/**
 * Uses the router for local page paths and native navigation for fragments,
 * downloads, language changes, and destinations outside this site.
 *
 * @param props - Native anchor attributes.
 * @returns A link with the appropriate navigation behavior.
 */
export function SiteLink(props: SiteLinkProps): ReactElement {
  const { children, download, href, hrefLang, ...rest } = props
  if (
    href?.startsWith("/") &&
    !href.startsWith("//") &&
    (download === undefined || download === false) &&
    (hrefLang === undefined || hrefLang === "")
  ) {
    return (
      <Link {...rest} to={href}>
        {children}
      </Link>
    )
  }
  return (
    <a {...rest} download={download} href={href} hrefLang={hrefLang}>
      {children}
    </a>
  )
}
