import { createElement, type ImgHTMLAttributes, type ReactElement } from "ardo/react"

/**
 * Renders the image attributes for unit tests of the surrounding site frame.
 * @param props - The attributes passed by the placement.
 * @returns The frame's image element.
 */
export default function ImageModule(props: ImgHTMLAttributes<HTMLImageElement>): ReactElement {
  return createElement("img", props)
}
