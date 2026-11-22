import type { ArdoMDXComponents } from "ardo/mdx-provider"
import type { ComponentType, ImgHTMLAttributes, ReactElement } from "ardo/react"

type ImageAttributes = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "decoding" | "fetchPriority" | "height" | "loading" | "sizes" | "width"
>

export type IllustrationSource = ComponentType<{ components?: ArdoMDXComponents } & ImageAttributes>

export type IllustrationProps = {
  readonly alt: string
  readonly priority?: boolean
  readonly sizes: string
  readonly src: IllustrationSource
} & ImageAttributes

/**
 * Places an image prepared by Ardo from a local MDX snippet.
 * @param props - The source, localized alternative text and layout attributes.
 * @returns A responsive picture in its native composition.
 */
export function Illustration(props: IllustrationProps): ReactElement {
  const { priority, src: Image, ...attributes } = props
  return (
    <Image
      {...attributes}
      fetchPriority={priority === true ? "high" : attributes.fetchPriority}
      loading={priority === true ? "eager" : attributes.loading}
    />
  )
}
