import type { ReactElement } from "ardo/react"

import { ArrowLink, editorial } from "@sebastian-websites/ui"

import type { Product } from "~/data/products"

/**
 * Shows the available destination or the announcement in the same position.
 * @param props - The product's closing action.
 * @param props.action - The label and optional destination.
 * @returns A link or a plain status.
 */
export function ProductAction({ action }: { readonly action: Product["action"] }): ReactElement {
  if (action.href === undefined) return <span className={editorial.small}>{action.label}</span>
  return <ArrowLink href={action.href}>{action.label}</ArrowLink>
}
