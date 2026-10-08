import type { ReactElement } from "react"

import {
  alternate,
  ArrowLink,
  BunnyImage,
  editorial,
  editorialSizes,
  Story,
} from "@sebastian-websites/ui"

import type { Product, ProductId } from "~/data/products"

import palamedesMark from "~/assets/brands/palamedes-mark.svg"
import palamedesPlusWordmark from "~/assets/brands/palamedes-plus-wordmark.svg"
import terminaroEmblem from "~/assets/brands/terminaro-emblem.svg"
import terminaroWordmark from "~/assets/brands/terminaro-wordmark.svg"

import * as styles from "./ProductStory.css.ts"

/** Original artwork per product: the emblem and its wordmark in the product's own face. */
const IDENTITIES: Partial<
  Record<ProductId, { readonly mark: string; readonly ratio: number; readonly wordmark: string }>
> = {
  "palamedes-plus": { mark: palamedesMark, ratio: 9.178, wordmark: palamedesPlusWordmark },
  terminaro: { mark: terminaroEmblem, ratio: 8.222, wordmark: terminaroWordmark },
}

const MARK_SIZE = 92
const WORDMARK_HEIGHT = 34

function Identity(props: {
  readonly product: Product
  readonly side: "end" | "start"
}): ReactElement {
  const { product, side } = props
  const identity = IDENTITIES[product.id]
  const status = <span className={styles.status}>{product.status}</span>
  if (identity === undefined) {
    return (
      <div className={styles.identity[side]}>
        <span className={styles.name}>
          <span className={styles.textName}>{product.name}</span>
          {status}
        </span>
      </div>
    )
  }
  const wordmarkStyle = product.id === "terminaro" ? "terminaro" : "palamedes-plus"
  return (
    <div className={styles.identity[side]}>
      <img
        alt=""
        className={styles.mark}
        height={MARK_SIZE}
        src={identity.mark}
        width={MARK_SIZE}
      />
      <span className={styles.name}>
        <img
          alt={product.name}
          className={styles.wordmark[wordmarkStyle]}
          height={WORDMARK_HEIGHT}
          src={identity.wordmark}
          width={Math.round(WORDMARK_HEIGHT * identity.ratio)}
        />
        {status}
      </span>
    </div>
  )
}

const MEDIA = {
  end: { height: 480, width: 640 },
  start: { height: 420, width: 560 },
} as const

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
  const media = MEDIA[side]
  const headingId = `product-${product.id}`
  return (
    <Story
      aria-labelledby={headingId}
      media={
        <BunnyImage
          alt={product.illustration.alt}
          className={editorial.media}
          height={media.height}
          priority={index === 0}
          sizes={editorialSizes(media.width)}
          src={product.illustration.src}
          width={media.width}
        />
      }
      mediaPosition={side}
    >
      <div className={styles.content}>
        <Identity product={product} side={side} />
        <h2 className={editorial.storyHeading} id={headingId}>
          {product.title}
        </h2>
        <p className={styles.text}>{product.description}</p>
        <p className={editorial.storyActions}>
          <ArrowLink href={product.action.href}>{product.action.label}</ArrowLink>
        </p>
      </div>
    </Story>
  )
}
