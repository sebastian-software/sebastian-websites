import type { ReactElement } from "react"

import { blocks } from "@sebastian-websites/ui"

export type PhotoProps = {
  readonly alt: string
  readonly caption?: string
  /** The CSS `object-position` that keeps the subject in the frame. */
  readonly focus: string
  readonly frame: keyof typeof blocks.photoFrame
  readonly priority?: boolean
  readonly src: string
}

/**
 * A photograph in a rounded frame, cropped to its subject. Every placement
 * declares its frame and focal point here, so crops are reviewed with the code.
 *
 * @param props - Source, frame, focal point, and an optional caption.
 * @returns The framed photograph.
 */
export function Photo(props: PhotoProps): ReactElement {
  const { alt, caption, focus, frame, priority = false, src } = props
  return (
    <div className={`${blocks.photo} ${blocks.photoFrame[frame]}`}>
      <img
        alt={alt}
        className={blocks.photoImage}
        loading={priority ? "eager" : "lazy"}
        src={src}
        style={{ objectPosition: focus }}
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
