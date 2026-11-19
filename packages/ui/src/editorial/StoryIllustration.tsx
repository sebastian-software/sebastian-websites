import type { ReactElement } from "ardo/react"

import { BunnyImage, type BunnyImageProps } from "../BunnyImage.tsx"
import { editorialSizes } from "../responsive.ts"
import * as styles from "./editorial.css.ts"

/** Six columns of the editorial grid, with a native 3:2 original. */
const WIDTH = 504
const HEIGHT = 336

/**
 * Renders a landscape beside a story on either side of the page.
 * @param props - The original image and its localized description.
 * @returns A responsive editorial illustration.
 */
export function StoryIllustration(props: Pick<BunnyImageProps, "alt" | "src">): ReactElement {
  return (
    <BunnyImage
      {...props}
      className={styles.paperIllustration}
      height={HEIGHT}
      sizes={editorialSizes(WIDTH)}
      width={WIDTH}
    />
  )
}
