import type { ReactElement } from "ardo/react"

import {
  alternate,
  editorial,
  KerameikosLogo,
  Story,
  StoryIllustration,
} from "@sebastian-websites/ui"

import type { Product } from "~/data/products"

import { ProductAction } from "./ProductAction"
import * as styles from "./ProductStory.css.ts"

export type ProductStoryProps = {
  readonly index: number
  readonly product: Product
}

/**
 * One product as an illustrated story: its original identity, a headline, what
 * it does for whom, and the next step. The side alternates with the position.
 *
 * @param props - The product and its position in the collection.
 * @returns An article with identity, text, action, and illustration.
 */
export function ProductStory(props: ProductStoryProps): ReactElement {
  const { index, product } = props
  const side = alternate(index)
  const headingId = `product-${product.id}`
  return (
    <Story
      aria-labelledby={headingId}
      media={<StoryIllustration {...product.illustration} />}
      mediaPosition={side}
    >
      <div className={styles.identity}>
        <KerameikosLogo name={product.name} />
      </div>
      <h2 className={editorial.storyHeading} id={headingId}>
        {product.title}
      </h2>
      <p className={editorial.bodySerif}>{product.description}</p>
      <p className={editorial.storyActions}>
        <ProductAction action={product.action} />
      </p>
    </Story>
  )
}
