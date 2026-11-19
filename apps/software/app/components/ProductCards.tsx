import type { ReactElement } from "ardo/react"

import { blocks, editorialSizes, Illustration, KerameikosLogo } from "@sebastian-websites/ui"

import { getProducts } from "~/data/products"

import { ProductAction } from "./ProductAction"
import * as styles from "./ProductCards.css.ts"

const CARD_WIDTH = 336

/**
 * Shows each product with a full-width illustration, its identity and next step.
 * @returns The product grid.
 */
export function ProductCards(): ReactElement {
  return (
    <div className={blocks.cards}>
      {getProducts().map((product) => (
        <article className={styles.card} key={product.id}>
          <Illustration
            alt={product.illustration.alt}
            className={styles.image}
            height={224}
            sizes={editorialSizes(CARD_WIDTH)}
            src={product.illustration.src}
            width={CARD_WIDTH}
          />
          <div className={styles.body}>
            <h2 className={styles.title}>
              <KerameikosLogo name={product.name} />
            </h2>
            <p className={blocks.cardText}>{product.description}</p>
            <p className={styles.action}>
              <ProductAction action={product.action} />
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
