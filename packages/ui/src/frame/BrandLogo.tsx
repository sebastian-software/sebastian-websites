import type { BrandId } from "@sebastian-websites/web-core"
import type { ReactElement } from "react"

import consultingLogo from "../assets/logo-consulting.svg"
import softwareLogo from "../assets/logo-software.svg"

/** The complete original lockups, cropped to their artwork. */
const LOGOS = {
  consulting: { height: 760, src: consultingLogo, width: 5004 },
  software: { height: 760, src: softwareLogo, width: 4840 },
} as const satisfies Readonly<Record<BrandId, { height: number; src: string; width: number }>>

export type BrandLogoProps = {
  /** The brand name as the image's text alternative. */
  readonly alt: string
  readonly brand: BrandId
  readonly className?: string
  /** The rendered artwork height in CSS pixels. */
  readonly height: number
}

/**
 * The current brand's complete logo: emblem, Sebastian, slash, and suffix, in
 * the original artwork. Only the publishing site shows its logo.
 *
 * @param props - Brand, display height, and text alternative.
 * @returns The logo image with reserved dimensions.
 */
export function BrandLogo(props: BrandLogoProps): ReactElement {
  const { alt, brand, className, height } = props
  const logo = LOGOS[brand]
  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      height={height}
      src={logo.src}
      width={Math.round((logo.width / logo.height) * height)}
    />
  )
}
