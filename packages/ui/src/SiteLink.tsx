import type { ComponentPropsWithRef, ReactElement } from "ardo/react"

export type SiteLinkProps = { readonly download?: boolean | string } & Omit<
  ComponentPropsWithRef<"a">,
  "download"
>

/**
 * Native links share Ardo's document navigation, fragment, and download behavior.
 * @returns The native link.
 * @param props - Native anchor attributes and children.
 */
export function SiteLink(props: SiteLinkProps): ReactElement {
  const { children, ...attributes } = props
  return <a {...attributes}>{children}</a>
}
