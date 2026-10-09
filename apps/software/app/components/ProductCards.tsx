import type { ReactElement } from "react"

import { blocks, button } from "@sebastian-websites/ui"

import { getProducts } from "~/data/products"

/**
 * The product cards: status, name, what it is for, and where to go next. They
 * render the same collection as the home page, so both pages always agree.
 *
 * @returns The card grid.
 */
export function ProductCards(): ReactElement {
  return (
    <div className={blocks.cards}>
      {getProducts().map((product) => (
        <article className={blocks.card} key={product.id}>
          <span
            className={product.released ? blocks.status : `${blocks.status} ${blocks.statusSoon}`}
          >
            {product.status}
          </span>
          <h3 className={blocks.cardTitle}>{product.name}</h3>
          <p className={blocks.cardText}>{product.description}</p>
          <a className={`${button.ghost} ${blocks.columnLink}`} href={product.action.href}>
            {product.action.label} <span aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  )
}
