import type { ResponsiveImage } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import { blocks } from "@sebastian-websites/ui"

import { PHOTO_SIZES } from "~/lib/photos"

export type PhotoProps = {
  readonly alt: string
  readonly caption?: string
  readonly frame: keyof typeof blocks.photoFrame
  readonly image: ResponsiveImage
  readonly priority?: boolean
}

/**
 * A photograph in a rounded frame, cropped to its subject. Every placement
 * declares its frame and focal point here, so crops are reviewed with the code.
 *
 * @param props - Source, frame, focal point, and an optional caption.
 * @returns The framed photograph.
 */
export function Photo(props: PhotoProps): ReactElement {
  const { alt, caption, frame, image: photo, priority = false } = props
  return (
    <div className={`${blocks.photo} ${blocks.photoFrame[frame]}`}>
      <img
        alt={alt}
        className={blocks.photoImage}
        loading={priority ? "eager" : "lazy"}
        {...photo}
        fetchPriority={priority ? "high" : undefined}
        sizes={PHOTO_SIZES}
      />
      {caption === undefined ? null : (
        <span className={blocks.caption}>
          <i className={blocks.dot} />
          {caption}
        </span>
      )}
    </div>
  )
}
